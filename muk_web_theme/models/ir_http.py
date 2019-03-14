###################################################################################
#
#    Copyright (C) 2018 MuK IT GmbH
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

from odoo import models
from odoo.http import request


class IrHttp(models.AbstractModel):
    
    _inherit = 'ir.http'

    def session_info(self):
        result = super(IrHttp, self).session_info()
        params = request.env['ir.config_parameter'].sudo()
        blend_mode = params.get_param('muk_web_theme.background_blend_mode')
        result.update(muk_web_theme_background_blend_mode=blend_mode or 'normal')
        return result
