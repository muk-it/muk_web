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
    
    def _get_custom_scss_url(self, url, xmlid):
        return self._build_custom_scss_url(url.rsplit(".", 1), xmlid)
    
    def _build_custom_scss_url(self, url_parts, xmlid):
        return "%s.custom.%s.%s" % (url_parts[0], xmlid, url_parts[1])
    
    def _get_custom_attachment(self, url):
        return self.env["ir.attachment"].search([("url", '=', url)])
    
    def _get_scss_values(self):
        custom_url = self._get_custom_scss_url(SCSS_URL, XML_ID)
        custom_attachment = self._get_custom_attachment(custom_url)
        if custom_attachment.exists():
            content = str(base64.b64decode(custom_attachment.datas))
            brand = re.search( r'o-brand-odoo\:?\s(.*?);', content)
            primary = re.search( r'o-brand-primary\:?\s(.*?);', content)
            return {
                'theme_color_brand': brand and brand.group(1) or "#243742",
                'theme_color_primary': primary and primary.group(1) or "#5D8DA8",
            }
        else:
            return {
                'theme_color_brand': "#243742",
                'theme_color_primary': "#5D8DA8",
            }
    
    def _build_custom_scss_template(self):
        return TEMPLATE.format(
            self.theme_color_brand or "#243742",
            self.theme_color_primary or "#5D8DA8"
        )
    
    def _save_scss_values(self):
        custom_url = self._get_custom_scss_url(SCSS_URL, XML_ID)
        custom_attachment = self._get_custom_attachment(custom_url)
        custom_content = self._build_custom_scss_template()
        datas = base64.b64encode((custom_content).encode("utf-8"))
        if custom_attachment:
            custom_attachment.write({"datas": datas})
        else:
            self.env["ir.attachment"].create({
                'name': custom_url,
                'type': "binary",
                'mimetype': "text/scss",
                'datas': datas,
                'datas_fname': SCSS_URL.split("/")[-1],
                'url': custom_url,
            })
            view_to_xpath = self.env["ir.ui.view"].get_related_views(
                XML_ID, bundles=True
            ).filtered(lambda v: v.arch.find(SCSS_URL) >= 0)
            self.env["ir.ui.view"].create({
                'name': custom_url,
                'key': 'web_editor.scss_%s' % str(uuid.uuid4())[:6],
                'mode': "extension",
                'inherit_id': view_to_xpath.id,
                'arch': """
                    <data inherit_id="%(inherit_xml_id)s" name="%(name)s">
                        <xpath expr="//link[@href='%(url_to_replace)s']" position="attributes">
                            <attribute name="href">%(new_url)s</attribute>
                        </xpath>
                    </data>
                """ % {
                    'inherit_xml_id': view_to_xpath.xml_id,
                    'name': custom_url,
                    'url_to_replace': url,
                    'new_url': custom_url,
                }
            })
        self.env["ir.qweb"].clear_caches()