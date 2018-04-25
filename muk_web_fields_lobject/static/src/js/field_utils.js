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

odoo.define('muk_web_fields_lobject.field_utils', function(require) {
"use strict";

var core = require('web.core');
var utils = require('web.utils');
var field_utils = require('web.field_utils');

var _t = core._t;
var QWeb = core.qweb;

function lobjectToBinsize(value) {
    if (!utils.is_bin_size(value)) {
        return utils.human_size(value.length);
    }
    return value;
}

function formatLargeObject(value, field, options) {
    if (!value) {
        return '';
    }
    return lobjectToBinsize(value);
}

field_utils.format.lobject = formatLargeObject;
field_utils.parse.lobject = _.identity; 


});
