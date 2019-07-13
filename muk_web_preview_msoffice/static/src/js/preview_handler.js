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

odoo.define('muk_preview_msoffice.PreviewHandler', function (require) {
"use strict";

var ajax = require('web.ajax');
var core = require('web.core');

var PreviewHandler = require('muk_preview.PreviewHandler');

var QWeb = core.qweb;
var _t = core._t;

var WordHandler = PreviewHandler.PDFHandler.extend({
	checkExtension: function(extension) {
		return ['.doc', '.docx', '.docm', 'doc', 'docx', 'docm'].includes(extension);
    },
    checkType: function(mimetype) {
		return ['application/msword', 'application/ms-word', 'application/vnd.ms-word.document.macroEnabled.12',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(mimetype);
    },
    createHtml: function(url, mimetype, extension, title) {
    	var convertUrlTempalte = _.template('/web/preview/msoffice?url=<%= url %>');
    	return this._super(convertUrlTempalte({url: encodeURIComponent(url)}));
    },
});

var PowerPointHandler = PreviewHandler.PDFHandler.extend({
	checkExtension: function(extension) {
		return ['.ppt', '.pptx', '.pptm', 'ppt', 'pptx', 'pptm'].includes(extension);
    },
    checkType: function(mimetype) {
		return ['application/vnd.mspowerpoint', 'application/vnd.ms-powerpoint',
			'application/vnd.openxmlformats-officedocument.presentationml.presentation',
			'application/vnd.ms-powerpoint.presentation.macroEnabled.12'].includes(mimetype);
    },
    createHtml: function(url, mimetype, extension, title) {
    	var convertUrlTempalte = _.template('/web/preview/msoffice?url=<%= url %>');
    	return this._super(convertUrlTempalte({url: encodeURIComponent(url)}));
    },
});

var ExcelHandler = PreviewHandler.BaseHandler.extend({
	cssLibs: [
		'/muk_web_utils/static/lib/handsontable/handsontable.css',
    ],
    jsLibs: [
        '/muk_web_utils/static/lib/jQueryBinaryTransport/jquery-binarytransport.js',
        '/muk_web_utils/static/lib/SheetJS/xlsx.js',
        '/muk_web_utils/static/lib/handsontable/handsontable.js'
    ],
	checkExtension: function(extension) {
		return ['.xls', '.xlsx', '.xlsm', '.xlsb', 'xls', 'xlsx', 'xlsm', 'xlsb'].includes(extension);
    },
    checkType: function(mimetype) {
		return ['application/vnd.ms-excel', 'application/vnd.msexcel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'application/vnd.ms-excel.sheet.binary.macroEnabled.12', 'application/vnd.ms-excel.sheet.macroEnabled.12'].includes(mimetype);
    },
    createHtml: function(url, mimetype, extension, title) {
    	var result = $.Deferred();
    	var $content = $(QWeb.render('ExcelHTMLContent'));
    	ajax.loadLibs(this).then(function() {
	    	$.ajax(url, {
				type: "GET",
				dataType: "binary",
				responseType:'arraybuffer',
				processData: false,
				success: function(arraybuffer) {
					var data = new Uint8Array(arraybuffer);
					var arr = new Array();
					for(var i = 0; i != data.length; ++i) {
						arr[i] = String.fromCharCode(data[i]);
					}
					var workbook = XLSX.read(arr.join(""), {
						type:"binary",
						cellDates:true,
						cellStyles:true,
						cellNF:true
					});
					var jsonWorkbook = {};
					_.each(workbook.SheetNames, function(sheet, index, list) {
						var jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {header:1});
						if(jsonData.length > 0) {
							jsonWorkbook[sheet] = jsonData;
						}
						var worksheet = workbook.Sheets[sheet];
					});
					$content.find('.excel-loader').hide();
					$content.find('.excel-container').show();
					var index = 0;
					_.each(jsonWorkbook, function(sheet, sheetname, list) {
						var $tab = $('<a/>');
						$tab.attr('href', '#sheet-' + index);
		    			$tab.attr('aria-controls', 'sheet-' + index);
		    			$tab.attr('role', 'tab');
		    			$tab.attr('data-toggle', 'tab');
		    			$tab.append('<i class="fa fa-table" aria-hidden="true"></i>');
		    			$tab.append($('<span/>').text(sheetname));
			    		$content.find('.nav-tabs').append($('<li/>').append($tab));
		    			var $pane = $('<div/>');
		    			$pane.addClass('tab-pane table-container');
		    			$pane.attr('id', 'sheet-' + index);
		    			$pane.handsontable({
						    data: sheet,
						    rowHeaders: true,
						    colHeaders: true,
						    stretchH: 'all',
						    readOnly: true,
						    columnSorting: true,
						    autoColumnSize: true,
		    			});
		    			$content.find('.tab-content').append($pane);
		    			if(index == 0) {
		    				$tab.tab('show');
		    			}
		    			index++;
					});
				},
				error: function(request, status, error) {
			    	console.error(request.responseText);
			    },
			});
    	});
        result.resolve($content);
		return result;
    },
});

return {
	ExcelHandler: ExcelHandler,
	WordHandler: WordHandler,
	PowerPointHandler: PowerPointHandler,
};

});