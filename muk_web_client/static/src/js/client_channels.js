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

odoo.define('muk_web_client.channel', function (require) {
"use strict";

var WebClient = require('web.WebClient');
var session = require('web.session');	
var bus = require('bus.bus')	

WebClient.include({
    init: function(parent, client_options){
        this._super(parent, client_options);
        this.bus_channels = [];
        this.bus_events = [];
    },
    show_application: function() {
        var _super = this._super();
        bus.bus.on('notification', this, this.bus_notification);
        bus.bus.start_polling();
        return _super;
    },
    destroy: function() {
    	var self = this;
        bus.bus.off('notification', this, this.bus_notification);
        $.each(this.bus_channels, function(index, channel) {
            self.bus_delete_channel(channel);
        });
        $.each(this.bus_events, function(index, event) {
            self.bus_off(event[0], event[1]);
        });
        this._super();
    },
    bus_declare_channel: function(channel, method) {
    	if($.inArray(channel, this.bus_channels) === -1) {
    		this.bus_on(channel, method);
    		this.bus_channels.push(channel);
    		bus.bus.add_channel(channel);
    	}
    },
    bus_delete_channel: function(channel) {
    	var index = $.inArray(channel, this.bus_channels);
    	bus.bus.delete_channel(channel);
        this.bus_channels.splice(index, 1);
    },
    bus_notification: function(notifications) {
        var self = this;
    	$.each(notifications, function(index, notification) {
        	var channel = notification[0];
        	var message = notification[1];
            if($.inArray(channel, self.bus_channels) !== -1) {
                bus.bus.trigger(channel, message);
            }
        });
    },
    bus_on: function(name, event) {
        bus.bus.on(name, this, event);
        this.bus_events.push([name, event]);
    },
    bus_off: function(name, event) {
    	var index = $.map(this.bus_events, function(tuple, index) {
            if(tuple[0] === name && tuple[1] === event) {
                return index;
            }
        });
        bus.bus.off(name, this, event);
        this.bus_events.splice(index, 1);
    },
});
    
});
