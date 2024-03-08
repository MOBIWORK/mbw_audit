import json
from bs4 import BeautifulSoup
import frappe
from frappe import _
from frappe.utils import cstr
import urllib.parse
import http.cookies
from datetime import datetime, timedelta
import base64
import uuid
from frappe.core.doctype.file.utils import delete_file
from frappe.utils.file_manager import (
    save_file
)
from frappe.desk.query_report import (
    normalize_result, get_report_result, get_reference_report)
from frappe.core.utils import ljust_list
from frappe.client import validate_link

import cv2
import numpy as np

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
    x1, y1, x2, y2 = box
    cv2.rectangle(img, (int(x1), int(y1)), (int(x2), int(y2)), (255,255,255), 2)
    (label_width, label_height), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
    label_x = x1
    label_y = y1 - 10 if y1 - 10 > label_height else y1 + 10
    cv2.rectangle(img, (label_x, label_y - label_height), (label_x + label_width, label_y + label_height), (255,255,255),
                cv2.FILLED)
    cv2.putText(img, label, (label_x, label_y), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)

