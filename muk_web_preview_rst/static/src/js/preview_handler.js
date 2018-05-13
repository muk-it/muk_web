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

odoo.define('muk_preview_rst.PreviewHandler', function (require) {
"use strict";

var ajax = require('web.ajax');
var core = require('web.core');

var PreviewHandler = require('muk_preview.PreviewHandler');

var QWeb = core.qweb;
var _t = core._t;

var ReStructuredTextHandler = PreviewHandler.BaseHandler.extend({
	checkExtension: function(extension) {
		return ['.rst', 'rst'].includes(extension);
    },
    checkType: function(mimetype) {
		return ['text/x-rst'].includes(mimetype);
    },
    createHtml: function(url, mimetype, extension, title) {
    	var result = $.Deferred();
    	var $content = $(QWeb.render('ReStructuredTextContent'));
    	$.ajax({
    		url: '/web/preview/rst',
    		dataType: "text",
		    data: {
		    	url: url,
		    },
    		success: function(html) {
		    	$content.find('.rst-loader').hide();
	        	$content.find('.rst-container').show();
	        	$content.find('.rst-container').html(html);
		    },
		    error: function(request, status, error) {
		    	console.error(request.responseText);
		    }
		});
        result.resolve($content);
		return result;
    },
});

return {
	ReStructuredTextHandler: ReStructuredTextHandler,
};

});