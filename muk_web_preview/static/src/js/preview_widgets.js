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
        	this.$('.o_binary_preview').click(function(e) {
        		e.stopPropagation();
                var value = self.get('value');
                var filename_fieldname = self.node.attrs.filename;
                var filename_field = self.view.fields && self.view.fields[filename_fieldname];
                var filename = filename_field ? filename_field.get('value') : null;
                PreviewDialog.createPreviewDialog(self, '/web/content?' + $.param({
                    'model': self.view.dataset.model,
                    'id': self.view.datarecord.id,
                    'field': self.name,
                    'filename_field': filename_fieldname,
                    'filename': filename,
                    'download': true,
                    'data': utils.is_bin_size(value) ? null : value,
                }), false, filename.split('.').pop(), filename);
        	});
        }
    },
    render_value: function() {
        var filename = this.view.datarecord[this.node.attrs.filename];
        if (this.get("effective_readonly")) {
            this.do_toggle(!!this.get('value'));
            if (this.get('value')) {
                var $link = this.$el.find('a')
                $link.empty().append($("<span/>").addClass('fa fa-download'));
                if (filename) {
                	$link.append(" " + filename);
                } else {
                	$link.append(" " + _t("Download"));
                }
            }
        } else {
            this._super();
        }
    }
    
});


});