/**********************************************************************************
*
*    Copyright (c) 2017-today MuK IT GmbH.
*
*    This file is part of MuK Grid Snippets
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

odoo.define('muk_web_theme.relational_fields', function (require) {
"use strict";

const config = require("web.config");
const fields = require('web.relational_fields');

fields.FieldStatus.include({
    _setState() {
        this._super(...arguments);
        if (config.device.isMobile) {
            _.map(this.status_information, (value) => {
                value.fold = true;
            });
        }
    },
});

fields.FieldOne2Many.include({
    _renderButtons() {
        const result = this._super(...arguments);
        if (config.device.isMobile && this.$buttons) {
        	const $buttons = this.$buttons.find('.btn-secondary');
        	$buttons.addClass('btn-primary mk_mobile_add');
            $buttons.removeClass('btn-secondary');
        }
        return result;
    }
});

fields.FieldMany2Many.include({
    _renderButtons() {
        const result = this._super(...arguments);
        if (config.device.isMobile && this.$buttons) {
        	const $buttons = this.$buttons.find('.btn-secondary');
        	$buttons.addClass('btn-primary mk_mobile_add');
            $buttons.removeClass('btn-secondary');
        }
        return result;
    }
});

});