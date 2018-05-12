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

odoo.define('muk_preview_attachment.WidgetPreview', function (require) {
"use strict";

var core = require('web.core');
var session = require('web.session');
var fields = require('web.relational_fields');

var PreviewHelper = require('muk_preview_attachment.PreviewHelper');

var QWeb = core.qweb;
var _t = core._t;

fields.FieldMany2ManyBinaryMultiFiles.include({
	init: function() {
		this._super.apply(this, arguments);
		this.events = _.extend(this.events, {
            'click .oe_attachment .o_image': '_preview',
            'click .o_attachment_preview': '_preview',
        });
	},
	_preview: function(e) {
    	e.preventDefault();
        e.stopPropagation();
        PreviewHelper.createAttachmentPreview(
        		$(e.currentTarget).data('id'), this);
    },
});

});