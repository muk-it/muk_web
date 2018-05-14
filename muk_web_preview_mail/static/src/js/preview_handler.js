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

odoo.define('muk_preview_mail.PreviewHandler', function (require) {
"use strict";

var ajax = require('web.ajax');
var core = require('web.core');

var PreviewHandler = require('muk_preview.PreviewHandler');
var PreviewGenerator = require('muk_preview.PreviewGenerator');

var QWeb = core.qweb;
var _t = core._t;

var MailHandler = PreviewHandler.BaseHandler.extend({
	checkExtension: function(extension) {
		return ['.eml', 'eml'].includes(extension);
    },
    checkType: function(mimetype) {
		return ['message/rfc822'].includes(mimetype);
    },
    createHtml: function(url, mimetype, extension, title) {
    	var self = this;
    	var result = $.Deferred();
    	var $content = $(QWeb.render('MailHTMLContent'));
    	$.ajax({
    		url: '/web/preview/mail',
    		dataType: "json",
		    data: {
		    	url: url,
		    },
    		success: function(mail) {
		    	$content.find('.mail-loader').hide();
	        	$content.find('.mail-container').show();
	        	$content.find('.reply').click(function() {
	        		$('.modal').modal('hide');
	        		self.widget.do_action({
	    	            type: 'ir.actions.act_window',
	    	            res_model: 'mail.mail',
	    	            views: [[false, 'form']],
	    	            context: {
	    	            	default_subject: _t("Re: " + mail.subject),
	    	            	default_email_to: mail.from
	    	            },
	        	    });
	        	});
	        	$content.find('.reply').toggle(!!self.widget.do_action);
		    	$content.find('#subject').text(mail.subject);
		    	$content.find('#meta-to').text(mail.to);
		    	$content.find('#meta-cc').text(mail.cc);
		    	$content.find('#meta-from').text(mail.from);
		    	$content.find('#meta-date').text(mail.date);
		    	mail.body = mail.body.replace(/cid:(\w|\d)+.\w+/g, function(cid) {
					var attachments = $.grep(mail.attachments, function(attachment) {
						return attachment[4].cid && attachment[4].cid.includes(cid.substring(4, cid.length));
					});
					return attachments[0][3];
				});
		    	$content.find('#body').html(mail.body);
		    	_.each(mail.attachments, function(attachment, index, attachments) {
		    		if(!attachment[4].cid) {
		    			var $download = $('<i/>');
		    			$download.addClass('fa fa-download');
		    			$download.css('cursor', 'pointer');
			    		$download.data('toggle', 'tooltip');
			    		$download.data('placement', 'top');
		    			$download.data('url', attachment[3]);
		    			$download.attr('title', _t("Download!"));
		    			$download.tooltip(); 
		    			$download.click(function(e) {
		    				window.location = $(e.target).data('url');
		    			});
		    			var $tab = $('<a/>');
		    			$tab.attr('href', '#attachment-' + index);
		    			$tab.attr('aria-controls', 'attachment-' + index);
		    			$tab.attr('role', 'tab');
		    			$tab.attr('data-toggle', 'tab');
		    			$tab.append($download);
		    			$tab.append($('<span/>').text(attachment[0]));		
		    			$content.find('.nav-tabs').append($('<li/>').append($tab));
		    			$tab.click(function(e) {
		    				var $target = $content.find($(e.currentTarget).attr('href'));
		    				if(!$target.data('loaded')) {
		    					$target.data('loaded', true);
		    					PreviewGenerator.createPreview(self, $target.data('url'), $target.data('mimetype'),
		    							$target.data('extension'), $target.data('title')).then(function($preview) {
		    						$target.append($preview);
		    			        });
		    				}
		    			});
		    			var $pane = $('<div/>');
		    			$pane.addClass('tab-pane attachment-container');
		    			$pane.attr('id', 'attachment-' + index);
		    			$pane.data('loaded', false);
		    			$pane.data('url', attachment[3]);
		    			$pane.data('mimetype', attachment[1]);
		    			$pane.data('extension', attachment[2]);
		    			$pane.data('title', attachment[0]);
		    			$content.find('.tab-content').append($pane);
		    		}
		    	}); 	    	
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
	MailHandler: MailHandler,
};

});