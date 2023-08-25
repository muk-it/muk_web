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

from odoo import models, fields, api


class IrAsset(models.Model):
    
    _inherit = 'ir.asset'
    
    # ----------------------------------------------------------
    # ORM
    # ----------------------------------------------------------

    @api.model_create_multi
    def create(self, vals_list):
        if self.env.context.get('theme_variables', False):
            for vals in vals_list:
                vals.pop('website_id', False)
        return super().create(vals_list)
