/**********************************************************************************
* 
*    Copyright (C) 2018 MuK IT GmbH
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

odoo.define('muk_web_security.list_controller', function (require) {
"use strict";

var ajax = require('web.ajax');
var core = require('web.core');
var utils = require('web.utils');

var ListRenderer = require('web.ListRenderer');

var QWeb = core.qweb;
var _t = core._t;

ListRenderer.include({
	_setDecorationClasses: function (record, $tr) {
		this._super.apply(this, arguments);
		if(record.data.permission_write !== undefined && record.data.permission_write &&
				record.data.locked !== undefined && record.data.locked && !record.data.editor &&
				record.data.locked instanceof Object) {
			$tr.addClass("locked");
		} else {
			$tr.removeClass("locked");
		}
		if(record.data.permission_unlink !== undefined && !record.data.permission_unlink) {
			$tr.addClass("no_unlink");
		} else {
			$tr.removeClass("no_unlink");
		}
	},
});

});