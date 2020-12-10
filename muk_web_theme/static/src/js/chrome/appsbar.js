/**********************************************************************************
*
*    Copyright (c) 2017-today MuK IT GmbH.
*
*    This file is part of MuK Grid Snippets
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

odoo.define('muk_web_theme.AppsBar', function (require) {
"use strict";

const Widget = require('web.Widget');

const AppsBar = Widget.extend({
	events: _.extend({}, Widget.prototype.events, {
        'click .nav-link': '_onAppsMenuItemClicked',
    }),
	template: "muk_web_theme.AppsBarMenu",
	init(parent, menu) {
        this._super(...arguments);
        this._apps = _.map(menu.children, (app) => ({
                actionID: parseInt(app.action.split(',')[1]),
                web_icon_data: app.web_icon_data,
                menuID: app.id,
                name: app.name,
                xmlID: app.xmlid,
            })
        );
    },
    getApps() {
        return this._apps;
    },
    _openApp(app) {
        this.trigger_up('app_clicked', {
            action_id: app.actionID,
            menu_id: app.menuID,
        });
    },
    _onAppsMenuItemClicked(ev) {
        const $target = $(ev.currentTarget);
        const actionID = $target.data('action-id');
        const menuID = $target.data('menu-id');
        const app = _.findWhere(this._apps, {
        	actionID: actionID,
        	menuID: menuID 
        });
        this._openApp(app);
        ev.preventDefault();
        $target.blur();
    },
});

return AppsBar;

});