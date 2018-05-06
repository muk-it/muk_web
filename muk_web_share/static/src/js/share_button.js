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

odoo.define('muk_web_share.button', function(require) {
"use strict";

var core = require('web.core');

var FormRenderer = require('web.FormRenderer');
var ShareDialog = require('muk_web_share.dialog');

var QWeb = core.qweb;
var _t = core._t;

FormRenderer.include({
	_renderShareButton: function() {
		var $sharebutton = $('<div>');
		$sharebutton.addClass("muk_share_button");
		$sharebutton.append($('<button>').addClass("btn btn-primary")
				.append($('<i class="fa fa-share-alt"/>')));
		$sharebutton.on('click', _.bind(this._clickShareButton, this));
		this.$el.find('.o_form_sheet').append($sharebutton);
	},
	_clickShareButton: function() {
		new ShareDialog.share(this);
	},
	_renderView: function() {
		var self = this;
		var res = this._super.apply(this, arguments);
		res.then(function() {
			if(self.mode === 'readonly') {
				self._renderShareButton();
			}
		});
		return res;
	},
});

});