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

odoo.define('muk_web_security.kanban_record', function (require) {
"use strict";

var ajax = require('web.ajax');
var core = require('web.core');
var utils = require('web.utils');

var KanbanRecord = require('web.KanbanRecord');

var QWeb = core.qweb;
var _t = core._t;

KanbanRecord.include({
	init: function (parent, state, options) {
		this._super.apply(this, arguments);
    	this._updateActions();
    },
    _updateRecord: function (data) {
        this._super.apply(this, arguments);
    	this._updateActions();
    },
    _updateActions: function() {
    	this.editable = this.recordData.permission_write !== undefined ?
    			this.recordData.permission_write : this.editable;
    	this.deletable = this.recordData.permission_unlink !== undefined ?
    			this.recordData.permission_unlink : this.deletable;
    }
});

});