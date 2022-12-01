/** @odoo-module **/

import { Component } from "@odoo/owl";

export class AppsBar extends Component {}

Object.assign(AppsBar, {
    template: 'muk_web_theme.AppsBar',
    props: {
    	apps: Array,
    },
});

