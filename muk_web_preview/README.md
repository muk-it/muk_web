# MuK Preview

MuK Preview enables support to preview binary files directly in Odoo. It adds
a button to the binary field, which opens a file preview dialog. The preview can be
easily extended by adding new Handlers to the Preview Generator.

## Extend MuK Preview

To extend the preview a new "PreviewHandler" has to be created and subsequently added to the "PreviewGenerator". 
In the following steps show the implementation of the image preview.

### PreviewHandler

```javascript
odoo.define('muk_preview_image.PreviewHandler', function (require) {
"use strict";

var core = require('web.core');

var PreviewHandler = require('muk_preview.PreviewHandler');

var QWeb = core.qweb;
var _t = core._t;

var ImageHandler = PreviewHandler.BaseHandler.extend({
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
		var $content = $(QWeb.render('ImageHTMLContent', {url: url, alt: title}));
		$content.find('img').click(function (e) {
			ImageViewer().show(this.src, this.src);
	    });
        result.resolve($content);
		return $.when(result);
    },
});

return {
	ImageHandler: ImageHandler,
}

});
```

### PreviewGenerator

```javascript
odoo.define('muk_preview_image.PreviewGenerator', function (require) {
"use strict";

var core = require('web.core');

var PreviewGenerator = require('muk_preview.PreviewGenerator');
var PreviewHandler = require('muk_preview_image.PreviewHandler');

var QWeb = core.qweb;
var _t = core._t;

PreviewGenerator.include({
	init: function(widget, additional_handler) {
		this._super(widget, additional_handler);
		this.handler = _.extend(this.handler, {
			"ImageHandler": new PreviewHandler.ImageHandler(widget),
		});
	},
});

});
```