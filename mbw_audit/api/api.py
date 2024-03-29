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
from mbw_audit.api.common import (post_images, gen_response, base64_to_cv2, draw_detections, create_folder)
from frappe.utils.file_manager import (
    save_file
)
from frappe.utils import get_site_path, now_datetime
from datetime import datetime
import base64
import cv2
from mbw_audit.utils import appconst
from mbw_sfc_integrations.sfc_integrations.utils import create_sfc_log
from frappe import _, msgprint

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
    deep_vision: DeepVision = DeepVision(vectordb_dir)
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
def checkImageProductExist(*args,**kwargs):
    vectordb_dir = frappe.get_site_path()
    deep_vision: DeepVision = DeepVision(vectordb_dir)
    recognition: ProductCountService = deep_vision.init_product_count_service(appconst.KEY_API_AI)
    base_url = frappe.utils.get_request_site_address()
    collection_name = kwargs.get('collection_name')
    link_image = kwargs.get('linkimages')
    # url_images = post_images_check(image_base64)
    image_path = [link_image]
    # product_id = self.product
    # get_product_name =  frappe.get_value("Product", {"name": product_id}, "product_name")
    response = recognition.count(collection_name, image_path)
    return response
    if response.get('status') == 'completed':
        count_value = response.get('results', {}).get('count', {})
        return count_value
        # self.set('sum', count_value)
    else:
        return {"status": "error", 'message': response}
        # self.set('sum', self.sum)

@frappe.whitelist(methods=["POST"])
# param {collection_name: ''}
def deleteCategory(*args,**kwargs):
    vectordb_dir = frappe.get_site_path()
    deep_vision: DeepVision = DeepVision(vectordb_dir)
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

@frappe.whitelist(methods=["POST"])
def record_report_data(*args, **kwargs):
    images_time = datetime.now()
    category = json.loads(kwargs.get('category'))
    categories_str = json.dumps(category)  # Chuyển đổi danh sách thành chuỗi JSON
    images = json.loads(kwargs.get('images'))
    images_str = json.dumps(images)
    setting_score_audit = json.loads(kwargs.get('setting_score_audit')) if kwargs.get('setting_score_audit') is not None else None
    try:
        data = {
            'doctype': 'VGM_Report',
            'retail_code': kwargs.get('customer_code'),
            'employee_code': kwargs.get('e_name'),
            'campaign_code': kwargs.get('campaign_code'),
            'categories': categories_str,
            'images_time': images_time,
            'images': images_str,
            'latitude_check_in': '',
            'latitude_check_out': '',
            'longitude_check_in': '',
            'longitude_check_out': ''
        }
        doc = frappe.get_doc(data)
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
                for info_product in info_products:
                    num_product_recog = 0
                    is_exist_product = 0 
                    if resultExistProduct.get("status") == "completed":
                        process_results = resultExistProduct.get("process_results")
                        count_product_recog = process_results.get("count")
                        num_product_recog = count_product_recog.get(info_product.get("product_name"), 0)
                        product_availability = process_results.get("on_shelf_availability", {}).get("availability_result",{}).get("product_availability")
                        is_exist_product = 1 if info_product.get("product_name") in product_availability else 0
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
        image = base64_to_cv2(base64_image)
        for locate in locates:
            if locate.get("label") != "Unknow":
                draw_detections(image, locate.get("bbox"), locate.get("label"))
        timestamp = datetime.timestamp(datetime.now())
        # Mã hóa hình ảnh thành chuỗi Base64
        _, buffer = cv2.imencode('.jpg', image)
        base64_image_encoded = base64.b64encode(buffer).decode("utf-8")
        current_datetime = now_datetime()
        path_folder = create_folder(f"{current_datetime.month}", f"booth_product_ai/{frappe.session.user}/{current_datetime.year}")
        fileInfo = save_file(f"draw_ai_{int(timestamp)}.jpg", base64.b64decode(base64_image_encoded), "File", "booth_product_ai", path_folder)
        print("Dòng 282 ", frappe.utils.get_request_site_address() )
        arr_image_ai.append(frappe.utils.get_request_site_address() + fileInfo.file_url)
    return arr_image_ai

def shelf_availability_by_category(category_name, image_paths, lst_product_check):
    vectordb_dir = frappe.get_site_path()
    deep_vision: DeepVision = DeepVision(vectordb_dir)
    on_shelf_availibility: OnShelfAvailabilityService = deep_vision.init_on_shelf_availability_service(appconst.KEY_API_AI)
    result = on_shelf_availibility.run(category_name, image_paths, lst_product_check)
    return result

def sequence_of_product_by_category(category_name, image_paths, lst_product_sequence):
    vectordb_dir = frappe.get_site_path()
    deep_vision: DeepVision = DeepVision(vectordb_dir)
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
            date_format_with_time = '%Y/%m/%d %H:%M:%S'
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
            date_format_with_time = '%Y/%m/%d %H:%M:%S'
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
            min_products = {}
            category_names = []

            for category in categories:
                category_name = frappe.get_value("VGM_Category", {"category_name": category}, "name")
                if category_name:
                    category_names.append(category_name)
                    products = frappe.get_all("VGM_Product", filters={"category": category_name}, fields=["name"])
                    min_products.update({product.name: {"min_product": 1} for product in products})

            employees = json.loads(data.get('campaign_employees'))
            retails = json.loads(data.get('campaign_customers'))

            new_campaign.campaign_status = data.get("campaign_status")
            new_campaign.categories = json.dumps(category_names)
            new_campaign.employees = json.dumps(employees)
            new_campaign.retails = json.dumps(retails)
            
            # Gán min_products vào trường setting_score_audit        
            new_campaign.setting_score_audit = json.dumps(min_products)

            new_campaign.insert()

        return {'status': 'success', 'message': 'Campaigns imported successfully'}
    except Exception as e:
        return {'status': 'failed', 'message': str(e)}

