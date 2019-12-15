###################################################################################
#
#    Copyright (c) 2017-2019 MuK IT GmbH.
#
#    This file is part of MuK Web Branding 
#    (see https://mukit.at).
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Lesser General Public License as published by
#    the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Lesser General Public License for more details.
#
#    You should have received a copy of the GNU Lesser General Public License
#    along with this program. If not, see <http://www.gnu.org/licenses/>.
#
###################################################################################

from odoo import api, fields, models

PRIMARY_XML_ID = "muk_web_branding.less_helpers_primary_override"
PRIMARY_SCSS_URL = "/muk_web_branding/static/src/less/primary_colors.less"

SECONDARY_XML_ID = "muk_web_branding.less_helpers_secondary_override"
SECONDARY_SCSS_URL = "/muk_web_branding/static/src/less/secondary_colors.less"

BOOTSTRAP_XML_ID = "muk_web_branding.assets_backend_override"
BOOTSTRAP_SCSS_URL = "/muk_web_branding/static/src/less/bootstrap_colors.less"

class ResConfigSettings(models.TransientModel):

    _inherit = 'res.config.settings'

    #----------------------------------------------------------
    # Database
    #----------------------------------------------------------
    
    branding_color_primary = fields.Char(
        string="Primary Color")
    
    branding_color_optional = fields.Char(
        string="Optional Color")
    
    branding_color_secondary = fields.Char(
        string="Secondary Color")
    
    branding_color_lightsecondary = fields.Char(
        string="Light Secondary Color")
    
    branding_color_silver = fields.Char(
        string="Silver Color")
    
    branding_color_silver_dark = fields.Char(
        string="Silver Dark Color")
    
    branding_color_silver_darker = fields.Char(
        string="Silver Darker Color")
    
    branding_color_text = fields.Char(
        string="Text Color")
    
    branding_color_muted = fields.Char(
        string="Muted Color")
    
    branding_color_view = fields.Char(
        string="View Color")

    branding_color_background = fields.Char(
        string="Background Color")
    
    branding_color_panel = fields.Char(
        string="Panel Color")
    
    branding_color_form = fields.Char(
        string="Form Color")
    
    branding_color_01 = fields.Char(
        string="Color 01")
    
    branding_color_02 = fields.Char(
        string="Color 02")
    
    branding_color_03 = fields.Char(
        string="Color 03")
    
    branding_color_04 = fields.Char(
        string="Color 04")
    
    branding_color_05 = fields.Char(
        string="Color 05")
    
    branding_color_06 = fields.Char(
        string="Color 06")
    
    branding_color_07 = fields.Char(
        string="Color 07")
    
    branding_color_08 = fields.Char(
        string="Color 08")
    
    branding_color_09 = fields.Char(
        string="Color 09")
    
    branding_color_10 = fields.Char(
        string="Color 10")
    
    branding_color_11 = fields.Char(
        string="Color 11")
    
    branding_color_12 = fields.Char(
        string="Color 12")

    branding_color_success = fields.Char(
        string="Success Color")
    
    branding_color_info = fields.Char(
        string="Info Color")
    
    branding_color_warning = fields.Char(
        string="Warning Color")
    
    branding_color_danger = fields.Char(
        string="Danger Color")
    
    
    #----------------------------------------------------------
    # Helper
    #----------------------------------------------------------
    
    def _get_branding_primary_colors(self):
        variables = [
            'odoo-brand-primary',
            'odoo-brand-optional',
            'odoo-brand-secondary',
            'odoo-brand-lightsecondary',
            'odoo-color-silver',
            'odoo-color-silver-dark',
            'odoo-color-silver-darker',
            'odoo-main-text-color',
            'odoo-main-color-muted',
            'odoo-view-background-color',
        ]
        colors = self.env['muk_web_branding.less_editor'].get_values(
            PRIMARY_SCSS_URL, PRIMARY_XML_ID, variables
        )
        return {
            'branding_color_primary': colors['odoo-brand-primary'],
            'branding_color_optional': colors['odoo-brand-optional'],
            'branding_color_secondary': colors['odoo-brand-secondary'],
            'branding_color_lightsecondary': colors['odoo-brand-lightsecondary'],
            'branding_color_silver': colors['odoo-color-silver'],
            'branding_color_silver_dark': colors['odoo-color-silver-dark'],
            'branding_color_silver_darker': colors['odoo-color-silver-darker'],
            'branding_color_text': colors['odoo-main-text-color'],
            'branding_color_muted': colors['odoo-main-color-muted'],
            'branding_color_view': colors['odoo-view-background-color'],
        }
    
    def _get_branding_secondary_colors(self):
        variables = [
            'odoo-webclient-background-color',
            'odoo-control-panel-background-color',
            'odoo-form-lightsecondary',
            'odoo-color-0',
            'odoo-color-1',
            'odoo-color-2',
            'odoo-color-3',
            'odoo-color-4',
            'odoo-color-5',
            'odoo-color-6',
            'odoo-color-7',
            'odoo-color-8',
            'odoo-color-9',
            'odoo-color-10',
            'odoo-color-11',
        ]
        colors = self.env['muk_web_branding.less_editor'].get_values(
            SECONDARY_SCSS_URL, SECONDARY_XML_ID, variables
        )
        return {
            'branding_color_background': colors['odoo-webclient-background-color'],
            'branding_color_panel': colors['odoo-control-panel-background-color'],
            'branding_color_form': colors['odoo-form-lightsecondary'],
            'branding_color_01': colors['odoo-color-0'],
            'branding_color_02': colors['odoo-color-1'],
            'branding_color_03': colors['odoo-color-2'],
            'branding_color_04': colors['odoo-color-3'],
            'branding_color_05': colors['odoo-color-4'],
            'branding_color_06': colors['odoo-color-5'],
            'branding_color_07': colors['odoo-color-6'],
            'branding_color_08': colors['odoo-color-7'],
            'branding_color_09': colors['odoo-color-8'],
            'branding_color_10': colors['odoo-color-9'],
            'branding_color_11': colors['odoo-color-10'],
            'branding_color_12': colors['odoo-color-11'],
        }
    
    def _get_branding_bootstrap_colors(self):
        variables = [
            'success',
            'info',
            'warning',
            'danger',
        ]
        colors = self.env['muk_web_branding.less_editor'].get_values(
            BOOTSTRAP_SCSS_URL, BOOTSTRAP_XML_ID, variables
        )
        return {
            'branding_color_success': colors['success'],
            'branding_color_info': colors['info'],
            'branding_color_warning': colors['warning'],
            'branding_color_danger': colors['danger'],
        }
        
    def _check_branding_colors(self, colors, variables):
        for values in variables:
            if colors[values['field']] != values['value']:
                return True
        return False
    
    def _set_branding_primary_colors(self):
        variables = [{
            'name': 'odoo-brand-primary',
            'field': 'branding_color_primary',
            'value': self.branding_color_primary or "#7C7BAD"
        }, {
            'name': 'odoo-brand-optional',
            'field': 'branding_color_optional',
            'value': self.branding_color_optional or "#7C7BAD"
        }, {
            'name': 'odoo-brand-secondary',
            'field': 'branding_color_secondary',
            'value': self.branding_color_secondary or "#f0eeee"
        }, {
            'name': 'odoo-brand-lightsecondary',
            'field': 'branding_color_lightsecondary',
            'value': self.branding_color_lightsecondary or "#e2e2e0"
        }, {
            'name': 'odoo-color-silver',
            'field': 'branding_color_silver',
            'value': self.branding_color_silver or "#F9F9F9"
        }, {
            'name': 'odoo-color-silver-dark', 
            'field': 'branding_color_silver_dark', 
            'value': self.branding_color_silver_dark or "#E5E5E5"
        }, {
            'name': 'odoo-color-silver-darker', 
            'field': 'branding_color_silver_darker', 
            'value': self.branding_color_silver_darker or "#d9d7d7"
        }, {
            'name': 'o-main-text-color',
            'field': 'branding_color_text',
            'value': self.branding_color_text or "#4c4c4c"
        }, {
            'name': 'o-main-color-muted',
            'field': 'branding_color_muted',
            'value': self.branding_color_muted or "#a8a8a8"
        }, {
            'name': 'o-view-background-color',
            'field': 'branding_color_view',
            'value': self.branding_color_view or "#ffffff"
        }]
        colors = self._get_branding_primary_colors()
        if self._check_branding_colors(colors, variables):
            self.env['muk_web_branding.less_editor'].replace_values(
                PRIMARY_SCSS_URL, PRIMARY_XML_ID, variables
            )
    
    def _set_branding_secondary_colors(self):
        variables = [{
            'name': 'odoo-webclient-background-color',
            'field': 'branding_color_background',
            'value': self.branding_color_background or "#f9f9f9"
        }, {
            'name': 'odoo-control-panel-background-color',
            'field': 'branding_color_panel',
            'value': self.branding_color_panel or "#f9f9f9"
        }, {
            'name': 'odoo-form-lightsecondary',
            'field': 'branding_color_form',
            'value': self.branding_color_form or "#f9f9f9"
        }, {
            'name': 'odoo-color-0',
            'field': 'branding_color_01',
            'value': self.branding_color_01 or "#757575"
        }, {
            'name': 'odoo-color-1',
            'field': 'branding_color_02',
            'value': self.branding_color_02 or "#F06050"
        }, {
            'name': 'odoo-color-2',
            'field': 'branding_color_03',
            'value': self.branding_color_03 or "#F4A460"
        }, {
            'name': 'odoo-color-3',
            'field': 'branding_color_04',
            'value': self.branding_color_04 or "#F7CD1F"
        }, {
            'name': 'odoo-color-4',
            'field': 'branding_color_05',
            'value': self.branding_color_05 or "#6CC1ED"
        }, {
            'name': 'odoo-color-5',
            'field': 'branding_color_06',
            'value': self.branding_color_06 or "#814968"
        }, {
            'name': 'odoo-color-6',
            'field': 'branding_color_07',
            'value': self.branding_color_07 or "#EB7E7F"
        }, {
            'name': 'odoo-color-7',
            'field': 'branding_color_08',
            'value': self.branding_color_08 or "#2C8397"
        }, {
            'name': 'odoo-color-8',
            'field': 'branding_color_09',
            'value': self.branding_color_09 or "#475577"
        }, {
            'name': 'odoo-color-9',
            'field': 'branding_color_10',
            'value': self.branding_color_10 or "#D6145F"
        }, {
            'name': 'odoo-color-10',
            'field': 'branding_color_11',
            'value': self.branding_color_11 or "#30C381"
        }, {
            'name': 'odoo-color-11',
            'field': 'branding_color_12',
            'value': self.branding_color_12 or "#9365B8"
        }]
        colors = self._get_branding_secondary_colors()
        if self._check_branding_colors(colors, variables):
            self.env['muk_web_branding.less_editor'].replace_values(
                SECONDARY_SCSS_URL, SECONDARY_XML_ID, variables
            )
            
    def _set_branding_bootstrap_colors(self):
        variables = [{
            'name': 'success',
            'field': 'branding_color_success',
            'value': self.branding_color_success or "#28a745"
        }, {
            'name': 'info',
            'field': 'branding_color_info',
            'value': self.branding_color_info or "#17a2b8"
        }, {
            'name': 'warning',
            'field': 'branding_color_warning',
            'value': self.branding_color_warning or "#ffc107"
        }, {
            'name': 'danger',
            'field': 'branding_color_danger',
            'value': self.branding_color_danger or "#dc3545"
        }]
        colors = self._get_branding_bootstrap_colors()
        if self._check_branding_colors(colors, variables):
            self.env['muk_web_branding.less_editor'].replace_values(
                BOOTSTRAP_SCSS_URL, BOOTSTRAP_XML_ID, variables
            )        
    
    #----------------------------------------------------------
    # Functions
    #----------------------------------------------------------
    
    @api.model
    def get_values(self):
        res = super(ResConfigSettings, self).get_values()
        res.update(self._get_branding_primary_colors())
        res.update(self._get_branding_secondary_colors())
        res.update(self._get_branding_bootstrap_colors())
        return res
    
    @api.multi 
    def set_values(self):
        res = super(ResConfigSettings, self).set_values()
        self._set_branding_primary_colors()
        self._set_branding_secondary_colors()
        self._set_branding_bootstrap_colors()
        return res

    
    