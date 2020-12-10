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

odoo.define('muk_web_theme.AppsMenu', function (require) {
"use strict";

const core = require('web.core');
const session = require("web.session");

const AppsMenu = require("web.AppsMenu");
const MenuSearchMixin = require("muk_web_theme.MenuSearchMixin");

AppsMenu.include(_.extend({}, MenuSearchMixin, {
    events: _.extend({}, AppsMenu.prototype.events, {
        "keydown .mk_search_input input": "_onSearchResultsNavigate",
        "click .mk_menu_search_result": "_onSearchResultChosen",
        "shown.bs.dropdown": "_onMenuShown",
        "hidden.bs.dropdown": "_onMenuHidden",
        "hide.bs.dropdown": "_onMenuHide",
    }),
    init(parent, menuData) {
        this._super(...arguments);
        for (let n in this._apps) {
            this._apps[n].web_icon_data = menuData.children[n].web_icon_data;
        }
        this._searchableMenus = _.reduce(
            menuData.children, this._findNames.bind(this), {}
        );
        this._search_def = $.Deferred();
    },
    start() {
        this._setBackgroundImage();
        this.$search_container = this.$(".mk_search_container");
        this.$search_input = this.$(".mk_search_input input");
        this.$search_results = this.$(".mk_search_results");
        return this._super(...arguments);
    },
    _onSearchResultChosen(event) {
        event.preventDefault();
        const $result = $(event.currentTarget),
            text = $result.text().trim(),
            data = $result.data(),
            suffix = ~text.indexOf("/") ? "/" : "";
        this.trigger_up("menu_clicked", {
            action_id: data.actionId,
            id: data.menuId,
            previous_menu_id: data.parentId,
        });
        const app = _.find(this._apps, (_app) => text.indexOf(_app.name + suffix) === 0);
        core.bus.trigger("change_menu_section", app.menuID);
    },
    _onAppsMenuItemClicked(event) {
    	this._super(...arguments);
    	event.preventDefault();
    },
    _setBackgroundImage() {
    	const url = session.url('/web/image', {
            model: 'res.company',
            id: session.company_id,
            field: 'background_image',
        });
        this.$('.dropdown-menu').css({
            "background-size": "cover",
            "background-image": "url(" + url + ")"
        });
        if (session.muk_web_theme_background_blend_mode) {
        	this.$('.o-app-name').css({
        		"mix-blend-mode": session.muk_web_theme_background_blend_mode,
        	});
        }
    },
    _onMenuHide(event) {
    	return $('.oe_wait').length === 0 && !this.$('input').is(':focus');
    },
}));

});