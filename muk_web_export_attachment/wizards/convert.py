###################################################################################
#
#    Copyright (C) 2017 MuK IT GmbH
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
###################################################################################

import os
import base64
import uuid
import logging
import mimetypes

from odoo import _, api, fields, models

from odoo.addons.muk_utils.tools.http import get_response
from odoo.addons.muk_converter.tools import converter

_logger = logging.getLogger(__name__)

class ConverterWizard(models.TransientModel):
    
    _inherit = "muk_converter.convert"
    
    res_model = fields.Char(
        string="Model")
    
    res_id = fields.Integer(
        string="ID")
    
    res_name = fields.Char(
        compute='_compute_res_name',
        string='Record',
        store=True)
    
    @api.depends('res_model', 'res_id')
    def _compute_res_name(self):
        for record in self:
            if record.res_model and record.res_id:
                rec = self.env[record.res_model].browse(record.res_id)
                record.res_name = rec.display_name
                
    @api.multi
    def convert_and_save(self):
        self.convert()
        for record in self:
            if record.res_model and record.res_id:
                self.env['ir.attachment'].create({
                    'type': "binary",
                    'name': record.output_name,
                    'datas_fname': record.output_name,
                    'datas': record.output_binary})
            else:
                raise ValueError("To save the converted file, a record has to be set.")
        return {
            'type': 'ir.actions.client',
            'tag': 'reload',
        }