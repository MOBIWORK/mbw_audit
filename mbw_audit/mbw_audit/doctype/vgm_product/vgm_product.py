# Copyright (c) 2024, mbw and contributors
# For license information, please see license.txt

# import frappe
import json
import frappe
from frappe.model.document import Document
import sys
import os
__dir__ = os.path.dirname(os.path.abspath(__file__))
sys.path.append(__dir__)
sys.path.insert(0, os.path.abspath(os.path.join(__dir__, '../')))
import uuid
from deepvision import DeepVision
from deepvision.service import ProductRecognitionService
from deepvision.collections import Products
from frappe.model.document import Document
from mbw_audit.utils import appconst
from datetime import datetime

class VGM_Product(Document):
    def before_save(self):
        # Check exist Product
        product_exists = frappe.get_list("VGM_Product", filters={"name": self.name}, limit=1)
        if product_exists:
            self.update_product()
        else:
            # Kiểm tra và thêm sản phẩm
            self.check_and_add_product()
    def update_product(self):
        vectordb_dir = frappe.get_site_path()
        deep_vision: DeepVision = DeepVision(vectordb_dir)
        product_recognition: ProductRecognitionService = deep_vision.init_product_recognition_service(appconst.KEY_API_AI)
        collection_name = self.category
        print(self)
        custom_field_check = self.get('custom_field')
        if custom_field_check is None:
            self.check_and_add_product()
        else:
            custom_field = json.loads(self.get('custom_field'))
            product_id_ai = custom_field.get('product_id')
            if product_id_ai is None:
                self.check_and_add_product()
            else:
                products: Products = product_recognition.get_products()
                json_string = self.images
                images_dict = json.loads(json_string)
                base_url = frappe.utils.get_request_site_address()
                image_paths = [base_url + value if 'http' not in value else value for value in images_dict]
                image_ids = []
                for value in images_dict:
                    image_id = str(uuid.uuid4())
                    image_ids.append(image_id)
                response = products.add(collection_name, product_id_ai, self.product_name, image_ids, image_paths)
                products.update_by_id(collection_name, product_id_ai, self.product_name)
                if response.get('status') == 'completed':
                    pass
                else:
                    frappe.msgprint("Không phân tích được ảnh")
                
    def check_and_add_product(self):
        # Sử dụng self để truy cập trường product_name
        vectordb_dir = frappe.get_site_path()
        deep_vision: DeepVision = DeepVision(vectordb_dir)
        product_recognition: ProductRecognitionService = deep_vision.init_product_recognition_service(appconst.KEY_API_AI)
        product_name = self.product_name
        json_string = self.images
        images_dict = json.loads(json_string)
        # Kiểm tra xem images_dict có phần tử không
        if images_dict:
            base_url = frappe.utils.get_request_site_address()
            image_paths = [base_url + value if 'http' not in value else value for value in images_dict]
            print(image_paths)
            collection_name = self.category
            product_id = str(uuid.uuid4())
            # Khởi tạo danh sách để chứa các image_ids
            image_ids = []
            for value in images_dict:
                # Sinh ra một UUID và chuyển thành chuỗi, sau đó thêm vào danh sách image_ids
                image_id = str(uuid.uuid4())
                image_ids.append(image_id)
            # Lấy danh sách sản phẩm
            products: Products = product_recognition.get_products()

            # Thực hiện thêm sản phẩm và xử lý kết quả
            response = products.add(collection_name, product_id, product_name, image_ids, image_paths)
            if response.get('status') == 'completed':
                product_AI = response.get('result', {}).get('product_id')
                custom_field_value = json.dumps({"product_id": product_AI})
                self.set('custom_field', custom_field_value)
            else:
                frappe.msgprint("Không phân tích được ảnh")
        else:
            return {'status': 'fail','message' : self.name}
    