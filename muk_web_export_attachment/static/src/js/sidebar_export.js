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

odoo.define('muk_export_attachment.SidebarPreview', function (require) {
"use strict";

var core = require('web.core');
var session = require('web.session');
var Sidebar = require('web.Sidebar');
var Model = require("web.Model");

var PreviewGenerator = require('muk_preview.PreviewGenerator');
var PreviewDialog = require('muk_preview.PreviewDialog');

var Attachment = new Model('ir.attachment', session.user_context);

var QWeb = core.qweb;
var _t = core._t;

Sidebar.include({
    on_attachments_loaded: function(attachments) {
    	var exportable = false;
    	_.each(attachments , function(attachment) {
    		if(['doc', 'docx', 'docm', 'odt', 'xls', 'xlsx', 'xlsm', 'ods',
    			'ppt', 'pptx', 'pptm', 'odp'].includes((/(?:\.([^.]+))?$/).exec(attachment.name)[1])) {
    			attachment.exportable = 'exportable';
    			exportable = true;
    		} else {
    			attachment.exportable = 'unexportable';
    		}
        });
    	if(!exportable) {
    		_.each(attachments , function(attachment) {
    			attachment.exportable = 'nothing-exportable';
            });
    	}
    	this._super(attachments);
        this.$el.find('.o_sidebar_export_attachment').click(this.on_attachment_export);
    },
    on_attachment_export: function(e) {
        e.preventDefault();
        e.stopPropagation();
        var $target  = $(e.currentTarget);
        var filename = $target.data("name");
        window.location.href = '/web/export/pdf?' + $.param({
            'url': $target.data("url"),
            'filename': filename.substr(0, filename.lastIndexOf('.')) + ".pdf",
        });
    }
});

});