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

odoo.define('muk_preview.PreviewWidgets', function (require) {
"use strict";

var core = require('web.core');
var utils = require('web.utils');
var fields = require('web.basic_fields');
var registry = require('web.field_registry');

var AbstractField = require('web.AbstractField');

var PreviewHandler = require('muk_preview.PreviewHandler');
var PreviewGenerator = require('muk_preview.PreviewGenerator');
var PreviewDialog = require('muk_preview.PreviewDialog');

var QWeb = core.qweb;
var _t = core._t;

fields.FieldBinaryFile.include({
	_renderReadonly: function () {
		this._super();		
		var self = this;
		var $el = this.$el;
		var $wrapper = $('<div/>');
		var $button = $('<button type="button" class="o_binary_preview" aria-hidden="true"/>');
    	$button.append($('<i class="fa fa-file-text-o"></i>'));
    	$button.click(function(e) {
            e.preventDefault();
    		e.stopPropagation();
            var filename_fieldname = self.attrs.filename;
            var filename = self.recordData[filename_fieldname] || null;
            PreviewDialog.createPreviewDialog(self, '/web/content?' + $.param({
                'model': self.model,
                'id': self.res_id,
                'field': self.name,
                'filename_field': filename_fieldname,
                'filename': filename,
                'download': true,
                'data': utils.is_bin_size(self.value) ? null : self.value,
            }), false, filename ? filename.split('.').pop() : false, filename);
    	});
		$wrapper.addClass($el.attr('class'));
		$el.removeClass("o_field_widget o_hidden");
		this.replaceElement($wrapper);
    	$wrapper.append($button);
    	$wrapper.append($el);
    },
});

var FieldPreviewBinary = fields.FieldBinaryFile.extend({
	events: _.extend({}, AbstractField.prototype.events, {
		'change .o_input_file': 'on_file_change',
        'click .o_select_file_button': function () {
            this.$('.o_input_file').click();
        },
        'click .o_clear_file_button': 'on_clear',
		'click .o_input': function () {
            this.$('.o_input_file').click();
        },
    }),
	template: 'FieldPreviewBinary',
	_renderReadonly: function () {
		var self = this;
		if(this.value) {
	        var filename_fieldname = this.attrs.filename;
	        var filename = this.recordData[filename_fieldname] || null;
			var download_url = '/web/content?' + $.param({
	            'model': self.model,
	            'id': self.res_id,
	            'field': self.name,
	            'filename_field': filename_fieldname,
	            'filename': filename,
	            'download': true,
	            'data': utils.is_bin_size(this.value) ? null : this.value,
	        });
			PreviewGenerator.createPreview(this, download_url, false,
					filename ? filename.split('.').pop() : false, filename).then(function($content) {
				self.$el.html($content);
			});
		} else {
			self.$el.html('<h2 class="text-center">No preview available!</h2>');
		}
	}
});

registry.add('preview_binary', FieldPreviewBinary);

return FieldPreviewBinary;

});