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
import unittest

from contextlib import closing

from odoo import _
from odoo.tests import common

_path = os.path.dirname(os.path.dirname(__file__))

class AttachmentExtensionTestCase(common.TransactionCase):
    
    at_install = False
    post_install = True
    
    def setUp(self):
        super(AttachmentExtensionTestCase, self).setUp()
        self.attachment_model = self.env['ir.attachment'].sudo()

    def tearDown(self):
        super(AttachmentExtensionTestCase, self).tearDown()
        
    def test_attachment_extension_filename(self):
        with closing(open(os.path.join(_path, 'tests/data/sample.png'), 'r')) as file:
            self.sample = self.attachment_model.create({
                'name': "test",
                'datas_fname': "sample.png",
                'datas': base64.encodestring(file.read()),
            })
        self.assertEqual(self.sample.extension, ".png")
        
    def test_attachment_extension_mimetype(self):
        with closing(open(os.path.join(_path, 'tests/data/sample.png'), 'r')) as file:
            self.sample = self.attachment_model.create({
                'name': "test",
                'mimetype': "image/png",
                'datas': base64.encodestring(file.read()),
            })
        self.assertEqual(self.sample.extension, ".png")
        
        
    
        