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

from odoo import http
from odoo.http import request

_logger = logging.getLogger(__name__)

class BackendController(http.Controller):
    
    @http.route('/params/muk_web_utils.binary_max_size', type='json', auth="user")
    def max_upload_size(self, **kw):
        params = request.env['ir.config_parameter'].sudo()
        return {
            'max_upload_size': int(params.get_param('muk_web_utils.binary_max_size', default=25))
        }