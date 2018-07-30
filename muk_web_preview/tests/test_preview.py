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
import logging
import unittest

from odoo.tests import common

_path = os.path.dirname(os.path.dirname(__file__))
_logger = logging.getLogger(__name__)

class PreviewTestCase(common.HttpCase):
    
    at_install = False
    post_install = True
    
    def setUp(self):
        super(PreviewTestCase, self).setUp()

    def tearDown(self):
        super(PreviewTestCase, self).tearDown()
    
    @unittest.skip("PhantomJS")
    def test_preview(self):
        self.phantom_js("/web?debug=",
                        "odoo.__DEBUG__.services['web_tour.tour'].run('preview')",
                        "odoo.__DEBUG__.services['web_tour.tour'].tours.preview.ready",
                        login="admin")
        