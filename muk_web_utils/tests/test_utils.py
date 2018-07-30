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
import unittest

from odoo.tests import common

_logger = logging.getLogger(__name__)

class UtilsTestCase(common.HttpCase):
    
    at_install = False
    post_install = True
    
    def setUp(self):
        super(UtilsTestCase, self).setUp()

    def tearDown(self):
        super(UtilsTestCase, self).tearDown()
    
    @unittest.skip("PhantomJS")
    def test_common(self):
        self.phantom_js('/web/tests?filter=utils%20>%20common', "", "", login='admin', timeout=360)
        
    @unittest.skip("PhantomJS")
    def test_jquery(self):
        self.phantom_js('/web/tests?filter=utils%20>%20jquery', "", "", login='admin', timeout=360)
    
    @unittest.skip("PhantomJS")
    def test_mimetype(self):
        self.phantom_js('/web/tests?filter=utils%20>%20mimetype', "", "", login='admin', timeout=360)
        