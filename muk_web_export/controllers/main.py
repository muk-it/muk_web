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
import logging

from odoo import http
from odoo.http import request

from odoo.addons.muk_converter.tools import converter

_logger = logging.getLogger(__name__)

class ExportController(http.Controller):
    
    @http.route('/web/export_action', type='json', auth="user")
    def export_action(self, **kw):
        return request.env.ref("muk_web_export.view_converter_export_form").id
    
    @http.route('/web/export_formats', type='json', auth="user")
    def export_formats(self, **kw):
        return converter.formats()
    
    @http.route('/web/check_export', type='json', auth="user")
    def check_export(self, filename, **kw):
        try:
            if os.path.splitext(filename)[1][1:].strip().lower() in converter.formats():
                return True
        except Exception:
            return False
        return False
            