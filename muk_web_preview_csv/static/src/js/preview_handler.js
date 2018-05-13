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

odoo.define('muk_preview_csv.PreviewHandler', function (require) {
"use strict";

var ajax = require('web.ajax');
var core = require('web.core');

var PreviewHandler = require('muk_preview.PreviewHandler');

var QWeb = core.qweb;
var _t = core._t;

var CSVHandler = PreviewHandler.BaseHandler.extend({
	cssLibs: [
		'/muk_web_utils/static/lib/pikaday/pikaday.css',
		'/muk_web_utils/static/lib/handsontable/handsontable.css',
    ],
    jsLibs: [
        '/muk_web_utils/static/lib/PapaParse/papaparse.js',
        '/muk_web_utils/static/lib/numbro/numbro.js',
        '/muk_web_utils/static/lib/pikaday/pikaday.js',
        '/muk_web_utils/static/lib/handsontable/handsontable.js',
    ],
	checkExtension: function(extension) {
		return ['.csv', 'csv'].includes(extension);
    },
    checkType: function(mimetype) {
		return ['text/comma-separated-values', 'text/csv', 'application/csv'].includes(mimetype);
    },
    createHtml: function(url, mimetype, extension, title) {
    	var result = $.Deferred();
    	var $content = $(QWeb.render('CSVHTMLContent'));
    	ajax.loadLibs(this).then(function() {
	    	Papa.parse(url, {
	            download: true,
	            dynamicTyping: true,
	            complete: function(results) {
	            	$content.find('.csv-loader').hide();
	            	$content.find('.csv-container').show();
	            	$content.find('.csv-container').handsontable({
					    data: results.data,
					    rowHeaders: true,
					    colHeaders: true,
					    stretchH: 'all',
					    readOnly: true,
					    columnSorting: true,
					    autoColumnSize: true,
	    			});
	            }
	        });
    	});
        result.resolve($content);
		return result;
    },
});

return {
	CSVHandler: CSVHandler,
};

});