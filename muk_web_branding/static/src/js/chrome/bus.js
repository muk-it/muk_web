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

odoo.define('muk_web_branding.bus', function (require) {
"use strict";

var core = require('web.core');
var session = require('web.session');

var BusService = require('bus.BusService');

var _t = core._t;
var QWeb = core.qweb;

BusService.include({
	sendNotification: function (title, content, callback) {
        if (title === _t('Yay, push notifications are enabled!') || title === _t('Permission denied')) {
            content = content.replace(/Odoo/ig, session.muk_branding_system_name);
        }
        this._super(title, content, callback);
    },
    _sendNativeNotification: function (title, content, callback) {
        var notification = new Notification(title, {
        	body: content,
        	icon: '/web/binary/company_logo?company_id=' + session.company_id
        });
        notification.onclick = function () {
            window.focus();
            if (this.cancel) {
                this.cancel();
            } else if (this.close) {
                this.close();
            }
            if (callback) {
                callback();
            }
        };
    },
});

});