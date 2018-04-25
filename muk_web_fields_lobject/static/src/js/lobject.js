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

odoo.define('muk_web_fields_lobject.lobject', function(require) {
"use strict";

var core = require('web.core');
var utils = require('web.utils');
var session = require('web.session');
var framework = require('web.framework');
var crash_manager = require('web.crash_manager');
var registry = require('web.field_registry');
var field_utils = require('web.field_utils');

var AbstractField = require('web.AbstractField');

var _t = core._t;
var QWeb = core.qweb;

var AbstractFieldLargeObject = AbstractField.extend({
    events: _.extend({}, AbstractField.prototype.events, {
        'change .o_input_file': 'on_file_change',
        'click .o_select_file_button': function () {
            this.$('.o_input_file').click();
        },
        'click .o_clear_file_button': 'on_clear',
    }),
    init: function (parent, name, record) {
        this._super.apply(this, arguments);
        this.fields = record.fields;
        this.useFileAPI = !!window.FileReader;
        this.max_upload_size = 25 * 1024 * 1024;
        if (!this.useFileAPI) {
            var self = this;
            this.fileupload_id = _.uniqueId('o_fileupload');
            $(window).on(this.fileupload_id, function () {
                var args = [].slice.call(arguments).slice(1);
                self.on_file_uploaded.apply(self, args);
            });
        }
    },
    destroy: function () {
        if (this.fileupload_id) {
            $(window).off(this.fileupload_id);
        }
        this._super.apply(this, arguments);
    },
    on_file_change: function (e) {
        var self = this;
        var file_node = e.target;
        if ((this.useFileAPI && file_node.files.length) || (!this.useFileAPI && $(file_node).val() !== '')) {
            if (this.useFileAPI) {
                var file = file_node.files[0];
                if (file.size > this.max_upload_size) {
                    var msg = _t("The selected file exceed the maximum file size of %s.");
                    this.do_warn(_t("File Upload"), _.str.sprintf(msg, utils.human_size(this.max_upload_size)));
                    return false;
                }
                var filereader = new FileReader();
                filereader.readAsDataURL(file);
                filereader.onloadend = function (upload) {
                    var data = upload.target.result;
                    data = data.split(',')[1];
                    self.on_file_uploaded(file.size, file.name, file.type, data);
                };
            } else {
                this.$('form.o_form_binary_form input[name=session_id]').val(this.getSession().session_id);
                this.$('form.o_form_binary_form').submit();
            }
            this.$('.o_form_binary_progress').show();
            this.$('button').hide();
        }
    },
    on_file_uploaded: function (size, name) {
        if (size === false) {
            this.do_warn(_t("File Upload"), _t("There was a problem while uploading your file"));
            console.warn("Error while uploading file : ", name);
        } else {
            this.on_file_uploaded_and_valid.apply(this, arguments);
        }
        this.$('.o_form_binary_progress').hide();
        this.$('button').show();
    },
    on_file_uploaded_and_valid: function (size, name, content_type, file_base64) {
        this.set_filename(name);
        this._setValue(file_base64);
        this._render();
    },
    set_filename: function (value) {
        var filename = this.attrs.filename;
        if (filename && filename in this.fields) {
            var changes = {};
            changes[filename] = value;
            this.trigger_up('field_changed', {
                dataPointID: this.dataPointID,
                changes: changes,
                viewType: this.viewType,
            });
        }
    },
    on_clear: function () {
        this.set_filename('');
        this._setValue(false);
        this._render();
    },
});

var FieldLargeObject = AbstractFieldLargeObject.extend({
    template: 'FieldLObjectFile',
    events: _.extend({}, AbstractFieldLargeObject.prototype.events, {
        'click': function (event) {
            if (this.mode === 'readonly' && this.value && this.recordData.id) {
                this.on_save_as(event);
            }
        },
        'click .o_input': function () {
            this.$('.o_input_file').click();
        },
    }),
    supportedFieldTypes: ['lobject'],
    init: function () {
        this._super.apply(this, arguments);
        this.filename_value = this.recordData[this.attrs.filename];
    },
    _renderReadonly: function () {
        this.do_toggle(!!this.value);
        if (this.value) {
            this.$el.empty().append($("<span/>").addClass('fa fa-download'));
            if (this.recordData.id) {
                this.$el.css('cursor', 'pointer');
            } else {
                this.$el.css('cursor', 'not-allowed');
            }
            if (this.filename_value) {
                this.$el.append(" " + this.filename_value);
            }
        }
        if (!this.res_id) {
            this.$el.css('cursor', 'not-allowed');
        } else {
            this.$el.css('cursor', 'pointer');
        }
    },
    _renderEdit: function () {
        if (this.value) {
            this.$el.children().removeClass('o_hidden');
            this.$('.o_select_file_button').first().addClass('o_hidden');
            this.$('.o_input').eq(0).val(this.filename_value || this.value);
        } else {
            this.$el.children().addClass('o_hidden');
            this.$('.o_select_file_button').first().removeClass('o_hidden');
        }
    },
    set_filename: function (value) {
        this._super.apply(this, arguments);
        this.filename_value = value;
        this.$('.o_save_file_button').prop('disabled', true);
    },
    on_save_as: function (ev) {
        if (!this.value) {
        	this._super.apply(this, arguments);
        } else if (this.res_id) {
            framework.blockUI();
            var c = crash_manager;
            var filename_fieldname = this.attrs.filename;
            this.getSession().get_file({
                'url': '/web/lobject',
                'data': {
                    'model': this.model,
                    'id': this.res_id,
                    'field': this.name,
                    'filename_field': filename_fieldname,
                    'filename': this.recordData[filename_fieldname] || null,
                    'download': true,
                    'data': utils.is_bin_size(this.value) ? null : this.value,
                },
                'complete': framework.unblockUI,
                'error': c.rpc_error.bind(c),
            });
            ev.stopPropagation();
        }
    },
});

registry.add('lobject', FieldLargeObject);

return {
	AbstractFieldLargeObject: AbstractFieldLargeObject,
	FieldLargeObject: FieldLargeObject
};

});
