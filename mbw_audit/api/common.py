from bs4 import BeautifulSoup
import frappe
from frappe import _
from datetime import datetime, timedelta
import base64
import uuid
from frappe.core.doctype.file.utils import delete_file
from frappe.utils.file_manager import (
    save_file
)

import cv2
import numpy as np
from mbw_sfc_integrations.sfc_integrations.utils import create_sfc_log
from mbw_audit.utils import appconst

BASE_URL = frappe.utils.get_request_site_address()

def post_images(name_image, images, doc_type, doc_name):
    file_name = name_image + str(uuid.uuid4()) + ".png"
    imgdata = base64.b64decode(images)
    doc_file = save_file(file_name, imgdata, doc_type, doc_name,
                             folder=None, decode=False, is_private=0, df=None)
        # Xóa bản sao hình ảnh
    path_file = "/files/" + file_name
    delete_file(path_file)
    file_url = doc_file.get('file_url')
    return file_url
def post_images_check(images):
    file_name = str(uuid.uuid4()) + ".png"
    imgdata = base64.b64decode(images)
    doc_file = save_file(file_name, imgdata,'File','',folder=None, decode=False, is_private=0, df=None)
    file_url = doc_file.get('file_url')
    return file_url
# return definition
def gen_response(status, message, result=[]):
    frappe.response["http_status_code"] = status
    if status == 500:
        frappe.response["message"] = BeautifulSoup(
            str(message), features="lxml").get_text()
    else:
        frappe.response["message"] = message
    frappe.response["result"] = result

def base64_to_cv2(b64str):
    data = base64.b64decode(b64str.encode('utf8'))
    data = np.frombuffer(data, np.uint8)
    data = cv2.imdecode(data, cv2.IMREAD_COLOR)
    return data

def draw_detections(img, box, label):
    # Đoạn mã của bạn ở đây
    x1, y1, x2, y2 = box
    cv2.rectangle(img, (int(x1), int(y1)), (int(x2), int(y2)), (255,255,255), 2)
    (label_width, label_height), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
    label_x = x1
    label_y = y1 - 10 if y1 - 10 > label_height else y1 + 10

    # Sử dụng một font hỗ trợ Unicode như 'DejaVuSans'
    font = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = 0.5
    font_thickness = 1
    line_type = cv2.LINE_AA

    # Vẽ hình chữ nhật xung quanh văn bản
    cv2.rectangle(img, (label_x, label_y - label_height), (label_x + label_width, label_y + label_height), (255,255,255), cv2.FILLED)

    # Hiển thị văn bản tiếng Việt
    cv2.putText(img, label, (label_x, label_y), font, font_scale, (0, 0, 0), font_thickness, line_type)

def process_request(data, event):

	# create log
	log = create_sfc_log(method=appconst.EVENT_MAPPER[event], request_data=data)

	# enqueue backround job
	frappe.enqueue(
		method=appconst.EVENT_MAPPER[event],
		queue="short",
		timeout=300,
		is_async=True,
		**{"payload": data, "request_id": log.name},
	)

def create_folder(folder_name, parent_folder=None):
    current_path = "Home"
    if parent_folder is not None:
        folder_names = parent_folder.split("/")
        for folder_name_s in folder_names:
            exist_folder = frappe.db.exists({"doctype": "File", "file_name": folder_name_s, "folder": current_path})
            if exist_folder is not None:
                current_path = exist_folder
            else:
                new_folder = frappe.get_doc({
                    "doctype": "File",
                    "is_folder": 1,
                    "folder": current_path,
                    "file_name": folder_name_s
                })
                new_folder.insert()
                current_path = f"{current_path}/{folder_name_s}"
    exist_folder = frappe.db.exists({"doctype": "File", "file_name": folder_name, "folder": current_path})
    if exist_folder is not None:
        current_path = exist_folder
    else:
        new_folder = frappe.get_doc({
            "doctype": "File",
            "is_folder": 1,
            "folder": current_path,
            "file_name": folder_name
        })
        new_folder.insert()
        current_path = f"{current_path}/{folder_name}"
    frappe.db.commit()
    return current_path
