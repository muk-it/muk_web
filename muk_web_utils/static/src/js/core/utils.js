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

odoo.define('muk_web_utils.utils', function (require) {
"use strict";

var core = require('web.core');

var _t = core._t;
var QWeb = core.qweb;

function isUrl(string) {
	var protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
	var localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/
	var nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;
	var match = string.match(protocolAndDomainRE);
	if (!match) {
		return false;
	}
	var everythingAfterProtocol = match[1];
	if (!everythingAfterProtocol) {
		return false;
	}
	if (localhostDomainRE.test(everythingAfterProtocol) || nonLocalhostDomainRE.test(everythingAfterProtocol)) {
		return true;
	}
	return false;
}

function parseText2Html(text) {
    return text
        .replace(/((?:https?|ftp):\/\/[\S]+)/g,'<a href="$1">$1</a> ')
        .replace(/[\n\r]/g,'<br/>');
}

return {
	isUrl: isUrl,
	parseText2Html: parseText2Html,
};

});