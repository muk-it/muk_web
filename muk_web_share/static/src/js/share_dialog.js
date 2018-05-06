/*******************************************************************************
 * 
 * Copyright (C) 2017 MuK IT GmbH
 * 
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option) any
 * later version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 * 
 ******************************************************************************/

odoo.define('muk_web_share.dialog', function(require) {
"use strict";

var core = require('web.core');
var session = require('web.session');
var config = require('web.config');
var chat_manager = require('mail.chat_manager');

var Dialog = require('web.Dialog');

var QWeb = core.qweb;
var _t = core._t;

var ShareDialog = Dialog.extend({
	init: function (parent, options) {
		var self = this;
		this.url = options.url || window.location.href;
		options = _.defaults(options || {}, {
            title: _t("Share"), subtitle: '',
            size: 'smale',
            dialogClass: 'muk_share_dialog_body',
            $content: $(QWeb.render('muk_web_share.ShareDialog', {
            	widget: this,
            	isMobile: config.device.isMobile,
            })),
            buttons: [{
                text: _t("Close"),
                classes: 'btn-default',
                close: true,
            }],
            technical: true,
        });
		this._super.apply(this, arguments);
    },
	willStart: function () {
        var self = this;
        return this._super.apply(this, arguments).then(function () {
        	self.$modal.find('.modal-dialog').addClass("muk_share_dialog");
        	self.$modal.find('.modal-title').prepend($('<i class="fa fa-share-alt"/>'));
        	self.$content.find('.muk_share_buttons_whatsapp').attr("href",
            		'whatsapp://send?text=' + encodeURIComponent(self.url));
            self.$content.find('.muk_share_buttons_email').attr("href",
            		'mailto:?subject=' + _t("Share") + '&body=' + encodeURIComponent(self.url));
        	self.$content.find('.muk_share_buttons_chat').click(function(e) {
        	    e.preventDefault();
        	    e.stopPropagation();
        	    self.newMessage(self.url);
            });
        	self.$content.find('.muk_share_buttons_copy').click(function(e) {
        	    e.preventDefault();
        	    e.stopPropagation();
            	self.copyClipboard(self.url);
            });
            self.$content.find('.muk_share_chat_send').click(function(e) {
        	    e.preventDefault();
        	    e.stopPropagation();
        	    self.newMessage(self.url);
            });
            self.update();
        });
    },
    update: function() {
    	this.updateUser();
    	this.updateChannels();
    },
    updateUser: function() {
    	var self = this;
    	self.$content.find('#user').empty();
    	self._rpc({
            fields: [
            	'name', 'login', 'image',
            	'partner_id', 'active', 'share'
            ],
            domain: [['active', '=', true]],
            model: 'res.users',
            method: 'search_read',
            context: session.user_context,
        }).then(function(result) {
        	var users = _.filter(result, function (user) {
        		return !user.share && user.id !== session.uid;
            });
        	self.$content.find('#user').append($(QWeb.render('muk_web_share.ShareUsers', {
            	widget: self,
            	users: users,
            })));
        	self.$content.find('.muk_share_chat_user').click(function(e) {
        		var $partner_channel = $.Deferred();
        		var partner_id = $(e.currentTarget).data('partner_id');
        		var channel = chat_manager.get_dm_from_partner_id(partner_id);
        		if(!channel) {
        			chat_manager.create_channel(partner_id, "dm").then(function() {
        				$partner_channel.resolve(chat_manager.get_dm_from_partner_id(partner_id));   
        			});
        		} else {
        			$partner_channel.resolve(channel);
        		}
        		$.when($partner_channel).then(function(partner_channel) {
        			self.postMessage(self.formatUrl(self.url), partner_channel.id);
        		});
        		
        	});
        });
    },
    updateChannels: function() {
    	var self = this;
    	self.$content.find('#channel').empty();
    	self.$content.find('#chat').empty();
    	var channels = _.filter(chat_manager.get_channels(), function (channel) {
        	return !channel.is_chat && channel.type !== 'static';
        });
        chat_manager.get_channels_preview(channels).then(function(channels) {
        	self.$content.find('#channel').append( $(QWeb.render('muk_web_share.ShareChannels', {
            	widget: self,
            	channels: channels,
            })));
        	self.$content.find('.muk_share_chat_channel').click(function(e) {
        		var channel_id = $(e.currentTarget).data('channel_id');
        		self.postMessage(self.formatUrl(self.url), channel_id);
        	});
    	});
        var chats = _.filter(chat_manager.get_channels(), function (channel) {
        	return channel.is_chat && channel.type !== 'static';
        });
        chat_manager.get_channels_preview(chats).then(function(channels) {
        	self.$content.find('#chat').append( $(QWeb.render('muk_web_share.ShareChatItems', {
            	widget: self,
            	channels: channels,
            })));
        	self.$content.find('.muk_share_chat_chat').click(function(e) {
        		var channel_id = $(e.currentTarget).data('channel_id');
        		self.postMessage(self.formatUrl(self.url), channel_id);
        	});
    	});
    },
    postMessage: function(message, channel_id) {
    	chat_manager.post_message({
			content: message,
		}, {
			channel_id: channel_id,
		});
		chat_manager.open_channel(chat_manager.get_channel(channel_id));
		this.updateChannels();
    },
    newMessage: function(message) {
    	this.copyClipboard(message);
    	this.openChat();
    	this.close();
    },
    openChat: function() {
        chat_manager.bus.trigger('open_chat');
    },
    copyClipboard: function(text) {
    	var $temp = $("<input>");
	    $("body").append($temp);
	    $temp.val(text).select();
	    document.execCommand("copy");
	    $temp.remove();
	    this.do_notify(_t("Link has been copied to clipboard!"));
    },
    formatUrl: function(url) {
    	if(this.__parentedParent && this.__parentedParent.state) {
    		var data = this.__parentedParent.state.data;
    		return $('<div>').append($('<a>',{
	    	    text: data.name || url,
	    	    title: _t('Odoo Link'),
	    	    href: url,
	    	})).html();
    	} 
    	return $('<div>').append($('<a>',{
		    text: url,
		    title: _t('Odoo Link'),
		    href: url,
		})).html();
    }
});

ShareDialog.share = function (owner) {
    return new ShareDialog(owner, _.extend({
        url:  window.location.href,
    })).open();
};

return ShareDialog;

});