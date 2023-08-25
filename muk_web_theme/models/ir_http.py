###################################################################################
#
#    Copyright (c) 2017-today MuK IT GmbH.
#
#    This file is part of MuK Backend Theme
#    (see https://mukit.at).
#
#    License LGPL-3.0 or later (http://www.gnu.org/licenses/lgpl).
#
###################################################################################

from odoo import models
from odoo.http import request


class IrHttp(models.AbstractModel):

    _inherit = "ir.http"

    #----------------------------------------------------------
    # Functions
    #----------------------------------------------------------
    
    def session_info(self):
        result = super(IrHttp, self).session_info()
        if request.env.user._is_internal():
            for company in request.env.user.company_ids:
                result['user_companies']['allowed_companies'][company.id].update({
                    'has_background_image': bool(company.background_image),
                })
        result['pager_autoload_interval'] = int(
            self.env['ir.config_parameter'].sudo().get_param(
                'muk_web_theme.autoload', default=30000
            )
        )
        return result
