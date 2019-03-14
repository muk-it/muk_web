/**********************************************************************************
* 
*    Copyright (C) 2017 MuK IT GmbH
*
*    This program is free software: you can redistribute it and/or modify
*    it under the terms of the GNU Affero General Public License as
*    published by the Free Software Foundation, either version 3 of the
*    License, or (at your option) any later version.
*
*    This program is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU Affero General Public License for more details.
*
*    You should have received a copy of the GNU Affero General Public License
*    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
**********************************************************************************/

odoo.define('muk_web_theme.AppsMenu', function (require) {
"use strict";

var core = require('web.core');
var config = require("web.config");
var session = require("web.session");

var AppsMenu = require("web.AppsMenu");

var _t = core._t;
var QWeb = core.qweb;

AppsMenu.include({
    events: _.extend({}, AppsMenu.prototype.events, {
        "keydown .mk_search_input input": "_onSearchResultsNavigate",
        "click .mk_menu_search_result": "_onSearchResultChosen",
        "shown.bs.dropdown": "_onMenuShow",
        "hidden.bs.dropdown": "_onMenuHide",
    }),
    init: function (parent, menuData) {
        this._super.apply(this, arguments);
        for (var n in this._apps) {
            this._apps[n].web_icon_data = menuData.children[n].web_icon_data;
        }
        this._searchableMenus = _.reduce(
            menuData.children, this._findNames.bind(this), {}
        );
        this._search_def = $.Deferred();
    },
    start: function () {
        this._setBackgroundImage();
        this.$search_container = this.$(".mk_search_container");
        this.$search_input = this.$(".mk_search_input input");
        this.$search_results = this.$(".mk_search_results");
        return this._super.apply(this, arguments);
    },
    _onAppsMenuItemClicked: function (event) {
    	this._super.apply(this, arguments);
    	event.preventDefault();
    },
    _findNames: function (memo, menu) {
        if (menu.action) {
            var key = menu.parent_id ? menu.parent_id[1] + "/" : "";
            memo[key + menu.name] = menu;
        }
        if (menu.children.length) {
            _.reduce(menu.children, this._findNames.bind(this), memo);
        }
        return memo;
    },
    _setBackgroundImage: function () {
    	var url = session.url('/web/image', {
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
    _menuInfo: function (key) {
        var original = this._searchableMenus[key];
        return _.extend({
            action_id: parseInt(original.action.split(',')[1], 10),
        }, original);
    },
    _onMenuShow: function(event) {
    	this._searchFocus();
    },
    _onMenuHide: function(event) {
    	this._searchReset();
    	
    },
    _searchFocus: function () {
        if (!config.device.isMobile) {
            this.$search_input.focus();
        } else {
        	this.$search_input.blur();
        }
    },
    _searchReset: function () {
        this.$search_container.removeClass("has-results");
        this.$search_results.empty();
        this.$search_input.val("");
    },
    _searchMenusSchedule: function () {
        this._search_def.reject();
        this._search_def = $.Deferred();
        setTimeout(this._search_def.resolve.bind(this._search_def), 50);
        this._search_def.done(this._searchMenus.bind(this));
    },
    _searchMenus: function () {
        var query = this.$search_input.val();
        if (query === "") {
            this.$search_container.removeClass("has-results");
            this.$search_results.empty();
            return;
        }
        var results = fuzzy.filter(query, _.keys(this._searchableMenus), {
            pre: "<b>",
            post: "</b>",
        });
        this.$search_container.toggleClass("has-results", Boolean(results.length));
        this.$search_results.html(QWeb.render("muk_web_theme.MenuSearchResults", {
            results: results,
            widget: this,
        }));
    },
    _onSearchResultChosen: function (event) {
        event.preventDefault();
        var $result = $(event.currentTarget),
            text = $result.text().trim(),
            data = $result.data(),
            suffix = ~text.indexOf("/") ? "/" : "";
        this.trigger_up("menu_clicked", {
            action_id: data.actionId,
            id: data.menuId,
            previous_menu_id: data.parentId,
        });
        var app = _.find(this._apps, function (_app) {
            return text.indexOf(_app.name + suffix) === 0;
        });
        core.bus.trigger("change_menu_section", app.menuID);
    },
    _onSearchResultsNavigate: function (event) {
        if (this.$search_results.html().trim() === "") {
            this._searchMenusSchedule();
            return;
        }
        var all = this.$search_results.find(".mk_menu_search_result"),
            pre_focused = all.filter(".active") || $(all[0]),
            offset = all.index(pre_focused),
            key = event.key;
        if (key === "Tab") {
            event.preventDefault();
            key = event.shiftKey ? "ArrowUp" : "ArrowDown";
        }
        switch (key) {
	        case "Enter":
	            pre_focused.click();
	            break;
	        case "ArrowUp":
	            offset--;
	            break;
	        case "ArrowDown":
	            offset++;
	            break;
	        default:
	        	if (key.length === 1 || key === "Backspace") {
	        		this._searchMenusSchedule();
                }
            return;
        }
        if (offset < 0) {
            offset = all.length + offset;
        } else if (offset >= all.length) {
            offset -= all.length;
        }
        var new_focused = $(all[offset]);
        pre_focused.removeClass("active");
        new_focused.addClass("active");
        this.$search_results.scrollTo(new_focused, {
            offset: {
                top: this.$search_results.height() * -0.5,
            },
        });
    },
});

});