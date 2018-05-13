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

odoo.define('muk_preview_vector.PreviewHandler', function (require) {
"use strict";

var ajax = require('web.ajax');
var core = require('web.core');

var PreviewHandler = require('muk_preview.PreviewHandler');

var QWeb = core.qweb;
var _t = core._t;

var VectorHandler = PreviewHandler.BaseHandler.extend({
	cssLibs: [
    ],
    jsLibs: [
        '/muk_web_utils/static/lib/svg-pan-zoom/svg-pan-zoom.js',
    ],
	checkExtension: function(extension) {
		return ['.svg', 'svg'].includes(extension);
    },
    checkType: function(mimetype) {
		return ['image/svg+xml'].includes(mimetype);
    },
    createHtml: function(url, mimetype, extension, title) {
    	var result = $.Deferred();
		var $content = $(QWeb.render('VectorHTMLContent', {url: url}));
		ajax.loadLibs(this).then(function() {
			$.ajax(url, {
			    dataType: "text",
			    success: function(vector) {
			    	$content.find('.vector-loader').hide();
		        	$content.find('.vector-container').show();
			    	$content.find('.vector-content').html(vector);
			    	var svgPanZoom = $("svg").svgPanZoom({
			    	    events: {
			    	        mouseWheel: true,
			    	        doubleClick: true,
			    	        drag: true,
			    	        dragCursor: "move",
			    	    },
			    	    animationTime: 300,
			    	    zoomFactor: 0.1,
			    	    maxZoom: 5, 
			    	    panFactor: 100, 
			    	});
			    	$content.find('.zoom-plus').click(function(){
			    		svgPanZoom.zoomIn();
			    	});
			    	$content.find('.zoom-minus').click(function(){
			    		svgPanZoom.zoomOut();
			    	});
			    	$content.find('.zoom-reset').click(function(){
			    		svgPanZoom.reset();
			    	});
			    },
			    error: function(request, status, error) {
			    	console.error(request.responseText);
			    }
			});
		});
        result.resolve($content);
		return result;
    },
});

return {
	VectorHandler: VectorHandler,
};

});