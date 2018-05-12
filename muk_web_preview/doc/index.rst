===========
MuK Preview
===========

MuK Preview enables support to preview binary files directly in Odoo. It adds a
button to the binary field, which opens a file preview dialog. The preview can
be easily extended by adding new Handlers to the Preview Generator.

Installation
============

To install this module, you need to:

Download the module and add it to your Odoo addons folder. Afterward, log on to
your Odoo server and go to the Apps menu. Trigger the debug modus and update the
list by clicking on the "Update Apps List" link. Now install the module by
clicking on the install button.

Configuration
=============

No additional configuration is needed to use this module.

Usage
=============

To each Binary Field Widget a button is added, which opens the Preview Dialog.

Framework
=============

To extend the preview a new "PreviewHandler" has to be created and subsequently added to the "PreviewGenerator". 
The following steps show the implementation of the image preview.

PreviewHandler
--------------

.. code-block:: javascript

    odoo.define('muk_preview_image.PreviewHandler', function (require) {
	"use strict";
	
	var core = require('web.core');
	
	var PreviewHandler = require('muk_preview.PreviewHandler');
	
	var QWeb = core.qweb;
	var _t = core._t;
	
	var ImageHandler = PreviewHandler.BaseHandler.extend({
		checkExtension: function(extension) {
			return ['.cod', '.ras', '.fif', '.gif', ...].includes(extension);
	    },
	    checkType: function(mimetype) {
			return ['image/cis-cod', 'image/fif', ...].includes(mimetype);
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

PreviewGenerator
----------------

.. code-block:: javascript
	
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
	
Credits
=======

Contributors
------------

* Mathias Markl <mathias.markl@mukit.at>

Author & Maintainer
-------------------

This module is maintained by the `MuK IT GmbH <https://www.mukit.at/>`_.

MuK IT is an Austrian company specialized in customizing and extending Odoo.
We develop custom solutions for your individual needs to help you focus on
your strength and expertise to grow your business.

If you want to get in touch please contact us via mail
(sale@mukit.at) or visit our website (https://mukit.at).
