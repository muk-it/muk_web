/**********************************************************************************
* 
*    Copyright (C) 2018 MuK IT GmbH
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

odoo.define('muk_web_utils.common_tests', function (require) {
"use strict";

var common = require('muk_web_utils.common');

QUnit.module('utils', function () {

	QUnit.module('common');
	
    QUnit.test('format_size', function (assert) {
        assert.expect(1);
        
        var result = common.format_size(5000);
        assert.strictEqual(result, "4.88 KiB");
    });

});

});
