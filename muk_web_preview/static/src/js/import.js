openerp.import= function(instance) {
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

}