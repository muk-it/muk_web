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
		trigger: 'a.oe_menu_toggler[data-menu-xmlid="base.menu_administration"]',
		run: 'click',
	},{
		trigger: 'a.oe_menu_toggler[data-menu-xmlid="base.next_id_9"]',
		run: 'click',
	},{
		trigger: 'a.oe_menu_leaf[data-menu-xmlid="base.menu_action_attachment"]',
		run: 'click',
	},{
		trigger: 'input.o_searchview_input',
		extra_trigger: 'div.o_main_content > div.o_control_panel li.active:contains("Attachment")',
		run: 'text sample.pdf',
	},{
		trigger: 'ul.o_searchview_autocomplete li a',
		extra_trigger: 'div.o_main_content > div.o_control_panel li.active:contains("Attachment")',
		run: 'click',
	},{
		trigger: 'td.o_data_cell:contains("sample.pdf")',
		extra_trigger: 'div.o_main_content > div.o_control_panel li.active:contains("Attachment")',
		run: 'click',
	},{
		trigger: 'button.o_binary_preview',
		run: 'click',
	},{
		trigger: 'div.preview-body iframe',
		run: function (actions) {},
	}
];

tour.register(name, options, setps);

});