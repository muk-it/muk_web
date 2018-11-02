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

odoo.define('muk_web_utils.CharShare', function (require) {
"use strict";

var core = require('web.core');
var session = require('web.session');
var fields = require('web.basic_fields');
var registry = require('web.field_registry');

var utils = require('muk_web_utils.utils');

var _t = core._t;
var QWeb = core.qweb;

var CharShare = fields.CharCopyClipboard.extend({
    events: _.extend({}, fields.CharCopyClipboard.prototype.events, {
        'click .mk_share_dropdown_message': '_onShareMessageClick',
        'click .mk_share_dropdown_note': '_onShareNoteClick',
        'click .mk_share_dropdown_mail': '_onShareMailClick',
        'click .mk_share_dropdown_send': '_onShareSendClick',
    }),
    init: function(parent, name, record) {
        this._super.apply(this, arguments);
        this.fields = record.fields;
        this.navigator = window.navigator.share;
        this.chatter = _.contains(odoo._modules, "mail");
    },
    _render: function() {
        this._super.apply(this, arguments);
        this.$el.addClass('mk_field_share');
        this.$el.prepend($(QWeb.render('muk_web_utils.CharShare', {
        	navigator: !!this.navigator,
        	chatter: !!this.chatter,
        })));
    },
    _getShareMessage: function() {
    	var values = {
    		name: session.partner_display_name,
    		url: utils.isUrl(this.value) && this.value,
    		text: this.value,
    	};
    	var message = QWeb.render('muk_web_utils.ShareMessage', {
    		values: values,
    	});
    	return {
    		subject: values.name + _t(" shared a message!"),
    		url: values.url,
    		body: message,
    	}
    },
    _openShareChat: function(note) {
    	var values = this._getShareMessage();
    	var context = {
            default_is_log: !!note,
            default_body: values.body,
            default_subject: values.subject,
            default_model: this.recordData[this.attrs.res_model] || this.model,
            default_res_id: this.recordData[this.attrs.res_id] || this.res_id,
            mail_post_autofollow: false,
        };
        this.do_action({
            type: 'ir.actions.act_window',
            res_model: 'mail.compose.message',
            view_mode: 'form',
            view_type: 'form',
            views: [[false, 'form']],
            target: 'new',
            context: context,
        });
    },
    _onShareMessageClick: function(event) {
    	event.preventDefault();
    	event.stopPropagation();
    	this._openShareChat(false);
    },
    _onShareNoteClick: function(event) {
    	event.preventDefault();
    	event.stopPropagation();
    	this._openShareChat(true);
    },
    _onShareMailClick: function(event) {
    	event.preventDefault();
    	event.stopPropagation();
    	var values = this._getShareMessage();
    	window.location.href = "mailto:?subject=" + values.subject + "&body=" + this.value;
    },
    _onShareSendClick: function(event) {
    	event.preventDefault();
    	event.stopPropagation();
    	var values = this._getShareMessage();
    	if (values.url) {
    		navigator.share({
    			title: values.subject,
    			url: values.url,
    		});
    	} else {
    		navigator.share({
    			title: values.subject,
    			text: this.value,
    		});
    	}
    	
    },
});

registry.add('share', CharShare);

return CharShare;

});