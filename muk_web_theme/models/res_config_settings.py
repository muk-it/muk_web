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

import re
import uuid
import base64

from odoo import api, fields, models

XML_ID = "muk_web_theme._assets_primary_variables"
SCSS_URL = "/muk_web_theme/static/src/scss/colors.scss"

TEMPLATE = """
    $o-brand-odoo: {0};
    $o-brand-primary: {1};
    
    $mk-brand-gradient-start: lighten($o-brand-odoo, 10%);
    $mk-brand-gradient-end: lighten($o-brand-odoo, 20%);
"""

class ResConfigSettings(models.TransientModel):

    _inherit = 'res.config.settings'

    theme_background_image = fields.Binary(
        related="company_id.background_image",
        readonly=False,
        required=True)
    
    theme_color_brand = fields.Char(
        string="Brand Color")
    
    theme_color_primary = fields.Char(
        string="Primary Color")
    
    @api.multi 
    def set_values(self):
        res = super(ResConfigSettings, self).set_values()
        self._save_scss_values()
        return res

    @api.model
    def get_values(self):
        res = super(ResConfigSettings, self).get_values()
        res.update(self._get_scss_values())
        return res
    
    def _get_scss_values(self):
        colors = self.env['muk_utils.scss_editor'].get_value(
            SCSS_URL, XML_ID, ['o-brand-odoo', 'o-brand-primary']
        )
        return {
            'theme_color_brand': colors['o-brand-odoo'],
            'theme_color_primary': colors['o-brand-primary'],
        }
    
    def _build_custom_scss_template(self):
        return TEMPLATE.format(
            self.theme_color_brand or "#243742",
            self.theme_color_primary or "#5D8DA8"
        )
    
    def _save_scss_values(self):
        self.env['muk_utils.scss_editor'].replace_content(
            SCSS_URL, XML_ID, self._build_custom_scss_template()
        )