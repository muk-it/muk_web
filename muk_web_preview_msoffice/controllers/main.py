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

import uuid
import logging
import mimetypes

import werkzeug

from odoo import _, http
from odoo.http import request

from odoo.addons.muk_utils.tools.http import get_response
from odoo.addons.muk_utils.tools.http import make_error_response

_logger = logging.getLogger(__name__)

MIMETPYES = [
    'application/msword', 'application/ms-word', 'application/vnd.ms-word.document.macroEnabled.12',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.mspowerpoint',
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint.presentation.macroEnabled.12'
]

class MSOfficeParserController(http.Controller):
    
    @http.route('/web/preview/msoffice', auth="user", type='http')
    def preview_msoffice(self, url, **kw):    
        status, headers, content = get_response(url)
        if status != 200:
            return make_error_response(status, content or _("Unknown Error"))
        elif headers['content-type'] not in MIMETPYES:
            return werkzeug.exceptions.UnsupportedMediaType()
        else:
            try:
                filename = "%s%s" % (uuid.uuid4(), mimetypes.guess_extension(headers['content-type']))
                output = request.env['muk_converter.converter'].convert_raw(filename, content)
                return self._make_pdf_response(output, "%s.pdf" % filename)
            except Exception:
                _logger.exception("Error while convert the file.")
                return werkzeug.exceptions.InternalServerError()
    
    def _make_pdf_response(self, file, filename):
        headers = [('Content-Type', 'application/pdf'),
                   ('Content-Disposition', 'attachment; filename="{}";'.format(filename)),
                   ('Content-Length', len(file))]
        return request.make_response(file, headers)