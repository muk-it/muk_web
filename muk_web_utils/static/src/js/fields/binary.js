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

odoo.define('muk_web_utils.binary', function(require) {
"use strict";

var core = require('web.core');
var session = require('web.session');
var utils = require('web.field_utils');
var fields = require('web.basic_fields');
var registry = require('web.field_registry');

var _t = core._t;
var QWeb = core.qweb;

fields.FieldBinaryFile.include({
	willStart: function () {
		var def = this._rpc({
            route: '/params/muk_web_utils.binary_max_size',
        }).done(function(result) {
        	this.max_upload_size = result.max_upload_size * 1024 * 1024;
        }.bind(this));
		return this._super.apply(this, arguments);
    },
});

fields.FieldBinaryImage.include({
	willStart: function () {
		var def = this._rpc({
            route: '/params/muk_web_utils.binary_max_size',
        }).done(function(result) {
        	this.max_upload_size = result.max_upload_size * 1024 * 1024;
        }.bind(this));
		return this._super.apply(this, arguments);
    },
});

var FieldBinarySize = fields.FieldFloat.extend({
	init: function(parent, name, record) {
        this._super.apply(this, arguments);
        this.units = this.nodeOptions.si ? 
        	['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] :
        	['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        this.thresh = this.nodeOptions.si ? 1000 : 1024;
    },
   _formatValue: function (value) {
   		if(Math.abs(value) < this.thresh) {
	        return this._super.call(this, value) + ' B';
	    }
   		var unit = -1;
	    do {
	    	value /= this.thresh;
	        ++unit;
	    } while(Math.abs(value) >= this.thresh && unit < this.units.length - 1);
	    return this._super.call(this, value) + ' ' + this.units[unit];
   },
});

registry.add('binary_size', FieldBinarySize);

return {
	FieldBinarySize: FieldBinarySize,
};

});
