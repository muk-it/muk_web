/**********************************************************************************
* 
*    Copyright (C) 2018 MuK IT GmbH
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

odoo.define('muk_web_utils.widgets', function (require) {
"use strict";

var ajax = require('web.ajax');
var core = require('web.core');
var utils = require('web.utils');
var dialogs = require('web.view_dialogs');
var concurrency = require('web.concurrency');
var registry = require('web.field_registry');
var fields = require('web.basic_fields');

var AbstractField = require('web.AbstractField');

var QWeb = core.qweb;
var _t = core._t;

var IDSelectorField = fields.InputField.extend({
    AUTOCOMPLETE_DELAY: 200,
    supportedFieldTypes: ['integer'],
    template: 'FieldIDSelector',
    resetOnAnyFieldChange: true,
    events: _.extend({}, fields.InputField.prototype.events, {
        'click input': '_onInputClick',

    }),
	init: function () {
		this._super.apply(this, arguments);
		this.limit = 7;
        this.isDirty = false;
        this.lastChangeEvent = undefined;
        this.relation_field = this.attrs.model;
        this.orderer = new concurrency.DropMisordered();
        this.recordParams = {fieldName: this.name, viewType: this.viewType};
        if (this.field.type !== 'integer' || !this.relation_field) {
            var msg = _t("The type of the field '%s' must be a integer field with a model attribute.");
            throw _.str.sprintf(msg, this.field.string);
        }
    },
    start: function () {
        this.$input = this.$('input'); 
        return this._super.apply(this, arguments);
    },
    getFocusableElement: function () {
        return this.mode === 'edit' && this.$input || this.$el;
    },
    _bindAutoComplete: function () {
        var self = this;
        this.$input.autocomplete({
            source: function (req, resp) {
                self._search(req.term).then(function (result) {
                    resp(result);
                });
            },
            select: function (event, ui) {
                event.stopImmediatePropagation();
                event.preventDefault();
                if (ui.item.id) {
                	self.isDirty = true;
                    self.$input.val(ui.item.id);
                    self._doDebouncedAction();
                } else if (ui.item.action) {
                	ui.item.action();
                }
                return false;
            },
            focus: function (event) {
                event.preventDefault();
            },
            close: function (event) {
                if (event.which === $.ui.keyCode.ESCAPE) {
                    event.stopPropagation();
                }
            },
            autoFocus: true,
            html: true,
            minLength: 0,
            delay: this.AUTOCOMPLETE_DELAY,
        });
        this.$input.autocomplete("option", "position", { my : "left top", at: "left bottom" });
        this.autocomplete_bound = true;
    },
    _renderEdit: function () {
        this.$input.val(this._formatValue(this.value));
        if (!this.autocomplete_bound) {
            this._bindAutoComplete();
        }
    },
    _renderReadonly: function () {
        this.$el.html(this._formatValue(this.value));
        if (!this.nodeOptions.no_open) {
            this.$el.attr('href', '#');
            this.$el.addClass('o_form_uri');
        }
    },
    _search: function (search_val) {
        var self = this;
        var def = $.Deferred();
        this.orderer.add(def);
		if(this.recordData[this.relation_field]) {
			this._rpc({
	            route: '/helper/fields/model',
	            params: {
	            	id: this.recordData[this.relation_field].data.id,
	            },
	        }).then(function(helper) {
	        	var context = self.record.getContext(this.recordParams);
	            var domain = self.record.getDomain(this.recordParams);
	            self._rpc({
	                model: helper.model_name,
	                method: "name_search",
	                kwargs: {
	                    name: search_val,
	                    args: domain,
	                    operator: "ilike",
	                    limit: this.limit + 1,
	                    context: context,
	                }}).then(function (result) {
	                    var values = _.map(result, function (x) {
	                        return {
	                            label: _.str.escapeHTML(x[1].split('\n')[0].trim()) || data.noDisplayContent,
	                            value: x[1],
	                            id: x[0],
	                        };
	                    });
	                    if (values.length > self.limit) {
	                        values = values.slice(0, self.limit);
	                        values.push({
	                            label: _t("Search More..."),
	                            action: function () {
	                                self._rpc({
	                                	 	model: helper.model_name,
	                                        method: 'name_search',
	                                        kwargs: {
	                                            name: search_val,
	                                            args: domain,
	                                            operator: "ilike",
	                                            limit: 160,
	                                            context: context,
	                                        },
	                                    })
	                                    .then(self._searchCreatePopup.bind(self, "search", helper.model_name));
	                            },
	                            classname: 'o_m2o_dropdown_option',
	                        });
	                    }
	                    def.resolve(values);
	                });
	        });
		} else {
			this.do_warn(_t("A model have to be set before searching!"));
			def.resolve([]);
		}
        return def;
    },
    _searchCreatePopup: function (view, model_name, ids, context) {
        var self = this;
        return new dialogs.SelectCreateDialog(this, _.extend({}, this.nodeOptions, {
            res_model: model_name,
            domain: this.record.getDomain(this.recordParams),
            context: _.extend({}, this.record.getContext(this.recordParams), context || {}),
            title: _t("Search: ") + this.recordData[this.relation_field].data.display_name,
            initial_ids: ids ? _.map(ids, function (x) { return x[0]; }) : undefined,
            initial_view: view,
            disable_multiple_selection: true,
            on_selected: function (records) {
            	self.isDirty = true;
                self.$input.val(records[0].id);
                self._doDebouncedAction();
                self.activate();
            }
        })).open();
    },
    _onClick: function (event) {
        var self = this;
        if (this.mode === 'readonly' && !this.nodeOptions.no_open) {
            event.preventDefault();
            event.stopPropagation();
            this._rpc({
	            route: '/helper/fields/model',
	            params: {
	            	id: this.recordData[this.relation_field].data.id,
	            },
            }).then(function(helper) {
            	self._rpc({
                    model: helper.model_name,
                    method: 'get_formview_action',
                    args: [[self.value]],
                    context: self.record.getContext(self.recordParams),
                })
                .then(function (action) {
                    self.trigger_up('do_action', {action: action});
                });
            });
        }
    },
	_onInput: function (event) {
		if(parseInt(this.$input.val())) {
			event.stopPropagation();
        	event.preventDefault();
			this._doDebouncedAction();
		}
	},
    _onInputClick: function () {
        if (this.$input.autocomplete("widget").is(":visible")) {
            this.$input.autocomplete("close");
        } else if (parseInt(this.$input.val()) === 0) {
        	this.$input.autocomplete("search", '');
        } else {
        	this.$input.autocomplete("search");
        }
    },

});

registry.add('selector_id', IDSelectorField);

return {
	IDSelectorField: IDSelectorField
};

});