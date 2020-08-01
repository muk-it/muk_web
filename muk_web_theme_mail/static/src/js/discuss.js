/**********************************************************************************
*
*    Copyright (c) 2017-2019 MuK IT GmbH.
*
*    This file is part of MuK Backend Theme Mail 
*    (see https://mukit.at).
*
*    This program is free software: you can redistribute it and/or modify
*    it under the terms of the GNU Lesser General Public License as published by
*    the Free Software Foundation, either version 3 of the License, or
*    (at your option) any later version.
*
*    This program is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU Lesser General Public License for more details.
*
*    You should have received a copy of the GNU Lesser General Public License
*    along with this program. If not, see <http://www.gnu.org/licenses/>.
*
**********************************************************************************/

odoo.define('muk_web_theme_mail.Discuss', function (require) {
"use strict";

const config = require("web.config");
const core = require("web.core");

const Discuss = require("mail.Discuss");

const QWeb = core.qweb;

if (!config.device.isMobile) {
    return;
}

Discuss.include({
    contentTemplate: "mail.discuss_mobile",
    events: Object.assign({}, Discuss.prototype.events, {
        "click .o_mail_mobile_tab": "_onClickMobileTab",
        "click .o_mailbox_inbox_item": "_onClickMobileMailboxItem",
        "click .o_mail_preview": "_onClickMobileMailPreview",
    }),
    init: function() {
        this._super.apply(this, arguments);
        this._currentState = this._defaultThreadID;
    },
    start: function() {
        this._$mainContent = this.$(".o_mail_discuss_content");
        return this._super
            .apply(this, arguments)
            .then(this._updateControlPanel.bind(this));
    },
    on_attach_callback: function() {
        if (this._thread && this._isInInboxTab()) {
            this._threadWidget.scrollToPosition(
                this._threadsScrolltop[this._thread.getID()]
            );
        }
    },
    on_detach_callback: function() {
        if (this._isInInboxTab()) {
            this._threadsScrolltop[
                this._thread.getID()
            ] = this._threadWidget.getScrolltop();
        }
    },
    _isInInboxTab: function() {
        return _.contains(["mailbox_inbox", "mailbox_starred"], this._currentState);
    },
    _renderButtons: function() {
        this._super.apply(this, arguments);
        _.each(["dm_chat", "multi_user_channel"], type => {
            const selector = ".o_mail_discuss_button_" + type;
            this.$buttons.on("click", selector, this._onAddThread.bind(this));
        });
    },
    _restoreThreadState: function() {
        if (this._isInInboxTab()) {
            this._super.apply(this, arguments);
        }
    },
    _selectMessage: function() {
        this._super.apply(this, arguments);
        this.$(".o_mail_mobile_tabs").addClass("o_hidden");
    },
    _setThread: function(threadID) {
        const thread = this.call("mail_service", "getThread", threadID);
        this._thread = thread;
        if (thread.getType() !== "mailbox") {
            this.call("mail_service", "openThreadWindow", threadID);
            return Promise.resolve();
        }
        return this._super.apply(this, arguments);
    },
    _storeThreadState: function() {
        if (this._thread && this._isInInboxTab()) {
            this._super.apply(this, arguments);
        }
    },
    _unselectMessage: function() {
        this._super.apply(this, arguments);
        this.$(".o_mail_mobile_tabs").removeClass("o_hidden");
    },
    _updateThreads: function() {
        return this._updateContent(this._currentState);
    },
    _updateContent: function(type) {
        const inMailbox = type === "mailbox_inbox" || type === "mailbox_starred";
        if (!inMailbox && this._isInInboxTab()) {
            this._storeThreadState();
        }
        const previouslyInInbox = this._isInInboxTab();
        this._currentState = type;
        let def = false;
        if (inMailbox) {
            def = this._fetchAndRenderThread();
        } else {
            const allChannels = this.call("mail_service", "getChannels");
            const channels = _.filter(allChannels, function(channel) {
                return channel.getType() === type;
            });
            def = this.call("mail_service", "getChannelPreviews", channels);
        }
        return def.then(previews => {
            if (inMailbox) {
                if (!previouslyInInbox) {
                    this.$(".o_mail_discuss_tab_pane").remove();
                    this._$mainContent.append(this._threadWidget.$el);
                    this._$mainContent.append(this._extendedComposer.$el);
                }
                this._restoreThreadState();
            } else {
                this._threadWidget.$el.detach();
                this._extendedComposer.$el.detach();
                const $content = $(
                    QWeb.render("mail.discuss.MobileTabPane", {
                        previews: previews,
                        type: type,
                    })
                );
                this._prepareAddThreadInput(
                    $content.find(".o_mail_add_thread input"),
                    type
                );
                this._$mainContent.html($content);
            }
            this.$buttons
                .find("button")
                .removeClass("d-block")
                .addClass("d-none");
            this.$buttons
                .find(".o_mail_discuss_button_" + type)
                .removeClass("d-none")
                .addClass("d-block");
            this.$buttons
                .find(".o_mail_discuss_button_mark_all_read")
                .toggleClass("d-none", type !== "mailbox_inbox")
                .toggleClass("d-block", type === "mailbox_inbox");
            this.$buttons
                .find(".o_mail_discuss_button_unstar_all")
                .toggleClass("d-none", type !== "mailbox_starred")
                .toggleClass("d-block", type === "mailbox_starred");
            if (inMailbox) {
                this.$(".o_mail_discuss_mobile_mailboxes_buttons").removeClass(
                    "o_hidden"
                );
                this.$(".o_mailbox_inbox_item")
                    .removeClass("btn-primary")
                    .addClass("btn-secondary");
                this.$(".o_mailbox_inbox_item[data-type=" + type + "]")
                    .removeClass("btn-secondary")
                    .addClass("btn-primary");
            } else {
                this.$(".o_mail_discuss_mobile_mailboxes_buttons").addClass(
                    "o_hidden"
                );
            }
            this.$(".o_mail_mobile_tab").removeClass("active");
            const type_n = type === "mailbox_starred" ? "mailbox_inbox" : type;
            this.$(".o_mail_mobile_tab[data-type=" + type_n + "]").addClass(
                "active"
            );
        });
    },
    _onAddThread: function() {
        this.$(".o_mail_add_thread")
            .show()
            .find("input")
            .focus();
    },
    _onClickMobileMailboxItem: function(ev) {
        const mailboxID = $(ev.currentTarget).data("type");
        this._setThread(mailboxID);
        this._updateContent(this._thread.getID());
    },
    _onClickMobileTab: function(ev) {
        const type = $(ev.currentTarget).data("type");
        if (type === "mailbox") {
            const inbox = this.call("mail_service", "getMailbox", "inbox");
            this._setThread(inbox);
        }
        this._updateContent(type);
    },
    _onClickMobileMailPreview: function(ev) {
        const threadID = $(ev.currentTarget).data("preview-id");
        this.call("mail_service", "openThreadWindow", threadID);
    },
});

});