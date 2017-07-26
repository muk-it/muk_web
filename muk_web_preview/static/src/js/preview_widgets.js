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
var Widget = require('web.Widget');
var ListView = require('web.ListView');

var PreviewHandler = require('muk_preview.PreviewHandler');
var PreviewGenerator = require('muk_preview.PreviewGenerator');
var PreviewDialog = require('muk_preview.PreviewDialog');

var QWeb = core.qweb;
var _t = core._t;

core.form_widget_registry.get("binary").include({
	initialize_content: function() {
        var self = this;
        this._super();
        if (this.get("effective_readonly")) {
        	var $preview = this.$el.parent().find('.o_binary_preview');
        	if($preview.length) {
        		$preview.show();
        	} else {
	        	var $button = $('<button type="button" class="o_binary_preview" aria-hidden="true" />');
	        	$button.append($('<i class="fa fa-file-text-o"></i>'));
	        	$button.insertBefore(this.$el);
	        	$button.click(function(e) {
	                e.preventDefault();
	        		e.stopPropagation();
	                var value = self.get('value');
	                var filename_fieldname = self.node.attrs.filename;
	                var filename_field = self.view.fields && filename_fieldname && self.view.fields[filename_fieldname];
	                var filename = filename_field ? filename_field.get('value') : null;
	                PreviewDialog.createPreviewDialog(self, '/web/content?' + $.param({
	                    'model': self.view.dataset.model,
	                    'id': self.view.datarecord.id,
	                    'field': self.name,
	                    'filename_field': filename_fieldname,
	                    'filename': filename,
	                    'download': true,
	                    'data': utils.is_bin_size(value) ? null : value,
	                }), false, filename ? filename.split('.').pop() : false, filename);
	        	});
        	}
        } else {
        	this.$el.parent().find('.o_binary_preview').hide();
        }
    },
});

core.list_widget_registry.get("field.binary").include({
	_format: function(row_data, options) {
        var link = this._super(row_data, options);
		var value = row_data[this.id].value;
		var filename = this.filename && row_data[this.filename].value;
        if (value && filename && value.substr(0, 10).indexOf(' ') !== -1) {
            var download_url = '/web/content?' + $.param({
            	'model': options.model,
            	'field': this.id,
            	'id': options.id,
            	'download': true,
            	'filename_field': this.filename
			});
            var preview = _.template(
	    		'<button type="button" \
	        		  class="o_binary_preview" \
	        		  aria-hidden="true" \
					  data-link="<%-link%>" \
					  data-filename="<%-filename%>"> \
	        	  	<i class="fa fa-file-text-o"></i> \
	          	</button>')({
	        	link: download_url,
	            filename: filename,
		    });
            return preview + link;
        }
        return link;
	}
});

ListView.include({
	reload_content: function() {
		var self = this;
		var reloaded = this._super();
		reloaded.then(function() {
			var $elements = self.$el.find('.o_binary_preview');
			$elements.click(function(e) {
        		e.stopPropagation();
        		var $target = $(e.currentTarget);
				PreviewDialog.createPreviewDialog(self, $target.data('link'),
						false, $target.data('filename').split('.').pop(),
						$target.data('filename'));
			});
	    });
		return reloaded;
	}
});

});