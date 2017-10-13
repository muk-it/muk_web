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
var bus = require('bus.bus')	

WebClient.include({
	show_application: function() {
		var channel = 'refresh';
        this.bus_declare_channel(channel, this.refresh);
        return this._super();
    },
    refresh: function(message) {
    	var widget = this.action_manager.inner_widget;
    	var active_view = widget ? widget.active_view : false;
        if (active_view){   
            var controller = this.action_manager.inner_widget.active_view.controller
            if (controller.modelName === message &&
            		!controller.$el.hasClass('o_form_editable')){                                               
            	controller.reload();                                     
            } else if((message === "mail.message" || message === "mail.activity") &&
            		!controller.$el.hasClass('o_form_editable') &&
            		active_view.type === "form") {
            	controller.reload();           
            }
        }
    }
});
    
});
