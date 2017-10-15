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

odoo.define('muk_preview_attachment.PreviewHelper', function (require) {
"use strict";

var core = require('web.core');
var session = require('web.session');

var PreviewGenerator = require('muk_preview.PreviewGenerator');
var PreviewDialog = require('muk_preview.PreviewDialog');

var QWeb = core.qweb;
var _t = core._t;

var PreviewHelper = core.Class.extend({
	createAttachmentPreview: function(id, widget) {
		widget._rpc({
            fields: ['name', 'url', 'type', 'mimetype', 'extension'],
            domain: [['id', '=', id]],
            model: 'ir.attachment',
            method: 'search_read',
            limit: 1,
            context: session.user_context,
        }).then(function (attachments) {
        	var attachment = attachments.length > 0 ? attachments[0] : null;
        	if(attachment) {
	        	if(!attachment.url && attachment.type === "binary") {
					attachment.url = '/web/content/' + attachment.id + '?download=true';
				}
				PreviewDialog.createPreviewDialog(self, attachment.url, attachment.mimetype,
						attachment.extension, attachment.name);
        	}
        });
	}
});

PreviewHelper.createAttachmentPreview = function(id, widget) {
    return new PreviewHelper().createAttachmentPreview(id, widget);
};

return PreviewHelper;

});