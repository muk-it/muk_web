/**********************************************************************************
*
*    Copyright (c) 2017-2019 MuK IT GmbH.
*
*    This file is part of MuK Backend Theme 
*    (see https://mukit.at).
*
*    This program is free software: you can redistribute it and/or modify
*    it under the terms of the GNU Lesser General Public License as published by
*    the Free Software Foundation, either version 3 of the License, or
*    (at your option) any later version.
*
*    This program is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU Lesser General Public License for more details.
*
*    You should have received a copy of the GNU Lesser General Public License
*    along with this program. If not, see <http://www.gnu.org/licenses/>.
*
**********************************************************************************/

odoo.define('muk_web_theme.ActionManager', function (require) {
    "use strict";

    var rpc = require('web.rpc');
    var session = require('web.session');
    var ActionManager = require('web.ActionManager');

    rpc.query({
        model: 'res.users',
        method: 'search_read',
        args: [[['id', '=', session.uid]], ['chatter_position']]
    }).then(function (pos) {
        var position = pos[0]['chatter_position'];
        var clsNames = 'o_action_manager mk_chatter_position_' + position;
        ActionManager.include({
            className: clsNames,

            _handleAction: function (action) {
                return this._super.apply(this, arguments).then($.proxy(this, '_hideMenusByAction', action));
            },
            _hideMenusByAction: function (action) {
                var unique_selection = '[data-action-id=' + action.id + ']';
                $(_.str.sprintf('.o_menu_apps .dropdown:has(.dropdown-menu.show:has(%s)) > a', unique_selection)).dropdown('toggle');
                $(_.str.sprintf('.o_menu_sections.show:has(%s)', unique_selection)).collapse('hide');
            },
        })
    });
})
