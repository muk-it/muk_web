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
        colors = self.env['muk_utils.scss_editor'].get_values(
            SCSS_URL, XML_ID, ['o-brand-odoo', 'o-brand-primary']
        )
        brand_changed = self.theme_color_brand != colors['o-brand-odoo']
        primary_changed = self.theme_color_primary != colors['o-brand-primary']
        if(brand_changed or primary_changed):
            variables = [
                {'name': 'o-brand-odoo', 'value': self.theme_color_brand or "#243742"},
                {'name': 'o-brand-primary', 'value': self.theme_color_primary or "#5D8DA8"},
            ]
            self.env['muk_utils.scss_editor'].replace_values(
                SCSS_URL, XML_ID, variables
            )
        return res

    @api.model
    def get_values(self):
        res = super(ResConfigSettings, self).get_values()
        colors = self.env['muk_utils.scss_editor'].get_values(
            SCSS_URL, XML_ID, ['o-brand-odoo', 'o-brand-primary']
        )
        res.update({
            'theme_color_brand': colors['o-brand-odoo'],
            'theme_color_primary': colors['o-brand-primary'],
        })
        return res