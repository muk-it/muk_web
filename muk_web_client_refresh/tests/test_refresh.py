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

class RefreshTestCase(common.TransactionCase):
    
    at_install = False
    post_install = True
    
    def setUp(self):
        super(RefreshTestCase, self).setUp()
        self.model = self.env['ir.model'].sudo()
        self.bus = self.env['bus.bus'].sudo()
        self.rule = self.env['muk_web_client_refresh.rule'].sudo()
        
    def tearDown(self):
        super(RefreshTestCase, self).tearDown()
    
    def test_refresh_rule(self):
        start = self.bus.search([], count=True)
        model = self.model.search([('model', '=', 'ir.logging')], limit=1)
        self.rule.create({
            'name': "TestRule",
            'model': model.id,
            'refresh_create': True,
            'refresh_write': True,
            'refresh_unlink': True})
        log = model.create({
            'name': "Test",
            'type': "server",
            'message': "Test",
            'path': "/",
            'func': "Test",
            'line': "1",
        })
        create = self.bus.search([], count=True)
        self.assertTrue(start < create)
        log.write({'name': "Rename"})
        write = self.bus.search([], count=True)
        self.assertTrue(write > create)
        log.unlink()
        delete = self.bus.search([], count=True)
        self.assertTrue(write < delete)
        
        
    
        