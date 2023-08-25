/** @odoo-module **/

/**********************************************************************************
*
*    Copyright (c) 2017-today MuK IT GmbH.
*
*    This file is part of MuK Backend Theme
*    (see https://mukit.at).
*
*    License LGPL-3.0 or later (http://www.gnu.org/licenses/lgpl).
*
**********************************************************************************/

import { Component } from "@odoo/owl";

export class AppsBar extends Component {}

Object.assign(AppsBar, {
    template: 'muk_web_theme.AppsBar',
    props: {
    	apps: Array,
    },
});

