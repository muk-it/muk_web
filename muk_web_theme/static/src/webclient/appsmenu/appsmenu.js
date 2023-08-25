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

import { session } from "@web/session";
import { url } from "@web/core/utils/urls";
import { Dropdown } from "@web/core/dropdown/dropdown";

export class AppsMenu extends Dropdown {
    setup() {
    	super.setup();
    	if (this.env.services.company.currentCompany.has_background_image) {
            this.backgroundImageUrl = url('/web/image', {
                model: 'res.company',
                field: 'background_image',
                id: this.env.services.company.currentCompany.id,
            });
    	} else {
    		this.backgroundImageUrl = '/muk_web_theme/static/img/background.png';
    	}
    	this.env.bus.on("ACTION_MANAGER:UI-UPDATED", this, ev => this.close());
    }
}

Object.assign(AppsMenu, {
    template: 'muk_web_theme.AppsMenu',
});