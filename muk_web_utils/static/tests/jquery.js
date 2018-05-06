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

odoo.define('muk_web_utils.jquery_tests', function (require) {
"use strict";

QUnit.module('utils', function () {

	QUnit.module('jquery');
    
    QUnit.test('textWidth', function (assert) {
        assert.expect(1);
        
        var result = $.fn.textWidth("Lorem ipsum dolor sit amet");
        assert.strictEqual(result, 159);
    });

});

});
