# Copyright (c) 2024, mbw and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document
import frappe
from datetime import datetime


class VGM_Campaign(Document):
	def on_update(self):
		self.init_summary_campaign()
	
	def init_summary_campaign(self):
		exist_doc = frappe.db.exists({"doctype": "VGM_SummaryByCampaign", "campaign_code": self.name})
		if exist_doc is None:
			doc_summary = frappe.get_doc({'doctype': "VGM_SummaryByCampaign", 'campaign_code': self.name})
			doc_summary.total_customer_process = 0
			doc_summary.total_report_ai_pass = 0
			doc_summary.total_report_human_pass = 0
			doc_summary.total_report = 0
			doc_summary.total_picture = 0
			doc_summary.date_report = datetime.now().date()
			doc_summary.insert()
