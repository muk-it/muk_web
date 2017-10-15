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
import sys
import json
import uuid
import base64
import urllib
import urllib2
import logging
import tempfile
import urlparse
import cStringIO
import mimetypes
import collections

import werkzeug.exceptions
from contextlib import closing

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
    pdf_cache = TTLCache(maxsize=25, ttl=1200)
except ImportError:
    _logger.warn('Cannot `import cachetools`.')

try:
    import pdfconv
except ImportError:
    _logger.warn('Cannot `import pdfconv`.')
    
class MSOfficeParserController(http.Controller):
    
    @http.route('/web/preview/converter/msoffice', auth="user", type='http')
    def convert_msoffice(self, url, export_filename=None, force_compute=False, **kw):    
        try:
            response = pdf_cache[url] if pdf_cache and not force_compute else None
        except KeyError:
            response = None
        if not response:
            return self._get_response(url, export_filename)
        return response
    
    def _get_response(self, url, export_filename):
        if not bool(urlparse.urlparse(url).netloc):
            method, params = self._get_route(url)
            response = method(**params)
            if not response.status_code == 200:
                return self._make_error_response(response.status_code,response.description if hasattr(response, 'description') else _("Unknown Error"))
            else:
                content_type = response.headers['content-type']
                data = response.data
        else:
            try:
                response = requests.get(url)
                content_type = response.headers['content-type']
                data = response.content
            except requests.exceptions.RequestException as exception:
                return self._make_error_response(exception.response.status_code, exception.response.reason or _("Unknown Error"))
        try:
            response = self._make_pdf_response(pdfconv.converter.convert_binary2pdf(data, content_type, None, format='binary'), export_filename or uuid.uuid4())
            pdf_cache[url] = response
            return response
        except KeyError:
            return werkzeug.exceptions.UnsupportedMediaType(_("The file couldn't be converted. Unsupported mine type."))
        except (ImportError, IOError, OSError) as error:
            _logger.error(error)
            return werkzeug.exceptions.InternalServerError(_("An error occurred during the process. Please contact your system administrator."))

    def _get_route(self, url):
        url_parts = url.split('?')
        path = url_parts[0]
        query_string = url_parts[1] if len(url_parts) > 1 else None
        router = request.httprequest.app.get_db_router(request.db).bind('')
        match = router.match(path, query_args=query_string)
        method = router.match(path, query_args=query_string)[0]
        params = dict(urlparse.parse_qsl(query_string))
        if len(match) > 1:
            params.update(match[1])
        return method, params
        
    def _make_error_response(self, status, message):
        exception = werkzeug.exceptions.HTTPException()
        exception.code = status
        exception.description = message
        return exception
    
    def _make_pdf_response(self, file, filename):
        headers = [('Content-Type', 'application/pdf'),
                   ('Content-Disposition', 'attachment;filename="{}";'.format(filename)),
                   ('Content-Length', len(file))]
        return request.make_response(file, headers)