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

odoo.define('muk_web_client_notification.channel', function (require) {
"use strict";

var core = require('web.core');
var session = require('web.session');	
var bus = require('bus.bus');	

var WebClient = require('web.WebClient');

var _t = core._t;
var QWeb = core.qweb;

WebClient.include({
	show_application: function() {
		var channel = "notify";
        this.bus_declare_channel(channel, this.notify);
        return this._super.apply(this, arguments);
    },
    notify: function(message) {
    	if(message.type === "warning")  {
    		this.notify_warning(message);
    	} else {
    		this.notify_info(message);
    	}
    },
    notify_warning: function(message){
        if(this.notification_manager) {
            this.notification_manager.do_warn(
            		message.title, message.message, message.sticky);
        }
    },
    notify_info: function(message){
        if(this.notification_manager) {
            this.notification_manager.do_notify(
            		message.title, message.message, message.sticky);
        }
    }
});
    
});
