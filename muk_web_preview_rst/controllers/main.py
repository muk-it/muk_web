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

from odoo import _, http

from odoo.addons.muk_utils.tools.http import get_response
from odoo.addons.muk_utils.tools.http import make_error_response
from odoo.addons.muk_utils.tools.parse_rst import rst2html

_logger = logging.getLogger(__name__)
    
class ReStructuredTextController(http.Controller):
    
    @http.route('/web/preview/rst', auth="user", type='http')
    def preview_rst(self, url, **kw):    
        status, header, content = get_response(url)
        if status != 200:
            return make_error_response(status, content or _("Unknown Error"))
        else:
            return rst2html(content)
    