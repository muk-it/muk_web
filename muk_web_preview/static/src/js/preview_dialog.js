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

openerp.med_preview_PreviewDialog= function(instance) {

var Widget = instance.web.Widget;
var opened_modal = [];



var _t = instance.web._t,
   _lt = instance.web._lt;
var QWeb = instance.web.qweb;

instance.web.PreviewDialog  = instance.web.Widget.extend({
    dialog_title: "",

    init: function(parent, generator, url, mimetype, extension, title) {
        var self = this;
   
        this._super(parent);
        this.title = title || _t('Preview');
        this.url = url;
        this.mimetype = mimetype;
        this.extension = extension;
        this.generator = generator;

        this.generator.widget = this;
        this.$dialog_box = $(QWeb.render('PreviewDialog', {title: this.title, url: this.url})).appendTo("body");

        this.$dialog_box.on('hidden.bs.modal', this, function() {
            self.close();
        });
        this.$dialog_box.find('.preview-maximize').on('click', _.bind(this.maximize, this));
        this.$dialog_box.find('.preview-minimize').on('click', _.bind(this.minimize, this));
        this.$dialog_box.find('.preview-print').on('click', _.bind(this.print, this));
       
    },


    maximize: function(e) {
        this.$dialog_box.find('.preview-maximize').toggle();
        this.$dialog_box.find('.preview-minimize').toggle();
        this.$dialog_box .addClass("modal-fullscreen");
        
    },
    minimize: function(e) {
        this.$dialog_box.find('.preview-maximize').toggle();
        this.$dialog_box.find('.preview-minimize').toggle();
        this.$dialog_box .removeClass("modal-fullscreen");
    },
    print: function(e) {
        var $printable = this.$dialog_box.find('.printable');
        instance.web.blockUI();
        setTimeout(function() {
            instance.web.unblockUI();
        }, ($printable.data('print-delay') || 333) * 0.95);
        if(this.$dialog_box.find('.print-content').length) {
            this.$dialog_box.find('.print-content').printThis({
                importCSS: true,
                importStyle: true,
                printDelay: $printable.data('print-delay') || 333,
                loadCSS: $printable.data('print-css') || "",
            });
        } else {
            this.$dialog_box.find('.printable').printThis({
                importCSS: true,
                importStyle: true,
                printDelay: $printable.data('print-delay') || 333,
                loadCSS: $printable.data('print-css') || "",
            });
        }
    },
    renderElement: function() {

        this._super();
        var self = this;
        this.generator.createPreview(this.url, this.mimetype, this.extension, this.title).then(function($content) {
            self.setElement($("<div/>").addClass("modal-body preview-body").append($content));
            self.$dialog_box.find('.preview-print').toggle($content.hasClass('printable'));
        });
    },

    open: function() {
        if (!this.dialog_inited) {
            this.init_dialog();
        }
        $('.tooltip').remove(); 
        opened_modal.push(this.$dialog_box);
        return this;
    },
    
    init_dialog: function() {
        var self = this;
        var options = _.extend({}, this.dialog_options);
        options.title = options.title || this.dialog_title;
        if (options.buttons) {
            this._add_buttons(options.buttons);
            delete(options.buttons);
        }
        this.renderElement();

        // this.$dialog_box = $(QWeb.render('PreviewDialog', options)).appendTo("body");
        this.$el.modal({
            'backdrop': false,
            'keyboard': true,
        });
        if (options.size !== 'large'){
            var dialog_class_size = this.$dialog_box.find('.modal-lg').removeClass('modal-lg');
            if (options.size === 'small'){
                dialog_class_size.addClass('modal-sm');
            }
        }

        this.$el.appendTo(this.$dialog_box.find(".modal-body"));
        var $dialog_content = this.$dialog_box.find('.modal-content');
        if (options.dialogClass){
            $dialog_content.find(".modal-body").addClass(options.dialogClass);
        }
        $dialog_content.openerpClass();

        this.$dialog_box.on('hidden.bs.modal', this, function() {
            self.close();
        });
        this.$dialog_box.modal('show');

        this.dialog_inited = true;
        var res = this.start();
        return res;
    },
  
    close: function(reason) {
        if (this.dialog_inited && !this.__tmp_dialog_hiding) {
            $('.tooltip').remove(); 
            if (this.$el.is(":data(bs.modal)")) {
                this.__tmp_dialog_hiding = true;
                this.$dialog_box.modal('hide');
                this.__tmp_dialog_hiding = undefined;
            }
            this.trigger("closing", reason);
        }
    },
    _closing: function() {
        if (this.__tmp_dialog_destroying)
            return;
        if (this.dialog_options.destroy_on_close) {
            this.__tmp_dialog_closing = true;
            this.destroy();
            this.__tmp_dialog_closing = undefined;
        }
    },
    destroy: function (reason) {
        this.$buttons.remove();
        var self = this;
        _.each(this.getChildren(), function(el) {
            el.destroy();
        });
        if (! this.__tmp_dialog_closing) {
            this.__tmp_dialog_destroying = true;
            this.close(reason);
            this.__tmp_dialog_destroying = undefined;
        }
        if (this.dialog_inited && !this.isDestroyed() && this.$el.is(":data(bs.modal)")) {
            var $element = this.$dialog_box;
            setTimeout(function () {
                var modal_list_index = $.inArray($element, opened_modal);
                if (modal_list_index > -1){
                    opened_modal.splice(modal_list_index,1)[0].remove();
                }
                if (opened_modal.length > 0){
                    opened_modal[opened_modal.length-1].focus();
                    $('body').addClass('modal-open');
                }
            },0);
        }
        this._super();
    },
    

});
};