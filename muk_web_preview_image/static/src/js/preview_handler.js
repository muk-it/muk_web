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

odoo.define('muk_preview_image.PreviewHandler', function (require) {
"use strict";

var ajax = require('web.ajax');
var core = require('web.core');

var PreviewHandler = require('muk_preview.PreviewHandler');

var QWeb = core.qweb;
var _t = core._t;

var ImageHandler = PreviewHandler.BaseHandler.extend({
	cssLibs: [
		'/muk_web_utils/static/lib/imageviewer/imageviewer.css',
    ],
    jsLibs: [
        '/muk_web_utils/static/lib/imageviewer/imageviewer.js',
    ],
	checkExtension: function(extension) {
		return ['.cod', '.ras', '.fif', '.gif', '.ief', '.jpeg', '.jpg', '.jpe', '.png', '.tiff',
	        '.tif', '.mcf', '.wbmp', '.fh4', '.fh5', '.fhc', '.ico', '.pnm', '.pbm', '.pgm',
	        '.ppm', '.rgb', '.xwd', '.xbm', '.xpm', 'cod', 'ras', 'fif', 'gif', 'ief', 'jpeg',
	        'jpg', 'jpe', 'png', 'tiff', '.tif', 'mcf', 'wbmp', 'fh4', 'fh5', 'fhc', 'ico',
	        'pnm', 'pbm', 'pgm', '.ppm', 'rgb', 'xwd', 'xbm', 'xpm'].includes(extension);
    },
    checkType: function(mimetype) {
		return ['image/cis-cod', 'image/cmu-raster', 'image/fif', 'image/gif', 'image/ief', 'image/jpeg',
			'image/png', 'image/tiff', 'image/vasa', 'image/vnd.wap.wbmp', 'image/x-freehand', 'image/x-icon',
			'image/x-portable-anymap', 'image/x-portable-bitmap', 'image/x-portable-graymap', 'image/x-portable-pixmap',
			'image/x-rgb', 'image/x-windowdump', 'image/x-xbitmap', 'image/x-xpixmap'].includes(mimetype);
    },
    createHtml: function(url, mimetype, extension, title) {
    	var result = $.Deferred();
    	ajax.loadLibs(this).then(function() {
    		var $content = $(QWeb.render('ImageHTMLContent', {url: url, alt: title}));
    		$content.find('img').click(function (e) {
    			ImageViewer().show(this.src, this.src);
    	    });
            result.resolve($content);
    	});
    	return result;
    },
});

return {
	ImageHandler: ImageHandler,
};

});