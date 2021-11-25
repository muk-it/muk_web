/** @odoo-module */

/**********************************************************************************
*
*    Copyright (c) 2017-today MuK IT GmbH.
*
*    This file is part of MuK Theme
*    (see https://mukit.at).
*
*    This program is free software: you can redistribute it and/or modify
*    it under the terms of the GNU Lesser General Public License as published by
*    the Free Software Foundation, either version 3 of the License, or
*    (at your option) any later version.
*
*    This program is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU Lesser General Public License for more details.
*
*    You should have received a copy of the GNU Lesser General Public License
*    along with this program. If not, see <http://www.gnu.org/licenses/>.
*
**********************************************************************************/

import { session } from "@web/session";
import { url } from "@web/core/utils/urls";
import { patch } from "@web/core/utils/patch";
import { registry } from "@web/core/registry";

import { NavBar } from "@web/webclient/navbar/navbar";
import { AppsMenu } from "@muk_web_theme/webclient/appsmenu/appsmenu";
import { AppsBar } from "@muk_web_theme/webclient/appsbar/appsbar";
import { SwitchCompanyMenu } from "@web/webclient/switch_company_menu/switch_company_menu";
import { UserMenu } from "@web/webclient/user_menu/user_menu";

patch(NavBar.prototype, "muk_web_theme.NavBar", {
    setup() {
        this._super();
        this.backgroundBlendMode = session.theme_background_blend_mode;
    },
});

patch(NavBar, "muk_web_theme.NavBar", {
    components: {
        ...NavBar.components,
        AppsMenu,
        AppsBar,
    },
});

const systrayItemUserMenu = {
    Component: UserMenu,
};

const systrayItemSwitchCompanyMenu = {
    Component: SwitchCompanyMenu,
    isDisplayed(env) {
        const { availableCompanies } = env.services.company;
        return Object.keys(availableCompanies).length > 1;
    },
};

registry.category("systray").add("web.user_menu", systrayItemUserMenu, { 
	force: true, sequence: 1
});
registry.category("systray").add("SwitchCompanyMenu", systrayItemSwitchCompanyMenu, {
	force: true, sequence: 2
});
	