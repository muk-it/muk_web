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

from . import models

from odoo import api, SUPERUSER_ID


def _uninstall_cleanup(cr, registry):
    env = api.Environment(cr, SUPERUSER_ID, {})
    env['web_editor.assets'].reset_asset(
        '/muk_web_theme/static/src/colors.scss', 
        'web._assets_primary_variables'
    )