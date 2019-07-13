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

odoo.define('muk_web_export.ExportWidgets', function (require) {
"use strict";

var core = require('web.core');
var utils = require('web.utils');
var fields = require('web.basic_fields');

var QWeb = core.qweb;
var _t = core._t;

fields.FieldBinaryFile.include({
	willStart: function() {
		var self = this;
		var filename_fieldname = this.attrs.filename;
        var filename = this.recordData[filename_fieldname] || null;
		if (this.mode === 'readonly' && filename && !this.nodeOptions.no_export) {
	        var export_action = this._rpc({
	        	route: '/web/export_action',
	        }).then(function (result) {
	            self.export_action = result;
	        });
	        var check_export = this._rpc({
	        	route: '/web/check_export',
	            params: {
	            	filename: filename,
	            },
	        }).then(function (result) {
	            self.export_enabled = !!result;
	        });
	        return $.when(this._super.apply(this, arguments), export_action, check_export);
		} else {
			return this._super.apply(this, arguments);
		}
    },
	_renderReadonly: function () {
		this._super();		
		var self = this;
		var $el = this.$el;
		if(this.export_enabled) {
			var $wrapper = $('<div/>');
			var $button = $('<button type="button" class="o_binary_export" aria-hidden="true"/>');
	    	$button.append($('<i class="fa fa-sign-out"></i>'));
	    	$button.click(function(e) {
	            e.preventDefault();
	    		e.stopPropagation();
	    		var value = self.value;
	            var filename_fieldname = self.attrs.filename;
	            var filename = self.recordData[filename_fieldname] || null;
				var url = '/web/content?' + $.param({
	                'model': self.model,
	                'id': self.res_id,
	                'field': self.name,
	                'filename_field': filename_fieldname,
	                'filename': filename,
	                'download': true,
	                'data': utils.is_bin_size(value) ? null : value,
	            });

	            self.do_action({
            		'type': 'ir.actions.act_window',
 	                'res_model': "muk_converter.convert",
 	                'name': _t('Convert File'),
 	                'views': [[self.export_action, 'form']],
	                'view_type': 'form',
	                'view_mode': 'form',
	                'target': 'new',
	                'context': {
	                	'default_input_url': utils.is_bin_size(value) ? url : null,
	                	'default_input_binary': utils.is_bin_size(value) ? null : value,
	                	'default_input_name': filename,
	                },
                }); 
	    	});
			$wrapper.addClass($el.attr('class'));
			$el.removeClass("o_field_widget o_hidden");
			self.replaceElement($wrapper);
	    	$wrapper.append($button);
	    	$wrapper.append($el);
		}
    },
});

});