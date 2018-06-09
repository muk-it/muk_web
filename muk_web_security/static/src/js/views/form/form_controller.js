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

odoo.define('muk_web_security.form_controller', function (require) {
"use strict";

var ajax = require('web.ajax');
var core = require('web.core');
var utils = require('web.utils');

var FormController = require('web.FormController');

var QWeb = core.qweb;
var _t = core._t;

FormController.include({
	_update: function() {
	    var self = this;
	    var data = this.model.get(this.handle).data;
	    this.activeActions.edit = data.permission_write === undefined ?
	    		this.activeActions.edit : !!data.permission_write;
	    this.activeActions.create = data.permission_create === undefined ?
	    		this.activeActions.create : !!data.permission_create;
	    this.activeActions.delete = data.permission_unlink === undefined ?
	    		this.activeActions.delete : !!data.permission_unlink;
	    this.activeActions.duplicate = data.permission_create === undefined ?
	    		this.activeActions.duplicate : !!data.permission_create;
	    if(this.activeActions.edit && data.locked !== undefined && !data.editor &&
	    		data.locked && data.locked instanceof Object) {
	    	this.activeActions.locked = true;
	    } else {
	    	this.activeActions.locked = false;
	    }
	    return $.when(this._super.apply(this, arguments));
	},
	_updateButtons: function () {
    	this._super.apply(this, arguments);
    	if(this.$buttons) {
    		var $create = this.$buttons.find('.o_form_button_create');
    		var $edit = this.$buttons.find('.o_form_button_edit');
    		$create.toggle(this.activeActions.create);
			$edit.toggle(this.activeActions.edit);
    		if(!!this.activeActions.locked) {
    			$edit.prop("disabled", true);
				$edit.text(_t("Locked!"));
    		} else {
    			$edit.prop("disabled", false);
				$edit.text(_t("Edit"));
    		}
    	}
    },
    _updateSidebar: function () {
    	this._super.apply(this, arguments);
    	if(this.sidebar) {
    		var $delete = this.sidebar.$el.find(
    			'li > a[data-section="other"]:contains("' + _t('Delete') + '")');
			var $duplicate = this.sidebar.$el.find(
				'li > a[data-section="other"]:contains("' + _t('Duplicate') + '")');
			$delete.toggle(this.activeActions.delete && !this.activeActions.locked);
			$duplicate.toggle(this.activeActions.duplicate);
    	}
    	
    },
});

});