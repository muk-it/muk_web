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

from odoo import models, fields


class ResCompany(models.Model):
    
    _inherit = 'res.company'
    
    #----------------------------------------------------------
    # Fields
    #----------------------------------------------------------
    
    background_image = fields.Binary(
        string='Apps Menu Background Image',
        attachment=True
    )
