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

odoo.define('muk_preview_audio.PreviewGenerator', function (require) {
"use strict";

var core = require('web.core');

var PreviewHandler = require('muk_preview.PreviewHandler');
var PreviewGenerator = require('muk_preview.PreviewGenerator');

var QWeb = core.qweb;
var _t = core._t;

var AudioHandler = PreviewHandler.extend({
	mimetypeMap: {
		'.wav': 'audio/wav',
		'.ogg': 'audio/ogg',
		'.mp3': 'audio/mpeg',
		'wav': 'audio/wav',
		'ogg': 'audio/ogg',
		'mp3': 'audio/mpeg',
	},
	checkExtension: function(extension) {
		return ['.wav', '.ogg', '.mp3', 'wav', 'ogg', 'mp3'].includes(extension);
    },
    checkType: function(mimetype) {
		return ['audio/wav', '	audio/ogg', 'audio/mpeg'].includes(mimetype);
    },
    createHtml: function(url, mimetype, extension, title) {
    	var result = $.Deferred();
    	if(!mimetype || mimetype === 'application/octet-stream') {
    		mimetype = this.mimetypeMap[extension];
    	}
		var $content = $(QWeb.render('AudioHTMLContent', {url: url, type: mimetype, title: title}));
		var visualizer = new Visualizer($content.find('audio'), $content.find('.visualizer'), $content.find('canvas'));
        result.resolve($content);
		return $.when(result);
    },
});

PreviewGenerator.include({
	init: function(widget, additional_handler) {
		this._super(widget, additional_handler);
		this.handler = _.extend(this.handler, {
			"AudioHandler": new AudioHandler(widget),
		});
	},
});

});