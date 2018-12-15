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

odoo.define('muk_web_client_refresh.channel', function (require) {
"use strict";

var WebClient = require('web.WebClient');
var session = require('web.session');		
var config = require('web.config');	
var bus = require('bus.bus');	

WebClient.include({
	start: function () {
		var self = this;
		var load_config = this._rpc({
            route: '/config/muk_web_client_refresh.refresh_delay',
        }).done(function(result) {
            self.refresh = _.throttle(self.refresh.bind(self), result.refresh_delay || 1000, true);
        });
		return $.when(this._super.apply(this, arguments), load_config);
	},
	show_application: function() {
		var channel = 'refresh';
        this.bus_declare_channel(channel, this.refresh);
        return this._super.apply(this, arguments);
    },
    refresh: function(message) {
    	var widget = this.action_manager && this.action_manager.inner_widget;
    	var active_view = widget ? widget.active_view : false;
    	if (active_view && session.uid !== message.uid) {
            var controller = this.action_manager.inner_widget.active_view.controller;
            if(controller && controller.modelName === message.model && controller.mode === "readonly") {
            	if(active_view.type === "form" && message.ids.includes(widget.env.currentId)) {
            		controller.reload();
            	} else if(active_view.type === "list" &&
            			(message.create || _.intersection(message.ids, widget.env.ids) >= 1)) {
            		controller.reload();
            	} else if(active_view.type === "kanban" &&
            			(message.create || _.intersection(message.ids, widget.env.ids) >= 1)) {
            		controller.reload();
            	}
            }
        }
    },
});

});
