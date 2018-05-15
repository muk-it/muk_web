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

openerp.med_preview_PreviewGenerator= function(instance) {






var _t = instance.web._t,
   _lt = instance.web._lt;
var QWeb = instance.web.qweb;
openerp.med_preview_PreviewHandler(instance);

instance.web.PreviewGenerator = instance.web.Class.extend({
	handler: {},
	init: function(widget, additional_handler) {
		
		this.widget = widget;
		this.handler = _.extend(this.handler, {
			"PDFHandler": new instance.web.PDFHandler(widget),
			"OpenOfficeHandler": new instance.web.OpenOfficeHandler(widget),
		});
		this.handler = _.extend(this.handler, additional_handler);
		
	},
	createPreview: function(url, mimetype, extension, title) {
				var matchedHandler = false;
		_.each(this.handler, function(handler, key, handler_list) {
			if(handler.checkExtension(extension) || handler.checkType(mimetype)) {
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


if (typeof openerp.muk_preview_image_PreviewHandler !== 'undefined') {
	openerp.muk_preview_image_PreviewHandler(instance);
		instance.web.PreviewGenerator.include({
			init: function(widget, additional_handler) {
				this._super(widget, additional_handler);
				this.handler = _.extend(this.handler, {
					"ImageHandler": new instance.web.ImageHandler(widget),
				});
			},
		});

}

if (typeof openerp.muk_preview_msoffice_PreviewHandler !== 'undefined') {
	openerp.muk_preview_msoffice_PreviewHandler(instance);
	instance.web.PreviewGenerator.include({
		init: function(widget, additional_handler) {
			this._super(widget, additional_handler);
			this.handler = _.extend(this.handler, {
				"ExcelHandler": new instance.web.ExcelHandler(widget),
				"WordHandler": new instance.web.WordHandler(widget),
				"PowerPointHandler": new instance.web.PowerPointHandler(widget),
			});
		},
	}); 
}
if (typeof openerp.muk_preview_csv_PreviewHandler !== 'undefined') {
	openerp.muk_preview_csv_PreviewHandler(instance);
	instance.web.PreviewGenerator.include({
		init: function(widget, additional_handler) {
			this._super(widget, additional_handler);
			this.handler = _.extend(this.handler, {
				"CSVHandler": new instance.web.CSVHandler(widget),
			});
		},
	});

}
if (typeof openerp.muk_preview_audio_PreviewHandler !== 'undefined') {
	openerp.muk_preview_audio_PreviewHandler(instance);
	instance.web.PreviewGenerator.include({
		init: function(widget, additional_handler) {
			this._super(widget, additional_handler);
			this.handler = _.extend(this.handler, {
				"AudioHandler": new instance.web.AudioHandler(widget),
			});
		},
	});
}

if (typeof openerp.muk_preview_text_PreviewHandler !== 'undefined') {
	openerp.muk_preview_text_PreviewHandler(instance);
	instance.web.PreviewGenerator.include({
		textHandler: {},
		init: function(widget, additional_handler) {
			this._super(widget, additional_handler);
			this.handler = _.extend(this.handler, {
				"TextHandler": new instance.web.TextHandler(widget)
			});
		},
	});
}

if (typeof openerp.muk_preview_video_PreviewHandler !== 'undefined') {
	openerp.muk_preview_video_PreviewHandler(instance);
	instance.web.PreviewGenerator.include({
		init: function(widget, additional_handler) {
			this._super(widget, additional_handler);
			this.handler = _.extend(this.handler, {
				"VideoHandler": new instance.web.VideoHandler (widget),
			});
		},
	});
}
openerp.import(instance);

};