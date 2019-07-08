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

odoo.define('muk_web_theme.RelationalFields', function (require) {
"use strict";

var core = require('web.core');
var config = require("web.config");
var fields = require('web.relational_fields');

var _t = core._t;
var QWeb = core.qweb;

fields.FieldStatus.include({
    _setState: function () {
        this._super.apply(this, arguments);
        if (config.device.isMobile) {
            _.map(this.status_information, function (value) {
                value.fold = true;
            });
        }
    },
});

fields.FieldOne2Many.include({
    _renderButtons: function () {
        var result = this._super.apply(this, arguments);
        if (config.device.isMobile && this.$buttons) {
        	var $buttons = this.$buttons.find('.btn-secondary');
        	$buttons.addClass('btn-primary mk_mobile_add');
            $buttons.removeClass('btn-secondary');
        }
        return result;
    }
});

fields.FieldMany2Many.include({
    _renderButtons: function () {
        var result = this._super.apply(this, arguments);
        if (config.device.isMobile && this.$buttons) {
        	var $buttons = this.$buttons.find('.btn-secondary');
        	$buttons.addClass('btn-primary mk_mobile_add');
            $buttons.removeClass('btn-secondary');
        }
        return result;
    }
});

});