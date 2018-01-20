odoo.define('muk_web_preview.tour', function (require) {
'use strict';

var core = require("web.core");
var tour = require("web_tour.tour");
var base = require("web_editor.base");

var _t = core._t;

var name = 'preview';

var options = {
    test: true,
    url: '/web',
    wait_for: base.ready()
}

var setps = [
	{
		content: 'open menu_administration',
		trigger: 'a.oe_menu_toggler[data-menu-xmlid="base.menu_administration"]',
		run: 'click',
	},{
		content: 'open next_id_9',
		trigger: 'a.oe_menu_toggler[data-menu-xmlid="base.next_id_9"]',
		run: 'click',
	},{
		content: 'open menu_action_attachment',
		trigger: 'a.oe_menu_leaf[data-menu-xmlid="base.menu_action_attachment"]',
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