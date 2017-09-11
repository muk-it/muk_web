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
		var channel = session.db + '_refresh';
        this.bus_declare_channel(channel, this.refresh);
        return this._super();
    },
    refresh: function(message) {
    	var active_view = this.action_manager.inner_widget.active_view
        if (active_view){   
            var controller = this.action_manager.inner_widget.active_view.controller
            if (controller.model === message  && !controller.$el.hasClass('o_form_editable')){                                               
                if (active_view.type === "kanban")
                    controller.do_reload();
                if (active_view.type === "list" || active_view.type === "form")
                    controller.reload();                                        
            }
        }
    }
});
    
});
