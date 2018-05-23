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

var QWeb = core.qweb;
var _t = core._t;

Sidebar.include({
	willStart: function() {
		var self = this;
		var export_action = this._rpc({
        	route: '/web/attachment/export_action',
        }).then(function (result) {
            self.export_action = result;
        });
		var export_formats = this._rpc({
        	route: '/web/export_formats',
        }).then(function (result) {
            self.export_formats = result;
        });
        return this._super.apply(this, arguments);
    },
    _processAttachments: function(attachments) {
    	var self = this;
    	var res = this._super.apply(this, arguments);
    	var exportable = false;
    	_.each(this.items.files ,function (attachment) {
    		if(self.export_formats.includes((/(?:\.([^.]+))?$/).exec(attachment.name.replace(/\s\(\d+\)$/, ""))[1])) {
    			attachment.exportable = 'exportable';
    			exportable = true;
    		} else {
    			attachment.exportable = 'unexportable';
    		}
        });
    	if(!exportable) {
    		_.each(this.items.files ,function (attachment) {
    			attachment.exportable = 'nothing-exportable';
            });
    	}
    	return res;
    },
    _redraw: function () {
        this._super.apply(this, arguments);
        this.$el.find('.o_sidebar_export_attachment')
        	.click(this._on_attachment_export.bind(this));
    },
    _on_attachment_export: function(e) {
        var self = this;
        var $target  = $(e.currentTarget);
        this.do_action({
    		'type': 'ir.actions.act_window',
            'res_model': "muk_converter.convert",
            'name': _t('Convert File'),
            'views': [[self.export_action, 'form']],
            'view_type': 'form',
            'view_mode': 'form',
            'target': 'new',
            'context': {
            	'default_res_id': self.env.activeIds[0],
            	'default_res_model': self.env.model,
            	'default_type': "url",
            	'default_input_url': $target.data("url"),
            	'default_input_name': $target.data("name"),
            },
        }); 
        e.preventDefault();
        e.stopPropagation();
    }
});

});