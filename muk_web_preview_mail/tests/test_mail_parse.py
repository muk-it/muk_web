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
import base64
import logging
import unittest

from urllib.parse import urlunparse
from urllib.parse import urlparse
from urllib.parse import parse_qsl
from urllib.parse import urlencode
from contextlib import closing

from odoo import _
from odoo.tests import common

from odoo.addons.muk_web_preview_mail.controllers import main

_path = os.path.dirname(os.path.dirname(__file__))
_logger = logging.getLogger(__name__)

class MailParseTestCase(common.HttpCase):
    
    at_install = False
    post_install = True
    
    def setUp(self):
        super(MailParseTestCase, self).setUp()
        self.attachment_model = self.env['ir.attachment'].sudo()
        with closing(open(os.path.join(_path, 'tests/data/sample.eml'), 'rb')) as file:
            self.sample_mail_attachment = self.attachment_model.create({
                'name': 'SampleMail',
                'datas_fname': "sample.eml",
                'datas': base64.b64encode(file.read()),
            })

    def tearDown(self):
        super(MailParseTestCase, self).tearDown()
        
    def test_parse_mail(self):
        _logger.info(self.attachment_model.search([['name', '=', 'SampleMail']]))
        
        self.authenticate('admin', 'admin')
        url = "/web/preview/converter/mail"
        _logger.info(self.url_open("/web/content?id=%s" % self.sample_mail_attachment.id))  
        params = {'url': "/web/content?id={}".format(
           self.sample_mail_attachment.id
        )}
        url_parts = list(urlparse(url))
        query = dict(parse_qsl(url_parts[4]))
        query.update(params)
        url_parts[4] = urlencode(query)
        url = urlunparse(url_parts)
        _logger.info(url)
        #self.assertTrue(self.url_open(url))
        _logger.info(self.url_open(url))  
        _logger.info(self.url_open(url).headers)    
        _logger.info(self.url_open(url).content)       