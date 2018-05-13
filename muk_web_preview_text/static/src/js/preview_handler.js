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

odoo.define('muk_preview_text.PreviewHandler', function (require) {
"use strict";

var ajax = require('web.ajax');
var core = require('web.core');

var PreviewHandler = require('muk_preview.PreviewHandler');

var QWeb = core.qweb;
var _t = core._t;

var TextHandler = PreviewHandler.BaseHandler.extend({
	cssLibs: [
		'/muk_web_utils/static/lib/highlight/styles/default.css',
    ],
    jsLibs: [
        '/muk_web_utils/static/lib/highlight/highlight.pack.js',
        '/muk_web_utils/static/lib/highlight_line_numbers/highlight_line_numbers.js',
    ],
	checkExtension: function(extension) {
		return ['.abc', '.acgi', '.aip', '.asm', '.asp', '.c', '.c', '.c++', '.cc', '.cc', '.com', '.conf',
			'.cpp', '.csh', '.css', '.cxx', '.def', '.el', '.etx', '.f', '.f', '.f77', '.f90', '.f90',
			'.flx', '.for', '.for', '.g', '.h', '.h', '.hh', '.hh', '.hlb', '.htc', '.htm', '.html',
			'.htmls', '.htt', '.htx', '.idc', '.jav', '.jav', '.java', '.java', '.js', '.js', '.ksh',
			'.list', '.log', '.lsp', '.lst', '.lsx', '.m', '.m', '.mar', '.mcf', '.p', '.pas', '.pl',
			'.pl', '.pm', '.py', '.rexx', '.rt', '.rt', '.rtf', '.rtx', '.s', '.scm', '.scm', '.sdml',
			'.sgm', '.sgm', '.sgml', '.sgml', '.sh', '.shtml', '.shtml', '.spc', '.ssi', '.talk', '.tcl',
			'.tcsh', '.text', '.tsv', '.txt', '.uil', '.uni', '.unis', '.uri', '.uris', '.uu', '.uue',
			'.vcs', '.wml', '.wmls', '.wsc', '.xml', '.zsh', '.less', '.aj', '.cbl', '.cs', '.coffee',
			'.go', '.groovy', '.sc', 'abc', 'acgi', 'aip', 'asm', 'asp', 'c', 'c', 'c++', 'cc', 'cc',
			'com', 'conf', 'cpp', 'csh', 'css', 'cxx', 'def', 'el', 'etx', 'f', 'f', 'f77', 'f90',
			'f90', 'flx', 'for', 'for', 'g', 'h', 'h', 'hh', 'hh', 'hlb', 'htc', 'htm', 'html', 'htmls',
			'htt', 'htx', 'idc', 'jav', 'jav', 'java', 'java', 'js', 'js', 'ksh', 'list', 'log', 'lsp',
			'lst', 'lsx', 'm', 'm', 'mar', 'mcf', 'p', 'pas', 'pl', 'pl', 'pm', 'py', 'rexx', 'rt',
			'rt', 'rtf', 'rtx', 's', 'scm', 'scm', 'sdml', 'sgm', 'sgm', 'sgml', 'sgml', 'sh', 'shtml',
			'shtml', 'spc', 'ssi', 'talk', 'tcl', 'tcsh', 'text', 'tsv', 'txt', 'uil', 'uni', 'unis',
			'uri', 'uris', 'uu', 'uue', 'vcs', 'wml', 'wmls', 'wsc', 'xml', 'zsh', 'less', 'aj', 'cbl',
			'cs', 'coffee', 'go', 'groovy', 'sc'].includes(extension);
    },
    checkType: function(mimetype) {
		return ['text/vnd.abc', 'text/html', 'text/x-audiosoft-intra', 'text/x-asm', 'text/asp', 'text/plain',
			'text/x-c', 'text/x-script.csh', 'text/css', 'text/x-script.elisp', 'text/x-setext', 'text/x-fortran',
			'text/vnd.fmi.flexstor', 'text/x-h', 'text/x-script', 'text/x-component', 'text/webviewhtml',
			'text/x-java-source', 'text/javascript', 'text/ecmascript', 'text/x-script.ksh', 'text/x-script.lisp',
			'text/x-la-asf', 'text/x-m', 'text/mcf', 'text/x-pascal', 'text/pascal', 'text/x-script.perl',
			'text/x-script.perl-module', 'text/x-script.phyton', 'text/x-script.rexx', 'text/richtext',
			'text/vnd.rn-realtext', 'text/x-script.guile', 'text/x-script.scheme', 'text/sgml', 'text/x-sgml',
			'text/x-script.sh', 'text/x-server-parsed-html', 'text/x-speech', 'text/x-script.tcl',
			'text/x-script.tcsh', 'text/tab-separated-values', 'text/x-uil', 'text/uri-list', 'text/x-uuencode',
			'text/x-vcalendar', 'text/vnd.wap.wml', 'text/vnd.wap.wmlscript', 'text/scriplet', 'text/xml',
			'text/x-script.zsh'].includes(mimetype);
    },
    createHtml: function(url, mimetype, extension, title) {
    	var result = $.Deferred();
    	var $content = $(QWeb.render('TextHTMLContent'));
    	ajax.loadLibs(this).then(function() {
	    	$.ajax(url, {
			    dataType: "text",
			    success: function(text) {
			    	$content.find('.code-loader').hide();
		        	$content.find('.code-container').show();
			    	var $codeBlock = $content.find('.code-view');
			    	var $codeLang = $content.find(".code-lang");
			    	function setText(language) {
			    		$codeBlock.removeClass();
		    			$codeBlock.addClass('code-view');
			    		if(language) {
			    			$codeBlock.addClass(language);
			    		}
			    		$codeBlock.text(text);
		    			hljs.highlightBlock($codeBlock[0]);
					    hljs.lineNumbersBlock($codeBlock[0]);
			    	}
			    	setText();
			    	$codeLang.select2();
			    	$codeLang.on("change", function(e) {
			    		if(e.val === 'default') {
				    		setText();
			    		} else {
			    			setText(e.val);
			    		}
			    	});		    	
			    	$.each($codeBlock.attr('class').split(" "), function (i, cls) {
			    	    if($content.find(".code-lang option[value='" + cls + "']").val()) {
			    	    	$codeLang.val(cls).trigger("change");
			    	    }
			    	});
			    },
			    error: function(request, status, error) {
			    	console.error(request.responseText);
			    }
			});
    	});
        result.resolve($content);
		return result;
    },
});

return {
	TextHandler: TextHandler,
};

});