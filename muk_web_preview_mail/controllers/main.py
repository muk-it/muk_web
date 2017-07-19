# -*- coding: utf-8 -*-

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
import email
import base64
import urllib
import urllib2
import logging
import urlparse
import cStringIO
import mimetypes
import collections

import werkzeug.exceptions

from odoo import _
from odoo import tools
from odoo import http
from odoo.http import request
from odoo.http import Response

_logger = logging.getLogger(__name__)

try:
    import requests
except ImportError:
    _logger.warn('Cannot `import requests`.')

try:
    from cachetools import TTLCache
    mail_cache = TTLCache(maxsize=50, ttl=600)
except ImportError:
    _logger.warn('Cannot `import cachetools`.')

class Main(http.Controller):
    
    _Attachment = collections.namedtuple('Attachment', 'name mimetype extension url info')
    
    @http.route('/web/preview/converter/mail', auth="user", type='http')
    def parse_mail(self, url, attachment=None, force_compute=False, **kw):     
        try:
            message = mail_cache[url] if mail_cache and not force_compute else None
        except KeyError:
            message = None
        if not message:
            if not bool(urlparse.urlparse(url).netloc):
                url_parts = url.split('?')
                path = url_parts[0]
                query_string = url_parts[1] if len(url_parts) > 1 else None
                router = request.httprequest.app.get_db_router(request.db).bind('')
                match = router.match(path, query_args=query_string)
                method = router.match(path, query_args=query_string)[0]
                params = dict(urlparse.parse_qsl(query_string))
                if len(match) > 1:
                    params.update(match[1])
                response = method(**params)
                if not response.status_code == 200:
                    return self._make_error_response(response.status_code,response.description if hasattr(response, 'description') else _("Unknown Error"))
                else:
                    if response.headers['content-type'] == 'message/rfc822':
                        message = request.env['mail.thread'].message_parse(response.data, False)
                    else:
                        return werkzeug.exceptions.BadRequest(_("Unparsable message! The file has to be of type: message/rfc822"))
            else:
                if requests:
                    try:
                        response = requests.get(url)
                        if response.headers['content-type'] == 'message/rfc822':
                            message = request.env['mail.thread'].message_parse(response.content, False)
                        else:
                            return werkzeug.exceptions.BadRequest(_("Unparsable message! The file has to be of type: message/rfc822"))
                    except requests.exceptions.RequestException as exception:
                        return self._make_error_response(exception.response.status_code, exception.response.reason or _("Unknown Error"))
                else:
                    return werkzeug.exceptions.InternalServerError(_("To parse emails the Python library requests needs to be installed." +
                                                                     "Please contact your system administrator."))
        mail_cache[url] = message.copy()
        return self._make_parse_response(request.httprequest.url, message, attachment)
        
    def _set_query_parameter(self, url, param_name, param_value):
        scheme, netloc, path, query_string, fragment = urlparse.urlsplit(url)
        query_params = urlparse.parse_qs(query_string)
        query_params[param_name] = [param_value]
        new_query_string = urllib.urlencode(query_params, doseq=True)
        return urlparse.urlunsplit((scheme, netloc, path, new_query_string, fragment))
    
    def _make_error_response(self, status, message):
        exception = werkzeug.exceptions.HTTPException()
        exception.code = status
        exception.description = message
        return exception

    def _make_attachment_response(self, file, filename):
        headers = [('Content-Type', mimetypes.guess_type(urllib.pathname2url(filename))[0]),
                   ('Content-Disposition', 'attachment;filename={};'.format(filename)),
                   ('Content-Length', len(file))]
        return request.make_response(file, headers)

    def _make_parse_response(self, url, message, attachment):
        if attachment:
            for file in message["attachments"]:
                if file.fname == attachment:
                    return self._make_attachment_response(file.content, file.fname)
        else:
            attachments = []
            for file in message["attachments"]:
                mimetype = mimetypes.guess_type(urllib.pathname2url(file.fname))[0]
                extension = os.path.splitext(file.fname)[1]
                link = self._set_query_parameter(url, "attachment", file.fname)
                attachments.append(self._Attachment(file.fname, mimetype, extension, link, file.info))
            message["attachments"] = attachments
            return Response(json.dumps(message), content_type='application/json;charset=utf-8', status=200)