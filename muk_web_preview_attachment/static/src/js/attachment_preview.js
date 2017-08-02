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

odoo.define('muk_preview_attachment.AttachmentPreview', function (require) {
"use strict";

var core = require('web.core');
var session = require('web.session');
var Model = require("web.Model");

var KanbanView = require('web_kanban.KanbanView');

var PreviewGenerator = require('muk_preview.PreviewGenerator');
var PreviewDialog = require('muk_preview.PreviewDialog');

var Attachment = new Model('ir.attachment', session.user_context);

var QWeb = core.qweb;
var _t = core._t;

KanbanView.include({
	init: function() {
		this._super.apply(this, arguments);
		this.events = _.extend(this.events, {
            'click .oe_attachment .o_image': 'preview',
        });
	},
    preview: function(e) {
    	e.preventDefault();
        e.stopPropagation();
        var self = this;
        var $target  = $(e.currentTarget);
        
        Attachment.query(['name', 'url', 'type', 'mimetype', 'extension'])
        	.filter([['id', '=', $target.data('id')]])
        	.first().then(function(attachment) {
        		if(!attachment.url && attachment.type === "binary") {
        			attachment.url = '/web/content/' + attachment.id + '?download=true';
        		}
        		PreviewDialog.createPreviewDialog(self, attachment.url, attachment.mimetype,
        				attachment.extension, attachment.name);
        });
    },
});

});