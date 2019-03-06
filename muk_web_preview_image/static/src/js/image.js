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

odoo.define('muk_preview_markdown.PreviewContentImage', function (require) {
"use strict";

var core = require('web.core');
var ajax = require('web.ajax');
var utils = require('web.utils');
var session = require('web.session');

var registry = require('muk_preview.registry');

var AbstractPreviewContent = require('muk_preview.AbstractPreviewContent');

var QWeb = core.qweb;
var _t = core._t;

var PreviewContentImage = AbstractPreviewContent.extend({
	template: "muk_preview.PreviewContentImage",    
	cssLibs: [
		'/muk_web_preview_image/static/lib/viewer/viewer.css',
    ],
    jsLibs: [
        '/muk_web_preview_image/static/lib/viewer/viewer.js',
        '/muk_web_preview_image/static/lib/viewer/jquery-viewer.js',
    ],
    renderPreviewContent: function() {
    	this.$('img').viewer({
			backdrop: false,
			button: false,
			navbar: false,
			title: false,
			inline: true,
			toolbar: {
			    zoomIn: 1,
			    zoomOut: 1,
			    oneToOne: 1,
			    reset: 1,
			    prev: 0,
			    next: 0,
			    play: {
			      show: 1,
			      size: 'large',
			    },
			    rotateLeft: 1,
			    rotateRight: 1,
			    flipHorizontal: 1,
			    flipVertical: 1,
			},
		});
    },
    downloadable: true,
    printable: true,
});

_.each([
	'cod', 'ras', 'fif', 'gif', 'ief', 'jpeg', 'jpg', 'jpe', 'png', 'tiff',
    'tif', 'mcf', 'wbmp', 'fh4', 'fh5', 'fhc', 'ico', 'pnm', 'pbm', 'pgm',
    'ppm', 'rgb', 'xwd', 'xbm', 'xpm'
], function(extension) {
	registry.add(extension, PreviewContentImage);
	registry.add("." + extension, PreviewContentImage);
});
_.each([
	'image/cis-cod', 'image/cmu-raster', 'image/fif', 'image/gif', 'image/ief',
	'image/png', 'image/tiff', 'image/vasa', 'image/vnd.wap.wbmp', 'image/x-freehand',
	'image/x-portable-anymap', 'image/x-portable-bitmap', 'image/x-portable-graymap',
	'image/x-portable-pixmap', 'image/x-rgb', 'image/x-windowdump', 'image/x-xbitmap', 
	'image/jpeg', 'image/x-icon', 'image/x-xpixmap'
], function(mimetype) {
	registry.add(mimetype, PreviewContentImage);
});

return PreviewContentImage;

});
