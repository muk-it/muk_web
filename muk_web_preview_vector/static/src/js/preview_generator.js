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

odoo.define('muk_preview_vector.PreviewGenerator', function (require) {
"use strict";

var core = require('web.core');

var PreviewHandler = require('muk_preview.PreviewHandler');
var PreviewGenerator = require('muk_preview.PreviewGenerator');

var QWeb = core.qweb;
var _t = core._t;

var VectorHandler = PreviewHandler.extend({
	checkExtension: function(extension) {
		return ['.svg', 'svg'].includes(extension);
    },
    checkType: function(mimetype) {
		return ['image/svg+xml'].includes(mimetype);
    },
    createHtml: function(url, mimetype, extension, title) {
    	var result = $.Deferred();
		var $content = $(QWeb.render('VectorHTMLContent', {url: url}));
		$.ajax(url, {
		    dataType: "text",
		    success: function(vector) {
		    	$content.find('.vector-loader').hide();
	        	$content.find('.vector-container').show();
		    	$content.find('.vector-container').html(vector);
		    	svgPanZoom('svg', {
		    	    zoomEnabled: true,
		    	    controlIconsEnabled: true,
		    	    fit: true,
		    	    center: true,
		    	    minZoom: 0.1
		    	  });
		    },
		    error: function(request, status, error) {
		    	console.error(request.responseText);
		    }
		});
        result.resolve($content);
		return $.when(result);
    },
});

PreviewGenerator.include({
	init: function(widget, additional_handler) {
		this._super(widget, additional_handler);
		this.handler = _.extend(this.handler, {
			"VectorHandler": new VectorHandler(widget),
		});
	},
});

});