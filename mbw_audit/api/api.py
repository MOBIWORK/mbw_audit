import frappe
from frappe import _
import json
import sys
import os
__dir__ = os.path.dirname(os.path.abspath(__file__))
sys.path.append(__dir__)
sys.path.insert(0, os.path.abspath(os.path.join(__dir__, '../')))
from deepvision import DeepVision
from deepvision.service import (ProductCountService, OnShelfAvailabilityService, SequenceOfProductService)
from datetime import datetime
from mbw_audit.api.common import (gen_response, create_folder, base64_to_pillow_image, draw_box_label_pillow)
from frappe.utils.file_manager import (
    save_file
)
from frappe.core.doctype.file.utils import delete_file
from frappe.utils import now_datetime
from datetime import datetime
import base64
from mbw_audit.utils import appconst
from mbw_sfc_integrations.sfc_integrations.utils import create_sfc_log
from frappe import _, msgprint
from io import BytesIO
import uuid

@frappe.whitelist(methods=["POST"])
def test_queue(*args,**kwargs):
    #process_queue('Test label')
    frappe.enqueue("mbw_audit.api.api.process_queue", par={"pro": "one"})
    return "ok"

def process_queue(par):
    res = 1+1

@frappe.whitelist(methods=["POST"])
# param {items: arr,doctype: ''}
def deleteListByDoctype(*args,**kwargs):
    vectordb_dir = frappe.get_site_path()
    dms_settings = frappe.get_doc('DMS Settings')
    nguong_nhan_dien_sp = 0.6
    if hasattr(dms_settings, 'nguong_nhan_dien_sp'):
        nguong_nhan_dien_sp = frappe.get_doc('DMS Settings').nguong_nhan_dien_sp
        if nguong_nhan_dien_sp == 0 or nguong_nhan_dien_sp is None:
            nguong_nhan_dien_sp = 0.6
        if isinstance(nguong_nhan_dien_sp, str):
            nguong_nhan_dien_sp = float(nguong_nhan_dien_sp)
    deep_vision: DeepVision = DeepVision(vectordb_dir=vectordb_dir, sku_threshold=nguong_nhan_dien_sp)
    product_recognition: ProductRecognitionService = deep_vision.init_product_recognition_service(appconst.KEY_API_AI)
    products: Products = product_recognition.get_products()
    try:
        # Chuyển đổi ids từ chuỗi JSON thành danh sách Python
        ids_list = frappe.parse_json(kwargs.get('items'))

        # Lặp qua danh sách ids và thực hiện xóa
        for id in ids_list:
            if kwargs.get('doctype') == "VGM_Product":
                # Trong trường hợp doctype là VGM_Product, xóa sản phẩm trong mô hình AI
                doc = frappe.get_doc(kwargs.get('doctype'), id)
                product_name = doc.product_name
                collection_name = doc.category
                products.delete_product_by_name(collection_name, product_name)
                frappe.delete_doc(kwargs.get('doctype'), id)
            else:
                frappe.delete_doc(kwargs.get('doctype'), id)
        return {"status": "success"}
    except Exception as e:
        return {'status': 'fail', 'message': _("Failed to delete Product: {0}").format(str(e))}

@frappe.whitelist(methods=["POST"])
# param {items: arr,doctype: ''}
def checkImageProductExist(*args, **kwargs):
    try:
        vectordb_dir = frappe.get_site_path()
        dms_settings = frappe.get_doc('DMS Settings')
        nguong_nhan_dien_sp = 0.6
        # if hasattr(dms_settings, 'nguong_nhan_dien_sp'):
        #     nguong_nhan_dien_sp = frappe.get_doc('DMS Settings').nguong_nhan_dien_sp
        #     if nguong_nhan_dien_sp == 0 or nguong_nhan_dien_sp is None:
        #         nguong_nhan_dien_sp = 0.6
        #     if isinstance(nguong_nhan_dien_sp, str):
        #         nguong_nhan_dien_sp = float(nguong_nhan_dien_sp)
        deep_vision: DeepVision = DeepVision(vectordb_dir=vectordb_dir, sku_threshold=nguong_nhan_dien_sp)
        recognition: ProductCountService = deep_vision.init_product_count_service(appconst.KEY_API_AI)
        base_url = frappe.utils.get_request_site_address()
        collection_name = kwargs.get('collection_name')
        link_image = json.loads(kwargs.get('linkimages'))
        # url_images = post_images_check(image_base64)
        image_path = link_image
        # product_id = self.product
        # get_product_name =  frappe.get_value("Product", {"name": product_id}, "product_name")
        response = recognition.count(collection_name, image_path)
        if response.get('status') == 'completed':
            # Tính tổng của các danh sách sản phẩm từ mảng
            count_result = {}
            verbose_result = []
            for result in response.get("results", []):
                count = result.get("results", {}).get("count", {})
                verbose = result.get("results", {}).get("verbose", {})
                for key, value in count.items():
                    count_result[key] = count_result.get(key, 0) + value
                verbose_ais = render_check_image_ai([verbose])  # Xử lý qua hàm render_check_image_ai
                verbose_result.extend(verbose_ais)
                del verbose["base64_image"]
            doc_checking_product = frappe.new_doc('VGM_Checking_Count_Product')
            doc_checking_product.collection_id = collection_name
            doc_checking_product.url_image = json.dumps(link_image)
            doc_checking_product.url_image_ai = json.dumps(verbose_result)
            doc_checking_product.response_ai = json.dumps(response)
            doc_checking_product.insert()
            # Trả về kết quả dưới dạng `{count: {...}, verbose: [...]}`
            return {"status": "completed", "results": {"count": count_result, "verbose": verbose_result}}
        else:
            doc_checking_product = frappe.new_doc('VGM_Checking_Count_Product')
            doc_checking_product.collection_id = collection_name
            doc_checking_product.url_image = json.dumps(link_image)
            res_count_ai = {"status": "failed","error": str(response.get('error'))}
            doc_checking_product.response_ai = json.dumps(res_count_ai)
            doc_checking_product.insert()
            return {"status": "error", 'message': response}

    except Exception as e:
        # Xử lý các ngoại lệ xảy ra trong quá trình thực thi hàm
        error_message = str(e)  # Lấy thông tin lỗi
        return {"status": "error", "message": error_message}
     
@frappe.whitelist(methods=["POST"])
def delete_check_image_ai(*args, **kwargs):
    file_names = json.loads(kwargs.get('file_name'))

    # Kiểm tra xem danh sách tên tệp tin có tồn tại không
    if file_names:
        messages = []
        for file_name in file_names:
            # Tìm bản ghi trong Doctype 'File' có 'file_url' như được cung cấp
            file_docs = frappe.get_all("File", filters={"file_name": file_name})

            if file_docs:
                try:
                    # Xóa tất cả các bản ghi tệp
                    for file_doc in file_docs:
                        frappe.delete_doc("File", file_doc.name)
                    messages.append(f"Đã xóa tệp tin {file_name} thành công.")
                except Exception as e:
                    messages.append(f"Lỗi khi xóa tệp tin {file_name}: {e}")
            else:
                messages.append(f"Tệp tin {file_name} không tồn tại trong Doctype 'File'.")
        return {"messages": messages}
    else:
        return {"message": "Danh sách tên tệp tin không được cung cấp."}
    
@frappe.whitelist(methods=["POST"])
# param {collection_name: ''}
def deleteCategory(*args,**kwargs):
    vectordb_dir = frappe.get_site_path()
    dms_settings = frappe.get_doc('DMS Settings')
    nguong_nhan_dien_sp = 0.6
    if hasattr(dms_settings, 'nguong_nhan_dien_sp'):
        nguong_nhan_dien_sp = frappe.get_doc('DMS Settings').nguong_nhan_dien_sp
        if nguong_nhan_dien_sp == 0 or nguong_nhan_dien_sp is None:
            nguong_nhan_dien_sp = 0.6
        if isinstance(nguong_nhan_dien_sp, str):
            nguong_nhan_dien_sp = float(nguong_nhan_dien_sp)
    deep_vision: DeepVision = DeepVision(vectordb_dir=vectordb_dir, sku_threshold=nguong_nhan_dien_sp)
    product_recognition: ProductRecognitionService = deep_vision.init_product_recognition_service(appconst.KEY_API_AI)
    products: Products = product_recognition.get_products()
    collection_name = kwargs.get('collection_name')
    products.delete_all(collection_name)

    if response.get('status') == 'completed':
        return {"status": "success"}   
    else:
        return {"status": "error"}

@frappe.whitelist(methods=["POST"])
def get_campaign_info(*args,**kwargs):
    """
    Trả về thông tin chiến dịch (campaign) dựa trên customer_code và e_name,
    đồng thời kiểm tra xem cả customer_code và e_name có trong trường employees và retails không.

    :param customer_code: Mã khách hàng.
    :param e_name: Mã nhân viên.
    :return: Danh sách các bản ghi chiến dịch (campaign).
    """
    # Lấy thông tin chiến dịch dựa trên điều kiện
    campaign_records = frappe.get_all(
        "VGM_Campaign",
        fields=["*"]  # Thay thế field1, field2 bằng các trường bạn muốn lấy
    )
    # Lặp qua các bản ghi chiến dịch để kiểm tra customer_code và e_name
    valid_campaigns = []
    for campaign_record in campaign_records:
        # Truy cập trường employees của mỗi chiến dịch
        employees_json = frappe.db.get_value("VGM_Campaign", campaign_record.name, "employees")
        employees_list = json.loads(employees_json) if employees_json else []

        # Truy cập trường retails của mỗi chiến dịch
        retails_json = frappe.db.get_value("VGM_Campaign", campaign_record.name, "retails")
        retails_list = json.loads(retails_json) if retails_json else []
        # Kiểm tra xem customer_code có trong danh sách nhân viên không
        # và e_name có trong danh sách retails không
        if kwargs.get('customer_code') in retails_list and kwargs.get('e_name') in employees_list:
            valid_campaigns.append(campaign_record)
    return gen_response(200, "ok", {"data" : valid_campaigns})

@frappe.whitelist(methods=["GET"])
def get_list_employees():
    try:
        employees = frappe.get_all("Employee", fields=["designation","date_of_birth","image","personal_email","name","cell_number","employee_name"])
        return gen_response(200, "ok", {"data" : employees})
    except Exception as e:
        return gen_response(500, "error", {"data" : []})

@frappe.whitelist(methods=["GET"])
def get_list_customers():
    try:
        customers = frappe.get_all("Customer", fields=["name", "customer_name","customer_code", "primary_address"])
        return gen_response(200, "ok", {"data" : customers})
    except Exception as e:
        return gen_response(500, "error", {"data" : []})

@frappe.whitelist(methods=["POST"])
def record_report_data(*args, **kwargs):
    images_time = datetime.now()
    category = json.loads(kwargs.get('category'))
    categories_str = json.dumps(category)  # Chuyển đổi danh sách thành chuỗi JSON
    images = json.loads(kwargs.get('images'))
    images_str = json.dumps(images)
    setting_score_audit = json.loads(kwargs.get('setting_score_audit')) if kwargs.get('setting_score_audit') is not None else None
    try:
        doc = frappe.new_doc('VGM_Report')
        doc.retail_code = kwargs.get('customer_code')
        doc.employee_code = kwargs.get('e_name')
        doc.campaign_code = kwargs.get('campaign_code')
        doc.categories = categories_str
        doc.images_time = images_time
        doc.images = images_str
        doc.latitude_check_in = ''
        doc.latitude_check_out = ''
        doc.longitude_check_in = ''
        doc.longitude_check_out = ''
        doc.scoring_machine = 0
        doc.scoring_human = 0
        doc.insert()
        input_report_sku = {"name_doc": doc.name, "report_images": images, "category": category, "setting_score_audit": setting_score_audit}
        process_report_sku(input_report_sku)
        #frappe.enqueue("mbw_audit.api.api.process_report_sku", input_sku = input_report_sku)
        return gen_response(200, "ok", {"data" : doc.name})
    except Exception as e:
        return gen_response(500, "error", {"data" : _("Failed to add VGM Report: {0}").format(str(e))})

def process_report_sku(input_sku): #name, report_images, category, setting_score_audit
    try:
        name = input_sku["name_doc"]
        report_images = input_sku["report_images"]
        category = input_sku["category"]
        setting_score_audit = input_sku["setting_score_audit"]
        products_by_category = []
        for category_id in category:
            # Truy vấn các sản phẩm có category tương ứng
            products_in_category = frappe.get_all("VGM_Product", filters={"category": category_id}, fields=["*"])
            # Lấy danh sách tên sản phẩm
            info_products = [{"name": product.name, "product_name": product.product_name} for product in products_in_category]
            # Thêm danh sách tên sản phẩm vào từ điển theo category
            products_by_category.append({"category_id": category_id, "products": info_products})
        #Thêm các trường vào doctype con VGM_ReportDetailSKU
        if products_by_category:
            score_by_products = []
            for category_data in products_by_category:
                category_id = category_data["category_id"]
                info_products = category_data["products"]
                lst_product_check = {}
                lst_product_sequence = []
                resultExistProduct = {}
                resultSequenceProduct = {}
                #Sinh điều kiện sản phẩm tồn tại trong AI, nếu không có cấu hình thì mặc định là 0 để thực hiện lấy số lượng
                if setting_score_audit.get("min_product") is not None:
                    for info_product in info_products:
                        objMinProduct = setting_score_audit.get("min_product", {})
                        if objMinProduct is not None:
                            lst_product_check[info_product.get("product_name")] = objMinProduct.get(info_product.get("name"))
                    resultExistProduct = shelf_availability_by_category(category_id, report_images, lst_product_check)
                else:
                    for info_product in info_products:
                        lst_product_check[info_product.get("product_name")] = 0
                    resultExistProduct = shelf_availability_by_category(category_id, report_images, lst_product_check)
                #Sinh điều kiện sắp xếp sản phẩm và gọi sang AI để kiểm tra vị trí sắp xếp
                if setting_score_audit.get("sequence_product") is not None and len(setting_score_audit.get("sequence_product", [])) > 1:
                    obj_setting_sequences = setting_score_audit.get("sequence_product", [])
                    setting_sequence_dict = {obj["name"]: obj["product_name"] for obj in info_products}
                    lst_product_sequence = [setting_sequence_dict[id] for id in obj_setting_sequences if id in setting_sequence_dict]
                    resultSequenceProduct = sequence_of_product_by_category(category_id, report_images, lst_product_sequence)
                    if resultSequenceProduct.get("status") == "completed":
                        process_result_sequence = resultSequenceProduct.get("process_results", {})
                        sequence_of_product = process_result_sequence.get("sequence_of_product")
                        score_by_products.append(1 if sequence_of_product == 1 else 0)
                #Sinh dữ liệu báo cáo SKU
                
                desired_product_ids = setting_score_audit.get("min_product", {}).keys()
                # Nếu không có mã sản phẩm nào trong `desired_product_ids`, xử lý tất cả các sản phẩm trong `info_products`
                if not desired_product_ids:
                    products_to_process = info_products
                else:
                    products_to_process = [product for product in info_products if product['name'] in desired_product_ids]
                
                for info_product in products_to_process:
                    num_product_recog = 0
                    is_exist_product = 0 
                    if resultExistProduct.get("status") == "completed":
                        process_results = resultExistProduct.get("process_results")
                        count_product_recog = process_results.get("count")
                        num_product_recog = count_product_recog.get(info_product.get("product_name"), 0)
                        product_availability = process_results.get("on_shelf_availability", {}).get("availability_result",{}).get("product_availability")
                        if not desired_product_ids:
                            is_exist_product = 1 
                        else:
                            is_exist_product = 1 if product_availability is not None and info_product.get("product_name") in product_availability else 0   
                        score_by_products.append(is_exist_product)
                    child_doc = frappe.new_doc('VGM_ReportDetailSKU')
                    child_doc.update({
                        'parent': name, 
                        'parentfield': 'report_sku',
                        'parenttype': 'VGM_Report',
                        'category': category_id,
                        'sum_product': num_product_recog,
                        'product': info_product.get("name"),
                        'scoring_machine': is_exist_product,
                        'sum_product_human': num_product_recog,
                        'scoring_human': is_exist_product
                    })
                    child_doc.insert()
                if resultExistProduct.get("status") == "completed":
                    image_ais = render_image_ai(resultExistProduct.get("process_results",{}).get("verbose", []))
                    frappe.db.set_value('VGM_Report', name, 'image_ai', json.dumps(image_ais))
                    for item in resultExistProduct.get("process_results").get('verbose'):
                        del item["base64_image"]
                else:
                    frappe.db.set_value('VGM_Report', name, 'image_ai', json.dumps([]))
                frappe.db.set_value('VGM_Report', name, 'log_ai', json.dumps(resultExistProduct))
            if setting_score_audit is not None:
                doc_report = frappe.get_doc("VGM_Report", name)
                doc_report.scoring_machine = 0 if 0 in score_by_products else 1 if 1 in score_by_products else 0
                doc_report.scoring_human = 0 if 0 in score_by_products else 1 if 1 in score_by_products else 0
                doc_report.save()
            else:
                doc_report = frappe.get_doc("VGM_Report", name)
                doc_report.scoring_machine = 0
                doc_report.scoring_human = 0
                doc_report.save()
        write_upload_log(status=True, input_sku=input_sku, name_report=name, method="mbw_audit.api.api.process_report_sku")
    except Exception as e:
        write_upload_log(status=False, input_sku=input_sku, name_report=name, method="mbw_audit.api.api.process_report_sku")

def process_report_sku_update(input_sku): #name, report_images, category, setting_score_audit
    try:
        name = input_sku["name_doc"]
        report_images = input_sku["report_images"]
        category = input_sku["category"]
        setting_score_audit = input_sku["setting_score_audit"]
        products_by_category = []
        score_by_products = []
        for category_id in category:
            # Truy vấn các sản phẩm có category tương ứng
            products_in_category = frappe.get_all("VGM_Product", filters={"category": category_id}, fields=["*"])
            # Lấy danh sách tên sản phẩm
            info_products = [{"name": product.name, "product_name": product.product_name} for product in products_in_category]
            # Thêm danh sách tên sản phẩm vào từ điển theo category
            products_by_category.append({"category_id": category_id, "products": info_products})
        #Thêm các trường vào doctype con VGM_ReportDetailSKU
        if setting_score_audit.get("adjacencies") is not None:
            adjacencies = ai_adjacencies(collection_name,report_images,list_product)
        if products_by_category:
            
            for category_data in products_by_category:
                category_id = category_data["category_id"]
                info_products = category_data["products"]
                lst_product_check = {}
                lst_product_sequence = []
                resultExistProduct = {}
                resultSequenceProduct = {}
                #Sinh điều kiện sản phẩm tồn tại trong AI, nếu không có cấu hình thì mặc định là 0 để thực hiện lấy số lượng
                if setting_score_audit.get("min_product") is not None:
                    for info_product in info_products:
                        objMinProduct = setting_score_audit.get("min_product", {})
                        if objMinProduct is not None:
                            lst_product_check[info_product.get("product_name")] = objMinProduct.get(info_product.get("name"))
                    resultExistProduct = shelf_availability_by_category(category_id, report_images, lst_product_check)
                else:
                    for info_product in info_products:
                        lst_product_check[info_product.get("product_name")] = 0
                    resultExistProduct = shelf_availability_by_category(category_id, report_images, lst_product_check)
                #Sinh điều kiện sắp xếp sản phẩm và gọi sang AI để kiểm tra vị trí sắp xếp
                if setting_score_audit.get("sequence_product") is not None and len(setting_score_audit.get("sequence_product", [])) > 1:
                    obj_setting_sequences = setting_score_audit.get("sequence_product", [])
                    setting_sequence_dict = {obj["name"]: obj["product_name"] for obj in info_products}
                    lst_product_sequence = [setting_sequence_dict[id] for id in obj_setting_sequences if id in setting_sequence_dict]
                    resultSequenceProduct = sequence_of_product_by_category(category_id, report_images, lst_product_sequence)
                    if resultSequenceProduct.get("status") == "completed":
                        process_result_sequence = resultSequenceProduct.get("process_results", {})
                        sequence_of_product = process_result_sequence.get("sequence_of_product")
                        score_by_products.append(1 if sequence_of_product == 1 else 0)
                    
                #Sinh dữ liệu báo cáo SKU
                for info_product in info_products:
                    num_product_recog = 0
                    is_exist_product = 0 
                    if resultExistProduct.get("status") == "completed":
                        process_results = resultExistProduct.get("process_results")
                        count_product_recog = process_results.get("count")
        
                        num_product_recog = count_product_recog.get(info_product.get("product_name"), 0)
                        product_availability = process_results.get("on_shelf_availability", {}).get("availability_result",{}).get("product_availability")
                       
                        is_exist_product = 1 if product_availability is not None and info_product.get("product_name") in product_availability else 0
                        score_by_products.append(is_exist_product)
                    child_doc = frappe.new_doc('VGM_ReportDetailSKU')
                    child_doc.update({
                        'parent': name, 
                        'parentfield': 'report_sku',
                        'parenttype': 'VGM_Report',
                        'category': category_id,
                        'sum_product': num_product_recog,
                        'product': info_product.get("name"),
                        'scoring_machine': is_exist_product,
                        'sum_product_human': num_product_recog,
                        'scoring_human': is_exist_product
                    })
                    child_doc.insert()
                if resultExistProduct.get("status") == "completed":
                    image_ais = render_image_ai(resultExistProduct.get("process_results",{}).get("verbose", []))
                    frappe.db.set_value('VGM_Report', name, 'image_ai', json.dumps(image_ais))
                else:
                    frappe.db.set_value('VGM_Report', name, 'image_ai', json.dumps([]))
            if setting_score_audit is not None:
                doc_report = frappe.get_doc("VGM_Report", name)
                doc_report.scoring_machine = 0 if 0 in score_by_products else 1 if 1 in score_by_products else 0
                doc_report.scoring_human = 0 if 0 in score_by_products else 1 if 1 in score_by_products else 0
                doc_report.save()
            else:
                doc_report = frappe.get_doc("VGM_Report", name)
                doc_report.scoring_machine = 0
                doc_report.scoring_human = 0
                doc_report.save()
        write_upload_log(status=True, input_sku=input_sku, name_report=name, method="mbw_audit.api.api.process_report_sku")
    except Exception as e:
        write_upload_log(status=False, input_sku=input_sku, name_report=name, method="mbw_audit.api.api.process_report_sku")

def write_upload_log(status: bool, input_sku, name_report, method="mbw_audit.api.api.process_report_sku"):
    if not status:
        msg = f"Failed to counting product to sfc " + "<br>"
        msgprint(msg, title="Note", indicator="orange")
        create_sfc_log(
            status="Error",  
            request_data=input_sku, 
            message=msg, 
            method=method,
        )
    else:
        create_sfc_log(
            status="Success",
            request_data=input_sku,
            message=f"report_sku: {name_report}",
            method=method,
        )

def render_image_ai(verbose):
    arr_image_ai = []
    for item in verbose:
        base64_image = item.get("base64_image")
        locates = item.get("locates", [])
        image = base64_to_pillow_image(base64_image)
        for locate in locates:
            if locate.get("label") != "Unknow":
                draw_box_label_pillow(image, locate.get("bbox"), locate.get("label"))
        timestamp = datetime.timestamp(datetime.now())
        # Mã hóa hình ảnh thành chuỗi Base64
        buffer = BytesIO()
        image.save(buffer, format='JPEG')
        encoded_image = buffer.getvalue()
        base64_image_encoded = base64.b64encode(encoded_image).decode("utf-8")
        current_datetime = now_datetime()
        path_folder = create_folder(f"{current_datetime.month}", f"booth_product_ai/{frappe.session.user}/{current_datetime.year}")
        fileInfo = save_file(f"draw_ai_{int(timestamp)}.jpg", base64.b64decode(base64_image_encoded), "File", "booth_product_ai", path_folder)
        arr_image_ai.append(frappe.utils.get_request_site_address() + fileInfo.file_url)
    return arr_image_ai


def render_check_image_ai(verbose):
    arr_image_ai = []
    for item in verbose:
        base64_image = item.get("base64_image")
        locates = item.get("locates", [])
        image = base64_to_pillow_image(base64_image)
        for locate in locates:
            if locate.get("label") != "Unknow":
                draw_box_label_pillow(image, locate.get("bbox"), locate.get("label"))
        timestamp = datetime.timestamp(datetime.now())
        # Mã hóa hình ảnh thành chuỗi Base64
        buffer = BytesIO()
        image.save(buffer, format='JPEG')
        encoded_image = buffer.getvalue()
        base64_image_encoded = base64.b64encode(encoded_image).decode("utf-8")
        current_datetime = now_datetime()
        path_folder = create_folder(f"{current_datetime.month}", f"booth_check_image_ai/{frappe.session.user}/{current_datetime.year}")
        fileInfo = save_file(f"draw_checkimage_ai_{int(timestamp)}.jpg", base64.b64decode(base64_image_encoded), "File", "booth_check_image_ai", path_folder)
        arr_image_ai.append(frappe.utils.get_request_site_address() + fileInfo.file_url)
    return arr_image_ai

def shelf_availability_by_category(category_name, image_paths, lst_product_check):
    vectordb_dir = frappe.get_site_path()
    dms_settings = frappe.get_doc('DMS Settings')
    nguong_nhan_dien_sp = 0.6
    if hasattr(dms_settings, 'nguong_nhan_dien_sp'):
        nguong_nhan_dien_sp = frappe.get_doc('DMS Settings').nguong_nhan_dien_sp
        if nguong_nhan_dien_sp == 0 or nguong_nhan_dien_sp is None:
            nguong_nhan_dien_sp = 0.6
        if isinstance(nguong_nhan_dien_sp, str):
            nguong_nhan_dien_sp = float(nguong_nhan_dien_sp)
    deep_vision: DeepVision = DeepVision(vectordb_dir=vectordb_dir, sku_threshold=nguong_nhan_dien_sp)
    on_shelf_availibility: OnShelfAvailabilityService = deep_vision.init_on_shelf_availability_service(appconst.KEY_API_AI)
    result = on_shelf_availibility.run(category_name, image_paths, lst_product_check)
    return result

def sequence_of_product_by_category(category_name, image_paths, lst_product_sequence):
    vectordb_dir = frappe.get_site_path()
    dms_settings = frappe.get_doc('DMS Settings')
    nguong_nhan_dien_sp = 0.6
    if hasattr(dms_settings, 'nguong_nhan_dien_sp'):
        nguong_nhan_dien_sp = frappe.get_doc('DMS Settings').nguong_nhan_dien_sp
        if nguong_nhan_dien_sp == 0 or nguong_nhan_dien_sp is None:
            nguong_nhan_dien_sp = 0.6
        if isinstance(nguong_nhan_dien_sp, str):
            nguong_nhan_dien_sp = float(nguong_nhan_dien_sp)
    deep_vision: DeepVision = DeepVision(vectordb_dir=vectordb_dir, sku_threshold=nguong_nhan_dien_sp)
    sequence_of_product: SequenceOfProductService = deep_vision.init_audit_sequence_of_product_service(appconst.KEY_API_AI)
    result = sequence_of_product.run(category_name, image_paths, lst_product_sequence)
    return result

@frappe.whitelist(methods=["GET"])
def get_reports_by_filter():
    campaign_code = frappe.form_dict.get('campaign_code')
    start_date = frappe.form_dict.get('start_date')
    end_date = frappe.form_dict.get('end_date')
    employee_id = frappe.form_dict.get('employee_id')
    status_scoring_ai = frappe.form_dict.get('status_scoring_ai')
    status_scoring_human = frappe.form_dict.get('status_scoring_human')
    try:
        filters = []
        if campaign_code is not None:
            filters.append(['campaign_code', '=', campaign_code])
        if start_date is not None and end_date is not None:
            date_format_with_time = '%Y/%m/%d'
            start_date_in = int(start_date)
            end_date_in = int(end_date)
            start_date_in = datetime.fromtimestamp(start_date_in).strftime(date_format_with_time)
            end_date_in = datetime.fromtimestamp(end_date_in).strftime(date_format_with_time)
            filter_date = []
            filter_date.append("images_time")
            filter_date.append("between")
            filter_date.append([start_date_in, end_date_in])
            filters.append(filter_date)
        if employee_id is not None:
            filters.append(['employee_code', '=', employee_id])
        if status_scoring_ai is not None:
            filters.append(['scoring_machine', '=', status_scoring_ai])
        if status_scoring_human is not None:
            filters.append(['scoring_human', '=', status_scoring_human])
        report_sources = frappe.get_all("VGM_Report",
            filters=filters,
            fields=["name", "retail_code", "campaign_code", "employee_code", "categories", "images", "images_time", "scoring_machine", "image_ai","scoring_human"],
            order_by='images_time desc'
        )
        lst_report = []
        for report_source in report_sources:
            customer_name = frappe.get_value("Customer", filters={"name": report_source.get("retail_code")}, fieldname="customer_name")
            employee_name = frappe.get_value("Employee", filters={"name": report_source.get("employee_code")}, fieldname="employee_name")
            campaign_name = frappe.get_value("VGM_Campaign", filters={"name": report_source.get("campaign_code")}, fieldname="campaign_name")
            category_names = []
            categories = report_source.get("categories")
            if categories is not None:
                categories_code = json.loads(categories)
                for code in categories_code:
                    # Lấy tên tương ứng của mã từ doctype VGM_Category
                    name = frappe.get_value("VGM_Category", {"name": code}, "category_name")
                    category_names.append({code: name})
            report_skus = frappe.get_all("VGM_ReportDetailSKU", filters={"parent": report_source.get("name")}, fields=["*"])
            info_products_ai = []
            info_products_human = []
            detail_skus = []
            for report_sku in report_skus:
                product_name = frappe.get_value("VGM_Product", {"name": report_sku.get("product")}, "product_name")
                info_products_ai.append({"report_sku_id": report_sku.get("name"), "product_name": product_name, "sum": report_sku.get("sum_product")})
                info_products_human.append({"report_sku_id": report_sku.get("name"), "product_name": product_name, "sum": report_sku.get("sum_product_human")})
                detail_sku = {
                    "name": report_sku.get("name"),
                    "category": report_sku.get("category"),
                    "product": report_sku.get("product"),
                    "sum_product": report_sku.get("sum_product"),
                    "scoring_machine": report_sku.get("scoring_machine"),
                    "sum_product_human": report_sku.get("sum_product_human"),
                    "scoring_human": report_sku.get("scoring_human"),
                    "product_name": product_name
                }
                detail_skus.append(detail_sku);
            report = {
                "name": report_source.get("name"),
                "customer_name": customer_name,
                "employee_name": employee_name,
                "campaign_name": campaign_name,
                "categories": report_source.get("categories"),
                "info_products_ai": info_products_ai,
                "info_products_human": info_products_human,
                "images": report_source.get("images"),
                "images_ai":  report_source.get("image_ai"),
                "images_time": report_source.get("images_time"),
                "scoring_machine": report_source.get("scoring_machine"),
                "scoring_human": report_source.get("scoring_human"),
                "detail_skus": detail_skus,
                "category_names": category_names
            }
            lst_report.append(report)
        return gen_response(200, "ok", {"data" : lst_report})
    except Exception as e:
        return gen_response(500, "error", {"data" : str(e)})

@frappe.whitelist(methods=["POST"])
def update_report(*args,**kwargs):
    name = kwargs.get('name')
    scoring = kwargs.get('scoring')
    arr_product = kwargs.get('arr_product')
    try:
        doc = frappe.get_doc('VGM_Report', name)
        doc.scoring_human = scoring
        for product in arr_product:
            for report_sku in doc.report_sku:
                if product.get("report_sku_id") == report_sku.get("name"):
                    report_sku.sum_product_human = product.get("sum_product_human")
                    report_sku.scoring_human = product.get("scoring_human")
                    break
        doc.save(ignore_permissions=True)
        return gen_response(200, "ok", {"data": "success"})
    except Exception as e:
        return gen_response(500, "error", {"data": str(e)})

@frappe.whitelist(methods=["POST"])
def update_scorehuman_by_name(*args, **kwargs):
    name = kwargs.get('name')
    scoring = kwargs.get('scoring_human')
    try:
        doc = frappe.get_doc('VGM_Report', name)
        doc.scoring_human = scoring
        doc.save(ignore_permissions=True)
        return gen_response(200, "ok", {"data": "success"})
    except Exception as e:
        return gen_response(500, "error", {"data": str(e)})

@frappe.whitelist(methods=["POST"])
def updatelistreport_scorehuman_by_AI(*args, **kwargs):
    response_list = []
    data_list = json.loads(kwargs.get('data_list'))
    for item in data_list:
        name = item.get('name')
        scoring = item.get('scoring_machine')
        try:
            doc = frappe.get_doc('VGM_Report', name)
            doc.scoring_human = scoring
            doc.save(ignore_permissions=True)
            response_list.append({"name": name, "status": "success"})
        except Exception as e:
            response_list.append({"name": name, "status": "error", "message": str(e)})
            continue  # Tiếp tục vòng lặp ngay cả khi gặp lỗi
    return {"result": response_list, "status": "success"}

@frappe.whitelist(methods=["POST"])
def update_list_report_by_val(*args, **kwargs):
    response_list = []
    data_list = json.loads(kwargs.get('data_list'))
    val_score = kwargs.get('val_score')
    for item in data_list:
        name = item.get('name')
        try:
            doc = frappe.get_doc('VGM_Report', name)
            doc.scoring_human = val_score
            doc.save(ignore_permissions=True)
            response_list.append({"name": name, "status": "success"})
        except Exception as e:
            response_list.append({"name": name, "status": "error", "message": str(e)})
            continue  # Tiếp tục vòng lặp ngay cả khi gặp lỗi
    return {"result": response_list, "status": "success"}
@frappe.whitelist(methods=["GET"])
def get_all_campaigns():
    try:
        campaign_sources = frappe.get_all("VGM_Campaign", fields=["name","campaign_name"])
        return gen_response(200, "ok", {"data": campaign_sources})
    except Exception as e:
        return gen_response(500, "error", {"data": str(e)})

@frappe.whitelist(methods=["GET"])
def summary_overview_dashboard():
    start_date = frappe.form_dict.get('start_date')
    end_date = frappe.form_dict.get('end_date')
    try:
        filters = []
        if start_date is not None and end_date is not None:
            date_format_with_time = '%Y/%m/%d'
            start_date_in = int(start_date)
            end_date_in = int(end_date)
            start_date_in = datetime.fromtimestamp(start_date_in).strftime(date_format_with_time)
            end_date_in = datetime.fromtimestamp(end_date_in).strftime(date_format_with_time)
            filter_date = []
            filter_date.append("images_time")
            filter_date.append("between")
            filter_date.append([start_date_in, end_date_in])
            filters.append(filter_date)
        report_sources = frappe.get_all("VGM_Report",
            filters=filters,
            fields=["name", "retail_code", "campaign_code", "employee_code", "categories", "images", "images_time", "scoring_machine", "image_ai","scoring_human"]
        )
        campaign_sources = frappe.get_all("VGM_Campaign", fields=["name","campaign_name"])
        campaign_start = 0
        for campaign in campaign_sources:
            for report in report_sources:
                if(campaign.name == report.campaign_code):
                    campaign_start += 1
                    break
        employees = []
        customers = []
        report_pass_ai = 0
        report_pass_human = 0
        for report in report_sources:
            if report.get("scoring_machine") == 1:
                report_pass_ai += 1
            if report.get("scoring_human") == 1:
                report_pass_human += 1
            if report.get("employee_code") not in employees:
                employees.append(report.get("employee_code"))
            if report.get("retail_code") not in customers:
                customers.append(report.get("retail_code"))
        return gen_response(200, "ok", {"data": {"campaign_start": campaign_start, "employee": len(employees), "customer": len(customers), "report_pass_ai": report_pass_ai, "report_pass_human": report_pass_human, "num_reports": len(report_sources)}})
    except Exception as e:
        return gen_response(500, "error", {"data": str(e)})

@frappe.whitelist(methods=["GET"])
def summary_campaign():
    start_date = frappe.form_dict.get('start_date')
    end_date = frappe.form_dict.get('end_date')
    try:
        filters_summary = []
        if start_date is not None and end_date is not None:
            date_format_with_time = '%d-%m-%Y'
            start_date_in = int(start_date)
            end_date_in = int(end_date)
            start_date_in = datetime.fromtimestamp(start_date_in).strftime(date_format_with_time)
            end_date_in = datetime.fromtimestamp(end_date_in).strftime(date_format_with_time)
            filter_date = []
            filter_date.append("date_report")
            filter_date.append("between")
            filter_date.append([start_date_in, end_date_in])
            filters_summary.append(filter_date)
        summary_campaign_sources = frappe.get_all("VGM_SummaryByCampaign", filters=filters_summary, fields=["name", "campaign_code", "total_customer_process", "total_report_ai_pass", "total_report_human_pass", "total_report", "total_picture"])
        campaign_sources = frappe.get_all("VGM_Campaign", fields=["name","campaign_name","retails"])
        summary_campaigns = []
        for campaign_source in campaign_sources:
            summary_campaign = {
                'id': campaign_source.get("name"),
                'campaign_name': campaign_source.get("campaign_name")
            }
            reports_by_campaign = [report for report in summary_campaign_sources if report.get("campaign_code") == campaign_source.get("name")]
            ratio_ai_evaluate = 0
            ratio_human_evaluate = 0
            processing = 0
            total_picture = 0
            if len(reports_by_campaign) > 0:
                total_customer_process = 0
                total_report_ai_pass = 0
                total_report_human_pass = 0
                total_report = 0
                for report in reports_by_campaign:
                    total_customer_process += report.get("total_customer_process")
                    total_report_ai_pass += report.get("total_report_ai_pass")
                    total_report_human_pass += report.get("total_report_human_pass")
                    total_report += report.get("total_report")
                    total_picture += report.get("total_picture")
                if total_report == 0:
                    ratio_ai_evaluate = 0
                    ratio_human_evaluate = 0
                else:
                    ratio_ai_evaluate = (total_report_ai_pass/total_report)*100
                    ratio_human_evaluate = (total_report_human_pass/total_report)*100
                
                if campaign_source.get("retails") is not None:
                    retails = json.loads(campaign_source.get("retails"))
                    if len(retails) > 0:
                        processing = (total_customer_process/len(retails))*100
            summary_campaign["ratio_ai_evaluate"] = ratio_ai_evaluate
            summary_campaign["ratio_human_evaluate"] = ratio_human_evaluate
            summary_campaign["processing"] = processing
            summary_campaign["num_picture"] = total_picture
            summary_campaigns.append(summary_campaign)
        return gen_response(200, "ok", {"data": summary_campaigns})
    except Exception as e:
        return gen_response(500, "error", {"data": str(e)})
    
@frappe.whitelist(methods=["GET"])
def summary_user_by_picture():
    start_date = frappe.form_dict.get('start_date')
    end_date = frappe.form_dict.get('end_date')
    try:
        filters = []
        if start_date is not None and end_date is not None:
            date_format_with_time = '%d-%m-%Y'
            start_date_in = int(start_date)
            end_date_in = int(end_date)
            start_date_in = datetime.fromtimestamp(start_date_in).strftime(date_format_with_time)
            end_date_in = datetime.fromtimestamp(end_date_in).strftime(date_format_with_time)
            filter_date = []
            filter_date.append("date_report")
            filter_date.append("between")
            filter_date.append([start_date_in, end_date_in])
            filters.append(filter_date)
        summary_user_sources = frappe.get_all("VGM_SummaryPictureByUser", filters=filters, fields=["name", "employee_code", "total_picture"])
        employee_sources = frappe.get_all("Employee", fields=["name","employee_name","image"])
        summary_users = []
        for employee_source in employee_sources:
            reports_by_employee = [report for report in summary_user_sources if report.get("employee_code") == employee_source.get("name")]
            if len(reports_by_employee) > 0:
                num_picture = 0
                for report_by_employee in reports_by_employee:
                    num_picture += report_by_employee.get("total_picture")
                summary_user = {
                    'id': employee_source.get("name"),
                    'employee_name': employee_source.get("employee_name"),
                    "employee_picture": employee_source.get("image"),
                    "num_picture": num_picture
                }
                summary_users.append(summary_user)
        return gen_response(200, "ok", {"data": summary_users})
    except Exception as e:
        return gen_response(500, "error", {"data": str(e)})

@frappe.whitelist(methods=["POST"])
def search_vgm_reports(*args,**kwargs):
    date_format_with_time = '%Y/%m/%d %H:%M:%S'
    campaign_code = kwargs.get('campaign_code')
    date_check_in = kwargs.get('date_check_in')
    date_check_out = kwargs.get('date_check_out')
    e_name = kwargs.get('e_name')
    try:
        # Xây dựng các điều kiện cho câu truy vấn
        filters = {}
        if campaign_code:
            filters["campaign_code"] = ["like", "%{}%".format(campaign_code)]
        if date_check_in:
            date_check_in = int(kwargs.get('date_check_in'))
            date_check_in = datetime.fromtimestamp(date_check_in).strftime(date_format_with_time)
            filters["date_check_in"] = [">=", date_check_in]
        if date_check_out:
            date_check_out = int(kwargs.get('date_check_out'))
            date_check_out = datetime.fromtimestamp(date_check_out).strftime(date_format_with_time)
            filters["date_check_out"] = ["<=", date_check_out]
        if e_name:
            filters["employee_code"] = e_name

        # Tìm kiếm các bản ghi VGM_Report thỏa mãn các điều kiện
        
        reports = frappe.get_all("VGM_Report",
            filters=filters,
            fields=["name", "retail_code", "employee_code", "date_check_in", "date_check_out"]
        )

        return {"status": "success", "reports": reports}
    except Exception as e:
        return {"status": "fail", "message": _("Failed to retrieve VGM Reports: {0}").format(str(e))}
    
@frappe.whitelist(methods=["GET"])
def get_list_reports():
    try:
        # Lấy danh sách các bản ghi VGM_Report
        reports = frappe.get_all("VGM_Report", fields=["*"])
      
        # Kết hợp thông tin mã chiến dịch với tên mã chiến dịch
        for report in reports:
            category_names = []
            categories = report.get("categories")
            
            if categories is not None:
                categories_code = json.loads(categories)
                for code in categories_code:
                    # Lấy tên tương ứng của mã từ doctype VGM_Category
                    name = frappe.get_value("VGM_Category", {"name": code}, "category_name")
                    category_names.append({code: name})
                    
            report["category_names"] = category_names 
            
            campaign_code = report.get("campaign_code")
            campaign_name = frappe.get_value("VGM_Campaign", filters={"name": campaign_code}, fieldname="campaign_name")
            report["campaign_name"] = campaign_name
            children_data = frappe.get_all("VGM_ReportDetailSKU", filters={"parent": report.name}, fields=["*"])
            for child in children_data:
                product_code = child.get("product")
                product_name = frappe.get_value("VGM_Product", {"name": product_code}, "product_name")
                child["product_name"] = product_name
                          
            # Thêm dữ liệu từ child table vào bản ghi
            report["detail"] = children_data

        # Trả về kết quả thành công cùng với danh sách bản ghi và tên mã chiến dịch
        return {"status": "success", "data": reports}
    except Exception as e:
        # Trả về thông báo lỗi nếu có lỗi xảy ra
        return {"status": "fail", "message": _("Failed to retrieve VGM Reports with campaign names: {0}").format(str(e))}

@frappe.whitelist(methods=["POST"])
def import_product(*args, **kwargs):
    try:
        list_products = json.loads(kwargs.get('listproduct'))

        for product_data in list_products:
            new_product = frappe.new_doc('VGM_Product')
            new_product.product_name = product_data.get('product_name', '')
            new_product.product_code = product_data.get('product_code', '')
            new_product.barcode = product_data.get('barcode', '')
            new_product.product_description = product_data.get('product_description', '')
            new_product.category = kwargs.get('category')
            url_images = product_data.get('url_images', [])
            new_product.images = json.dumps(url_images)

            new_product.insert()

        return {'status': 'success', 'message': 'Products imported successfully'}
    except Exception as e:
        return {'status': 'failed', 'message': str(e)}

@frappe.whitelist(methods="POST")
def upload_file_for_product():
    try:
        if "file" not in frappe.request.files:
            raise ValueError("No file found in form data")

        # Lấy dữ liệu từ form data
        file_info = frappe.request.files["file"]
        category_name = frappe.form_dict.get("category_name")
        
        # Kiểm tra loại dữ liệu của file_info
        if isinstance(file_info, str):
            raise ValueError("Invalid file data")

        filename = file_info.filename
        filedata = file_info.stream.read()
        path_folder = create_folder(category_name, f"product_trainning/{frappe.session.user}")
        # Lưu file tạm vào hệ thống Frappe và nhận lại đường dẫn file đã lưu
        fileInfo = save_file(filename, filedata, "File", f"{frappe.session.user}", path_folder)
        return gen_response(200, "ok", {"file_url" : frappe.utils.get_request_site_address() + fileInfo.file_url,
                                        "date_time" : str(datetime.now().timestamp())})
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Failed to upload file"))
        return gen_response(500, "error", {"file_url" : _("Failed to upload file: {0}").format(str(e))})

@frappe.whitelist(methods="POST")
def upload_file_for_checking():
    try:
        if "file" not in frappe.request.files:
            raise ValueError("No file found in form data")

        # Lấy dữ liệu từ form data
        file_info = frappe.request.files["file"]
        
        # Kiểm tra loại dữ liệu của file_info
        if isinstance(file_info, str):
            raise ValueError("Invalid file data")

        filename = file_info.filename
        filedata = file_info.stream.read()
        path_folder = create_folder("product_checking")
        # Lưu file tạm vào hệ thống Frappe và nhận lại đường dẫn file đã lưu
        fileInfo = save_file(filename, filedata, "File", "product_checking", path_folder)
        return gen_response(200, "ok", {"file_url" : frappe.utils.get_request_site_address() + fileInfo.file_url,
                                        "date_time" : str(datetime.now().timestamp())})
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Failed to upload file"))
        return gen_response(500, "error", {"file_url" : _("Failed to upload file: {0}").format(str(e))})

@frappe.whitelist(methods="POST")
def upload_file():
    try:
        if "file" not in frappe.request.files:
            raise ValueError("No file found in form data")

        # Lấy dữ liệu từ form data
        file_info = frappe.request.files["file"]
        
        # Kiểm tra loại dữ liệu của file_info
        if isinstance(file_info, str):
            raise ValueError("Invalid file data")

        filename = file_info.filename
        filedata = file_info.stream.read()

        current_datetime = now_datetime()
        path_folder = create_folder(f"{current_datetime.month}", f"booth_product/{frappe.session.user}/{current_datetime.year}")
        # Lưu file tạm vào hệ thống Frappe và nhận lại đường dẫn file đã lưu
        fileInfo = save_file(filename, filedata, "File", "booth_product", path_folder)
        return gen_response(200, "ok", {"file_url" : frappe.utils.get_request_site_address() + fileInfo.file_url,
                                        "date_time" : str(datetime.now().timestamp())})
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Failed to upload file"))
        return gen_response(500, "error", {"file_url" : _("Failed to upload file: {0}").format(str(e))})

@frappe.whitelist(methods="POST")
def import_campaign(*args, **kwargs):
    try:
        list_campaigns = json.loads(kwargs.get('listcampaign'))
        date_format_with_time = '%Y/%m/%d %H:%M:%S'

        for data in list_campaigns:
            new_campaign = frappe.new_doc('VGM_Campaign')
            new_campaign.campaign_name = data.get('campaign_name', '')
            new_campaign.campaign_description = data.get('campaign_description', '')

            start_date_str = data.get('campaign_start')
            end_date_str = data.get('campaign_end')

            start_date = datetime.fromtimestamp(int(start_date_str)).strftime(date_format_with_time) if start_date_str else None
            end_date = datetime.fromtimestamp(int(end_date_str)).strftime(date_format_with_time) if end_date_str else None

            new_campaign.start_date = start_date
            new_campaign.end_date = end_date

            categories = json.loads(data.get('campaign_categories'))
            config_score_audit = {"min_product": {}}
            category_names = []

            for category in categories:
                category_name = frappe.get_value("VGM_Category", {"category_name": category}, "name")
                if category_name:
                    category_names.append(category_name)
                    products = frappe.get_all("VGM_Product", filters={"category": category_name}, fields=["name"])
                    for product in products:
                        config_score_audit["min_product"][product["name"]] = 1

            employees = json.loads(data.get('campaign_employees'))
            retails = json.loads(data.get('campaign_customers'))

            new_campaign.campaign_status = data.get("campaign_status")
            new_campaign.categories = json.dumps(category_names)
            new_campaign.employees = json.dumps(employees)
            new_campaign.retails = json.dumps(retails)
            
            # Gán min_products vào trường setting_score_audit        
            new_campaign.setting_score_audit = json.dumps(config_score_audit)

            new_campaign.insert()

        return {'status': 'success', 'message': 'Campaigns imported successfully'}
    except Exception as e:
        return {'status': 'failed', 'message': str(e)}


@frappe.whitelist(methods="POST")
def get_bbox_by_image(*args, **kwargs):
    try:
        arrImage = kwargs.get('lst_image')
        vectordb_dir = frappe.get_site_path()
        deep_vision: DeepVision = DeepVision(vectordb_dir=vectordb_dir, options={})
        detection: ProductDetectionService = deep_vision.init_product_detection_service(appconst.KEY_API_AI)
        arrBbox = []
        for image in arrImage:
            bbox = detection.detect(image)
            arrBbox.append(bbox)
        return gen_response(200, 'ok', arrBbox)
    except Exception as e:
        return gen_response(500, 'error', [])

@frappe.whitelist(methods="GET")
def get_products_by_category(category):
    try:
        products = frappe.db.get_list('VGM_Product', filters = {'category': category}, fields=['name', 'product_name'])
        return gen_response(200, 'ok', products)
    except Exception as e:
        return gen_response(500, 'error', [])

@frappe.whitelist(methods="POST")
def render_image_by_base64(*args, **kwargs):
    try:
        id_product = kwargs.get('name_product')
        arr_base64 = kwargs.get('lst_base64')
        id_category = kwargs.get('name_category')
        arr_url_image = [];
        for base64_str in arr_base64:
            binary_data = base64.b64decode(base64_str)
            stream = BytesIO(binary_data)
            timestamp = datetime.timestamp(datetime.now())
            filename = f'product_{int(timestamp)}.png'
            filedata = stream.read()
            path_folder = create_folder(id_category, f"product_trainning/{frappe.session.user}")
            # Lưu file tạm vào hệ thống Frappe và nhận lại đường dẫn file đã lưu
            fileInfo = save_file(filename, filedata, "File", f"{frappe.session.user}", path_folder)
            arr_url_image.append(frappe.utils.get_request_site_address() + fileInfo.file_url)
        return gen_response(200, 'ok', arr_url_image)
    except Exception as e:
        return gen_response(500, 'error', [])

@frappe.whitelist(methods="POST")
def assign_image_to_product(*args, **kwargs):
    try:
        id_product = kwargs.get('name_product')
        lst_image = kwargs.get('lst_image')
        id_category = kwargs.get('name_category')
        doc_product = frappe.get_doc('VGM_Product', id_product)
        vectordb_dir = frappe.get_site_path()
        dms_settings = frappe.get_doc('DMS Settings')
        nguong_nhan_dien_sp = 0.6
        if hasattr(dms_settings, 'nguong_nhan_dien_sp'):
            nguong_nhan_dien_sp = frappe.get_doc('DMS Settings').nguong_nhan_dien_sp
            if nguong_nhan_dien_sp == 0 or nguong_nhan_dien_sp is None:
                nguong_nhan_dien_sp = 0.6
            if isinstance(nguong_nhan_dien_sp, str):
                nguong_nhan_dien_sp = float(nguong_nhan_dien_sp)
        deep_vision: DeepVision = DeepVision(vectordb_dir=vectordb_dir, sku_threshold=nguong_nhan_dien_sp)
        product_recognition: ProductRecognitionService = deep_vision.init_product_recognition_service(appconst.KEY_API_AI)
        custom_field = doc_product.custom_field
        arr_image_new = []
        arr_image_update = []
        if doc_product.images is not None:
            arr_image_old = json.loads(doc_product.images)
            for image in arr_image_old:
                if isinstance(image, str):
                    arr_image_new.append(image)
                    arr_image_update.append({'url_image': image})
                else:
                    arr_image_new.append(image.get('url_image'))
                    arr_image_update.append(image)
            for image in lst_image:
                arr_image_new.append(image)
                image_new = {'url_image': image}
                arr_image_update.append(image_new)
        else:
            arr_image_new = lst_image
            for image in lst_image:
                image_new = {'url_image': image}
                arr_image_update.append(image_new)
        obj_custom_field = {}
        if custom_field is not None and json.loads(custom_field).get('product_id') is not None:
            obj_custom_field = json.loads(custom_field)
            products: Products = product_recognition.get_products()
            image_ids = []
            for image_new in arr_image_update:
                if image_new.get('image_id') is not None:
                    image_ids.append(image_new.get('image_id'))
                else:
                    image_id = str(uuid.uuid4())
                    image_new['image_id'] = image_id
                    image_ids.append(image_id)
            response = products.add(id_category, obj_custom_field.get('product_id'), doc_product.product_name, image_ids, arr_image_new)
            if response.get('status') == 'completed':
                pass
            else:
                raise Exception(str(response))
        else:
            product_id = str(uuid.uuid4())
            image_ids = []
            for value in arr_image_update:
                image_id = str(uuid.uuid4())
                value['image_id'] = image_id
                image_ids.append(image_id)
            products: Products = product_recognition.get_products()
            response = products.add(id_category, product_id, doc_product.product_name, image_ids, arr_image_new)
            if response.get('status') == 'completed':
                product_AI = response.get('result', {}).get('product_id')
                doc_product.custom_field = json.dumps({"product_id": product_AI})
            else:
                raise Exception(str(response))
        doc_product.images = json.dumps(arr_image_update)
        frappe.db.set_value('VGM_Product', id_product, {
            'images': doc_product.images,
            'custom_field': doc_product.custom_field
        })
        return gen_response(200, 'ok', "Thành công")
    except Exception as e:
        return gen_response(500, "error", str(e))

@frappe.whitelist(methods="POST")
def upload_multi_file_for_checking():
    try:
        # Check if multiple files are uploaded
        if "file" not in frappe.request.files:
            raise ValueError("No file found in form data")

        # Get all uploaded files
        files = frappe.request.files.getlist("file")

        # Initialize an empty list to store file URLs
        file_urls = []

        # Iterate over each uploaded file
        for file_info in files:
            # Check if file_info is a valid file object
            filename = file_info.filename
            filedata = file_info.stream.read()
            path_folder = create_folder("product_checking")

            # Save each file and get the file information
            file_info = save_file(filename, filedata, "File", "product_checking", path_folder)

            # Add file information to a list
            file_urls.append(frappe.utils.get_request_site_address() + file_info.file_url)

        # Return response with a list of file URLs and timestamp
        return gen_response(200, "ok", {"file_urls": file_urls, "date_time": str(datetime.now().timestamp())})
    except Exception as e:
        return gen_response(500, "error", {"file_url": _("Failed to upload file: {0}").format(str(e))})

@frappe.whitelist(methods="POST")
def update_images_for_report():
    try:
        if "file" not in frappe.request.files:
            raise ValueError("No file found in form data")
        files = frappe.request.files.getlist("file")
        report_id = frappe.request.form.get("report_id")
        file_urls = []
        for file_info in files:
            filename = file_info.filename
            filedata = file_info.stream.read()
            path_folder = create_folder("booth_product")
            file_info = save_file(filename, filedata, "File", "booth_product", path_folder)
            file_urls.append(frappe.utils.get_request_site_address() + file_info.file_url)
        report = frappe.get_doc('VGM_Report', report_id)
        if len(file_urls) > 0:
            url_image_old = report.images
            if url_image_old is not None and url_image_old != "":
                url_image_old = json.loads(url_image_old)
            else:
                url_image_old = []
            file_urls.extend(url_image_old)
            categories = report.categories
            if categories is not None and categories != "":
                categories = json.loads(categories)
            else:
                categories = []
            campaign_doc = frappe.get_doc('VGM_Campaign', report.campaign_code)
            setting_score_audit = campaign_doc.setting_score_audit
            if setting_score_audit is not None and setting_score_audit != "":
                setting_score_audit = json.loads(setting_score_audit)
            else:
                setting_score_audit = {}
            score_by_products = []
            category_names = []
            for category in categories:
                #arr_product = []
                doc_category = frappe.get_doc('VGM_Category', category)
                category_names.append({category: doc_category.get('category_name')})
                products = frappe.db.get_list('VGM_Product', filters = {'category': category}, fields=['name', 'product_name'])
                # for product_item in products:
                #     arr_product.append(rproduct_item.get('name'))
                lst_product_check = {}
                lst_product_sequence = []
                resultExistProduct = {}
                resultSequenceProduct = {}
                arr_product_audit = []
                #Sinh điều kiện sản phẩm tồn tại trong AI, nếu không có cấu hình thì mặc định là 0 để thực hiện lấy số lượng
                if setting_score_audit.get("min_product") is not None:
                    # for product_id in arr_product:
                    #     objMinProduct = setting_score_audit.get("min_product", {})
                    #     if objMinProduct is not None:
                    #         doc_product = frappe.get_doc('VGM_Product', product_id)
                    #         lst_product_check[doc_product.product_name] = objMinProduct.get(product_id)
                    for product_item in products:
                        objMinProduct = setting_score_audit.get("min_product", {})
                        if objMinProduct is not None:
                            lst_product_check[product_item.get('product_name')] = objMinProduct.get(product_item.get('name'))
                            arr_product_audit.append(product_item)
                        else:
                            lst_product_check[product_item.get('product_name')] = 0
                            arr_product_audit.append(product_item)
                    resultExistProduct = shelf_availability_by_category(category, file_urls, lst_product_check)
                else:
                    # for product_id in arr_product:
                    #     doc_product = frappe.get_doc('VGM_Product', product_id)
                    #     lst_product_check[doc_product.product_name] = 0
                    for product_item in products:
                        lst_product_check[product_item.get('product_name')] = 0
                        arr_product_audit.append(product_item)
                    resultExistProduct = shelf_availability_by_category(category, file_urls, lst_product_check)
                #Sinh điều kiện sắp xếp sản phẩm và gọi sang AI để kiểm tra vị trí sắp xếp
                if setting_score_audit.get("sequence_product") is not None and len(setting_score_audit.get("sequence_product", [])) > 1:
                    obj_setting_sequences = setting_score_audit.get("sequence_product", [])
                    arr_product_sequences = []
                    # for product_id in arr_product:
                    #     doc_product = frappe.get_doc('VGM_Product', product_id)
                    #     arr_product_sequences.append(doc_product.product_name)
                    for product_item in products:
                        arr_product_sequences.append(product_item.get('product_name'))
                    resultSequenceProduct = sequence_of_product_by_category(category, file_urls, arr_product_sequences)
                    if resultSequenceProduct.get("status") == "completed":
                        process_result_sequence = resultSequenceProduct.get("process_results", {})
                        sequence_of_product = process_result_sequence.get("sequence_of_product")
                        score_by_products.append(1 if sequence_of_product == 1 else 0)
                if resultExistProduct.get('status') == "completed":
                    product_availability = []
                    count_product = {}
                    if resultExistProduct.get('process_results') is not None:
                        on_shelf_availability = resultExistProduct.get('process_results').get('on_shelf_availability')
                        if on_shelf_availability is not None:
                            availability_result = on_shelf_availability.get('availability_result')
                            if availability_result.get('product_availability') is not None:
                                product_availability = availability_result.get('product_availability')
                        if resultExistProduct.get('process_results').get('count') is not None:
                            count_product = resultExistProduct.get('process_results').get('count')
                    for product_item in arr_product_audit:
                        filter_sku = [product_sku for product_sku in report.report_sku if product_sku.get('product') == product_item.get('name')]
                        if len(filter_sku) > 0:
                            doc_children = frappe.get_doc('VGM_ReportDetailSKU', filter_sku[0].get('name'))
                            if count_product.get(product_item.get('product_name')) is not None:
                                doc_children.sum_product = count_product.get(product_item.get('product_name'))
                                doc_children.sum_product_human = count_product.get(product_item.get('product_name'))
                                if product_item.get('product_name') in product_availability:
                                    doc_children.scoring_machine = 1
                                    doc_children.scoring_human = 1
                                    score_by_products.append(1)
                                else:
                                    doc_children.scoring_machine = 0
                                    doc_children.scoring_human = 0
                                    score_by_products.append(0)
                                doc_children.save()
                        else:
                            scoring_machine = 0
                            scoring_human = 0
                            if product_item.get('product_name') in product_availability:
                                scoring_machine = 1
                                scoring_human = 1
                                score_by_products.append(1)
                            else:
                                score_by_products.append(0)
                            doc_report_detail_sku = frappe.get_doc({
                                'doctype': 'VGM_ReportDetailSKU',
                                'parent': report_id,
                                'parentfield': 'report_sku',
                                'parenttype': 'VGM_Report',
                                'category': category,
                                'sum_product': count_product.get(product_item.get('product_name')),
                                'product': product_item.get("name"),
                                'scoring_machine': scoring_machine,
                                'sum_product_human': count_product.get(product_item.get('product_name')),
                                'scoring_human': scoring_human
                            })
                            doc_report_detail_sku.insert()
                    image_ais = render_image_ai(resultExistProduct.get("process_results",{}).get("verbose", []))
                    report.images = json.dumps(file_urls)
                    report.image_ai = json.dumps(image_ais)
                    if 0 in score_by_products:
                        report.scoring_machine = 0
                        report.scoring_human = 0
                    else:
                        report.scoring_machine = 1
                        report.scoring_human = 1
                    report.log_ai = json.dumps(resultExistProduct)
                    frappe.db.set_value('VGM_Report', report_id, {
                        'images': json.dumps(file_urls),
                        'image_ai': json.dumps(image_ais),
                        'scoring_machine': report.scoring_machine,
                        'scoring_human': report.scoring_human,
                        'log_ai': report.log_ai
                    })
                else:
                    report.scoring_machine = 0
                    report.scoring_human = 0
                    report.log_ai = json.dumps(resultExistProduct)
                    frappe.db.set_value('VGM_Report', report_id, {
                        'images': json.dumps(file_urls),
                        'image_ai': json.dumps([]),
                        'scoring_machine': 0,
                        'scoring_human': 1,
                        'log_ai': report.log_ai
                    })
        else:
            raise Exception("Đường dẫn ảnh không có")
        if len(file_urls) == 0:
            return gen_response(200, "ok", {})
        report_skus = frappe.get_all("VGM_ReportDetailSKU", filters={"parent": report.get("name")}, fields=["*"])
        info_products_ai = []
        info_products_human = []
        detail_skus = []
        customer_name = frappe.get_value("Customer", filters={"name": report.get("retail_code")}, fieldname="customer_name")
        for report_sku in report_skus:
            product_name = frappe.get_value("VGM_Product", {"name": report_sku.get("product")}, "product_name")
            info_products_ai.append({"report_sku_id": report_sku.get("name"), "product_name": product_name, "sum": report_sku.get("sum_product")})
            info_products_human.append({"report_sku_id": report_sku.get("name"), "product_name": product_name, "sum": report_sku.get("sum_product_human")})
            detail_sku = {
                "name": report_sku.get("name"),
                "category": report_sku.get("category"),
                "product": report_sku.get("product"),
                "sum_product": report_sku.get("sum_product"),
                "scoring_machine": report_sku.get("scoring_machine"),
                "sum_product_human": report_sku.get("sum_product_human"),
                "scoring_human": report_sku.get("scoring_human"),
                "product_name": product_name
            }
            detail_skus.append(detail_sku);
        report_response = {
            "name": report.get("name"),
            "customer_name": customer_name,
            "campaign_name": report.get('campaign_code'),
            "categories": report.get("categories"),
            "info_products_ai": info_products_ai,
            "info_products_human": info_products_human,
            "images": report.get("images"),
            "images_ai":  report.get("image_ai"),
            "images_time": report.get("images_time"),
            "scoring_machine": report.get("scoring_machine"),
            "scoring_human": report.get("scoring_human"),
            "detail_skus": detail_skus,
            "category_names": category_names
        }
        return gen_response(200, "ok", report_response)
    except Exception as e:
        return gen_response(500, "error", str(e))

