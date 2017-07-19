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

odoo.define('muk_preview.PreviewGenerator', function (require) {
"use strict";

var core = require('web.core');

var PreviewHandler = require('muk_preview.PreviewHandler');

var QWeb = core.qweb;
var _t = core._t;

var PDFHandler = PreviewHandler.extend({
	checkExtension: function(extension) {
		return ['.pdf', 'pdf'].includes(extension);
    },
    checkType: function(mimetype) {
		return ['application/pdf'].includes(mimetype);
    },
    createHtml: function(url, mimetype, extension, title) {
    	var result = $.Deferred();	
    	var viewerUrlTempalte = _.template('/muk_web_preview/static/lib/ViewerJS/index.html#<%= url %>');
		result.resolve($(QWeb.render('ViewerJSFrame', {url: viewerUrlTempalte({url})})));
		return $.when(result);
	},    
});

var OpenOfficeHandler = PreviewHandler.extend({
	checkExtension: function(extension) {
		return ['.odt', '.odp', '.ods', '.fodt', '.ott', '.fodp', '.otp', '.fods', '.ots',
			'odt', 'odp', 'ods', 'fodt', 'ott', 'fodp', 'otp', 'fods', 'ots'].includes(extension);
    },
    checkType: function(mimetype) {
		return ['application/vnd.oasis.opendocument.text', 'application/vnd.oasis.opendocument.presentation',
				'application/vnd.oasis.opendocument.spreadsheet'].includes(mimetype);
    },
    createHtml: function(url, mimetype, extension, title) {
    	var result = $.Deferred();	
    	var viewerUrlTempalte = _.template('/muk_web_preview/static/lib/ViewerJS/index.html#<%= url %>');
		result.resolve($(QWeb.render('ViewerJSFrame', {url: viewerUrlTempalte({url})})));
		return $.when(result);
    },
});

var PreviewGenerator = core.Class.extend({
	handler: {},
	init: function(widget, additional_handler) {
		this.widget = widget;
		this.handler = _.extend(this.handler, {
			"PDFHandler": new PDFHandler(widget),
			"OpenOfficeHandler": new OpenOfficeHandler(widget)
		});
		this.handler = _.extend(this.handler, additional_handler);
	},
	createPreview: function(url, mimetype, extension, title) {
		var matchedHandler = false;
		_.each(this.handler, function(handler, key, handler_list) {
			if(handler.checkType(mimetype) || handler.checkExtension(extension)) {
				matchedHandler = handler;
			}
		});
		if(matchedHandler) {
			return matchedHandler.createHtml(url, mimetype, extension, title);
		} else {
			return $.when($.Deferred().resolve($(QWeb.render('UnsupportedContent',
					{url: url, mimetype: mimetype || _t('Unknown'), extension: extension || _t('Unknown'), title: title || _t('Unknown')}))));
		}
	}
});

PreviewGenerator.createPreview = function(widget, url, mimetype, extension, title) {
    return new PreviewGenerator(widget, {}).createPreview(url, mimetype, extension, title);
};

return PreviewGenerator;

});