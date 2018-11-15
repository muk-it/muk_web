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

odoo.define('muk_preview.PreviewDialog', function (require) {
"use strict";

var core = require('web.core');
var framework = require('web.framework');
var Widget = require('web.Widget');

var PreviewHandler = require('muk_preview.PreviewHandler');
var PreviewGenerator = require('muk_preview.PreviewGenerator');

var QWeb = core.qweb;
var _t = core._t;

var PreviewDialog = Widget.extend({
	init: function(parent, generator, url, mimetype, extension, title) {
		this._super(parent);
        this._opened = $.Deferred();
        this.title = title || _t('Preview');
        this.url = url;
        this.mimetype = mimetype;
        this.extension = extension;
		this.$modal = $(QWeb.render('PreviewDialog', {title: this.title, url: this.url}));
        this.$modal.on('hidden.bs.modal', _.bind(this.destroy, this));
        this.$modal.find('.preview-maximize').on('click', _.bind(this.maximize, this));
        this.$modal.find('.preview-minimize').on('click', _.bind(this.minimize, this));
        this.$modal.find('.preview-print').on('click', _.bind(this.print, this));
		this.generator = generator;
		this.generator.widget = this;
	},
    renderElement: function() {
        this._super();
        var self = this;
        this.generator.createPreview(this.url, this.mimetype, this.extension, this.title).then(function($content) {
            self.setElement($("<div/>").addClass("modal-body preview-body").append($content));
            self.$modal.find('.preview-print').toggle($content.hasClass('printable'));
        });
	},
    open: function() {
        var self = this;
        $('.tooltip').remove();
        this.$modal.draggable({
            handle: '.modal-header',
            helper: false
        });        
        this.replace(this.$modal.find(".modal-body")).then(function() {
            self.$modal.modal('show');
            self._opened.resolve();
        });
        return self;
    },
    maximize: function(e) {
    	this.$modal.find('.preview-maximize').toggle();
    	this.$modal.find('.preview-minimize').toggle();
    	this.$modal.addClass("modal-fullscreen");
    	
    },
    minimize: function(e) {
    	this.$modal.find('.preview-maximize').toggle();
    	this.$modal.find('.preview-minimize').toggle();
    	this.$modal .removeClass("modal-fullscreen");
    },
    print: function(e) {
    	var $printable = this.$modal.find('.printable');
    	framework.blockUI();
    	setTimeout(function() {
    		framework.unblockUI();
    	}, ($printable.data('print-delay') || 333) * 0.95);
    	if(this.$modal.find('.print-content').length) {
    		this.$modal.find('.print-content').printThis({
    			importCSS: true,
    			importStyle: true,
    			printDelay: $printable.data('print-delay') || 333,
    			loadCSS: $printable.data('print-css') || "",
    		});
    	} else {
    		this.$modal.find('.printable').printThis({
    			importCSS: true,
    			importStyle: true,
    			printDelay: $printable.data('print-delay') || 333,
    			loadCSS: $printable.data('print-css') || "",
    		});
    	}
    },
    close: function() {
        var draggable = this.$modal.draggable( "instance" );
        if (draggable) {
            this.$modal.draggable("destroy");
        }	    
        this.$modal.modal('hide');
    },
    destroy: function(reason) {
        $('.tooltip').remove();
        if(this.isDestroyed()) {
            return;
        }
        this.trigger("closed", reason);
        this._super();
        this.$modal.modal('hide');
        this.$modal.remove();
        setTimeout(function () {
            var modals = $('body > .modal').filter(':visible');
            if(modals.length) {
                modals.last().focus();
                $('body').addClass('modal-open');
            }
        }, 0);
    }
});

PreviewDialog.createPreviewDialog = function (parent, url, mimetype, extension, title) {
    return new PreviewDialog(parent, new PreviewGenerator(parent, {}), url, mimetype, extension, title).open();
};

return PreviewDialog;

});
