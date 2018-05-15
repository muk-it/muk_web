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

openerp.muk_preview_PreviewWidgets = function (instance) {




var ListView = instance.web.ListView;

var Widget = instance.web.Widget;


var PreviewHandler = openerp.med_preview_PreviewHandler;
var PreviewGenerator = openerp.med_preview_PreviewGenerator;
var PreviewDialog = med_preview_PreviewDialog;

var _t = instance.web._t,
   _lt = instance.web._lt;
var QWeb = instance.web.qweb;



instance.web.form.FieldBinary.include({
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
	                PreviewDialog.createPreviewDialog(self, 'web/binary/saveas?' + $.param({
	                    'model': self.view.dataset.model,
	                    'id': self.view.datarecord.id,
	                    'field': self.name,
	                    'filename_field': filename_fieldname,
	                    'filename': filename,
	                    'download': true,
	                    'data': instance.web.form.is_bin_size(value) ? null : value,
	                }), false, filename ? filename.split('.').pop() : false, filename);
	        	});
        	}
        } else {
        	this.$el.parent().find('.o_binary_preview').hide();
        }
    },
});


instance.web.list.Binary.include({
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

};