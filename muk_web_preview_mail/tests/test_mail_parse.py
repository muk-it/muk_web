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
        url = "/web/preview/converter/mail?url=/web/content/%s?download=true" % self.sample_mail_attachment.id
        self.assertTrue(self.url_open(url))
        _logger.info(self.url_open(url).response.headers)    
        _logger.info(self.url_open(url).response.data)       