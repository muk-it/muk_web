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

var AbstractField = require('web.AbstractField');

var _t = core._t;
var QWeb = core.qweb;

var ShareMixin = {
	fieldDependencies: _.extend({}, AbstractField.prototype.fieldDependencies, {
		display_name: {type: 'char'},
    }),
    events: _.extend({}, fields.InputField.prototype.events, {
        'click .mk_share_dropdown_message': '_onShareMessageClick',
        'click .mk_share_dropdown_note': '_onShareNoteClick',
        'click .mk_share_dropdown_mail': '_onShareMailClick',
        'click .mk_share_dropdown_send': '_onShareSendClick',
    }),
	init: function(parent, name, record) {
        this._super.apply(this, arguments);
        this.navigator = window.navigator.share;
        this.chatter = _.contains(odoo._modules, "mail");
        this.shareOptions = _.defaults(this.nodeOptions, {
        	subjectTemplate: _t("<%= name %> shared a message!"),
        	textTemplate: _t("<%= value %>"),
        	bodyTemplate: 'muk_web_utils.ShareMessage',
        });
        this.shareOptions = _.extend({}, this.shareOptions, {
        	res_model: this.recordData[this.nodeOptions.res_model] || this.model,
        	res_id: this.recordData[this.nodeOptions.res_id] || this.res_id,
        });
    },
    getShareMessageValues: function(message) {
    	var values = {
    		name: session.partner_display_name,
    		record: this.recordData.display_name,
    		url: utils.isUrl(this.value) && this.value,
    		value: this.value,
    	};
    	return {
    		subject: _.template(this.shareOptions.subjectTemplate)(values),
    		body: QWeb.render(this.shareOptions.bodyTemplate, values),
    		text: _.template(this.shareOptions.textTemplate)(values),
    	}
    },
    openShareChat: function(note) {
    	var values = this.getShareMessageValues();
    	var context = {
            default_is_log: note,
            default_body: values.body,
            default_subject: values.subject,
            default_model: this.shareOptions.res_model,
            default_res_id: this.shareOptions.res_id,
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
    	this.openShareChat(false);
    },
    _onShareNoteClick: function(event) {
    	event.preventDefault();
    	event.stopPropagation();
    	this.openShareChat(true);
    },
    _onShareMailClick: function(event) {
    	event.preventDefault();
    	event.stopPropagation();
    	var values = this.getShareMessageValues();
    	var subject = "subject=" + values.subject;
    	var body = "&body=" + encodeURIComponent(values.text);
    	window.location.href = "mailto:?" + subject + body;
    },
    _onShareSendClick: function(event) {
    	event.preventDefault();
    	event.stopPropagation();
    	var values = this.getShareMessageValues();
    	navigator.share({
    		title: values.subject,
    		text: values.text,
    		url: utils.isUrl(this.value) && this.value
    	});
    },
};

var CharShare = fields.CharCopyClipboard.extend(ShareMixin, {
    _render: function() {
        this._super.apply(this, arguments);
        this.$el.addClass('mk_field_share');
        this.$el.prepend($(QWeb.render('muk_web_utils.CharShare', {
        	navigator: !!this.navigator,
        	chatter: !!this.chatter,
        })));
    },
});

var TextShare = fields.TextCopyClipboard.extend(ShareMixin, {
    _render: function() {
    	this._super.apply(this, arguments);
        this.$el.addClass('mk_field_share');
        this.$el.prepend($(QWeb.render('muk_web_utils.TextShare', {
        	navigator: !!this.navigator,
        	chatter: !!this.chatter,
        })));
    }
});

registry.add('share_char', CharShare);
registry.add('share_text', TextShare);

return {
	ShareMixin: ShareMixin,
	CharShare: CharShare,
	TextShare: TextShare,
};

});