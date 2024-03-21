# Copyright (c) 2024, mbw and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document
import frappe
import json
from datetime import datetime

class VGM_Report(Document):
	def on_update(self):
		self.summary_by_campaign(self.campaign_code)
		self.summary_picture_by_user(self.employee_code)
	
	def summary_by_campaign(self, campaign_code):
		reports_campaign = frappe.get_all("VGM_Report",
            filters={"campaign_code": campaign_code},
            fields=["name", "retail_code", "campaign_code", "employee_code", "images", "scoring_machine","scoring_human","images_time"]
        )
		reports_campaign = [report for report in reports_campaign if report.images_time.date() == datetime.now().date()]
		
		arr_customer_process = []
		total_picture = 0
		for report in reports_campaign:
			if report.get("retail_code") not in arr_customer_process:
				arr_customer_process.append(report.get("retail_code"))
			if report.get("images") is not None:
				arrImage = json.loads(report.get("images"))
				total_picture += len(arrImage)
		arr_report_ai_pass = [report for report in reports_campaign if report.get("scoring_machine") == 1]
		arr_report_human_pass = [report for report in reports_campaign if report.get("scoring_human") == 1]
		exist_doc = frappe.db.exists({"doctype": "VGM_SummaryByCampaign", "date_report": datetime.now().date()})
		if exist_doc is not None:
			frappe.db.set_value('VGM_SummaryByCampaign', exist_doc, {
				'total_customer_process': len(arr_customer_process),
				'total_report_ai_pass': len(arr_report_ai_pass),
				'total_report_human_pass': len(arr_report_human_pass),
				'total_report': len(reports_campaign),
				'total_picture': total_picture
			})
		else:
			doc_summary = frappe.get_doc({'doctype': "VGM_SummaryByCampaign", 'campaign_code': campaign_code})
			doc_summary.total_customer_process = len(arr_customer_process)
			doc_summary.total_report_ai_pass = len(arr_report_ai_pass)
			doc_summary.total_report_human_pass = len(arr_report_human_pass)
			doc_summary.total_report = len(reports_campaign)
			doc_summary.total_picture = total_picture
			doc_summary.date_report = datetime.now().date()
			doc_summary.insert()

	def summary_picture_by_user(self, employee_code):
		reports_campaign = frappe.get_all("VGM_Report",
            filters={"employee_code": employee_code},
            fields=["name", "retail_code", "campaign_code", "employee_code", "images", "images_time"]
        )
		reports_campaign = [report for report in reports_campaign if report.images_time.date() == datetime.now().date()]
		total_picture = 0
		for report in reports_campaign:
			if report.get("images") is not None:
				arrImage = json.loads(report.get("images"))
				total_picture += len(arrImage)
		exist_doc = frappe.db.exists({"doctype": "VGM_SummaryPictureByUser", "date_report": datetime.now().date()})
		if exist_doc is not None:
			frappe.db.set_value('VGM_SummaryPictureByUser', exist_doc, {
				'total_picture': total_picture
			})
		else:
			doc_summary = frappe.get_doc({'doctype': "VGM_SummaryPictureByUser", 'employee_code': employee_code})
			doc_summary.total_picture = total_picture
			doc_summary.date_report = datetime.now().date()
			doc_summary.insert()