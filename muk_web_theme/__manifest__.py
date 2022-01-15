###################################################################################
#
#    Copyright (c) 2017-today MuK IT GmbH.
#
#    This file is part of MuK Theme
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

{
    'name': 'MuK Backend Theme', 
    'summary': 'Odoo Community Backend Theme',
    'version': '15.0.1.0.1', 
    'category': 'Themes/Backend', 
    'license': 'LGPL-3', 
    'author': 'MuK IT',
    'website': 'http://www.mukit.at',
    'live_test_url': 'https://mukit.at/r/SgN',
    'contributors': [
        'Mathias Markl <mathias.markl@mukit.at>',
    ],
    'depends': [
        'base_setup',
        'web_editor',
        'mail',
    ],
    'excludes': [
        'web_enterprise',
    ],
    'data': [
       'templates/webclient.xml',
       'views/res_config_settings_view.xml',
       'views/res_users.xml',
    ],
    'assets': {
        'web.assets_qweb': [
            'muk_web_theme/static/src/**/*.xml',
        ],
        'web._assets_primary_variables': [
            'muk_web_theme/static/src/colors.scss',
        ],
        'web._assets_backend_helpers': [
            'muk_web_theme/static/src/variables.scss',
            'muk_web_theme/static/src/mixins.scss',
        ],
        'web.assets_backend': [
            'muk_web_theme/static/src/webclient/**/*.scss',
            'muk_web_theme/static/src/webclient/**/*.js',
            'muk_web_theme/static/src/search/**/*.scss',
            'muk_web_theme/static/src/search/**/*.js',
            'muk_web_theme/static/src/legacy/**/*.scss',
            'muk_web_theme/static/src/legacy/**/*.js',
        ],
    },
    'images': [
        'static/description/banner.png',
        'static/description/theme_screenshot.png'
    ],
    'external_dependencies': {
        'python': [],
        'bin': [],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
    'uninstall_hook': '_uninstall_reset_changes',
}
