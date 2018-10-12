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
import json
import urllib
import logging
import mimetypes
import collections

import werkzeug

from odoo import _, http
from odoo.http import request, Response

from odoo.addons.muk_utils.tools.http import get_response
from odoo.addons.muk_utils.tools.http import make_error_response

_logger = logging.getLogger(__name__)

class MailParserController(http.Controller):
    
    _Attachment = collections.namedtuple('Attachment', 'name mimetype extension url info')
    
    @http.route('/web/preview/mail', auth="user", type='http')
    def preview_mail(self, url, attachment=None, **kw):     
        status, headers, content = get_response(url)
        if status != 200:
            return make_error_response(status, content or _("Unknown Error"))
        elif headers['content-type'] != 'message/rfc822':
            return werkzeug.exceptions.UnsupportedMediaType(
                _("Unparsable message! The file has to be of type: message/rfc822"))
        else:
            if not attachment:
                content = content.decode("latin-1").encode("utf8")
            message = request.env['mail.thread'].message_parse(content, False)
            return self._make_parse_response(request.httprequest.url, message, attachment)
        
    def _set_query_parameter(self, url, param_name, param_value):
        scheme, netloc, path, query_string, fragment = urllib.parse.urlsplit(url)
        query_params = urllib.parse.parse_qs(query_string)
        query_params[param_name] = [param_value]
        new_query_string = urllib.parse.urlencode(query_params, doseq=True)
        return urllib.parse.urlunsplit((scheme, netloc, path, new_query_string, fragment))
    
    def _make_attachment_response(self, file, filename):
        headers = [('Content-Type', mimetypes.guess_type(urllib.request.pathname2url(filename))[0]),
                   ('Content-Disposition', 'attachment; filename="{}";'.format(filename)),
                   ('Content-Length', len(file))]
        return request.make_response(file, headers)

    def _make_parse_response(self, url, message, attachment):
        if attachment:
            for file in message["attachments"]:
                if file.fname and file.fname == attachment:
                    return self._make_attachment_response(file.content, file.fname)
        else:
            attachments = []
            for file in message["attachments"]:
                mimetype = mimetypes.guess_type(urllib.request.pathname2url(file.fname))[0]
                extension = os.path.splitext(file.fname)[1]
                link = self._set_query_parameter(url, "attachment", file.fname)
                attachments.append(self._Attachment(file.fname, mimetype, extension, link, file.info))
            message["attachments"] = attachments
            return Response(json.dumps(message), content_type='application/json;charset=utf-8', status=200)