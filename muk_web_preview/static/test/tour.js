odoo.define('muk_web_preview.tour', function (require) {
'use strict';

var core = require("web.core");
var tour = require("web_tour.tour");
var base = require("web_editor.base");

var _t = core._t;

var name = 'preview';

var options = {
    test: true,
    url: '/web?debug=',
    wait_for: base.ready()
};

var setps = [
	{
		content: 'open menu_administration',
		trigger: 'a[data-menu-xmlid="base.menu_administration"]',
		run: 'click',
	},{
		content: 'open menu_custom',
		trigger: 'a[data-menu-xmlid="base.menu_custom"]',
		run: 'click',
	},{
		content: 'open menu_action_attachment',
		trigger: 'a[data-menu-xmlid="base.menu_action_attachment"]',
		run: 'click',
	},{
		content: 'search sample.pdf',
		trigger: 'input.o_searchview_input',
		extra_trigger: 'div.o_main_content > div.o_control_panel li.active:contains("Attachment")',
		run: 'text sample.pdf',
	},{
		content: 'search sample.pdf',
		trigger: 'ul.o_searchview_autocomplete li a',
		extra_trigger: 'div.o_main_content > div.o_control_panel li.active:contains("Attachment")',
		run: 'click',
	},{
		content: 'switch to list view',
		trigger: '.o_cp_switch_list',
		extra_trigger: 'div.o_main_content > div.o_control_panel li.active:contains("Attachment")',
		run: 'click',
	},{
		content: 'open form view',
		trigger: 'td.o_data_cell:contains("sample.pdf")',
		extra_trigger: 'div.o_main_content > div.o_control_panel li.active:contains("Attachment")',
		run: 'click',
	},{
		content: 'open dialog',
		trigger: 'button.o_binary_preview',
		run: 'click',
	},{
		content: 'check',
		trigger: 'div.preview-body iframe',
		run: function (actions) {},
	}
];

tour.register(name, options, setps);

});