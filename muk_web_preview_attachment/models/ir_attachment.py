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

import logging
import mimetypes
import os.path

from odoo import models, api, fields

_logger = logging.getLogger(__name__)

class IrAttachment(models.Model):
    _inherit = 'ir.attachment'

    extension = fields.Char(string='File Extension', compute='_compute_extension')
    
    @api.depends('mimetype', 'datas_fname')
    def _compute_extension(self):
        for attachment in self:
            if attachment.datas_fname:
                attachment.extension = os.path.splitext(attachment.datas_fname)[1]
            elif attachment.mimetype:
                attachment.extension = mimetypes.guess_extension(attachment.mimetype, strict=False)