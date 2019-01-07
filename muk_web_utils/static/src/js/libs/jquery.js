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

$.fn.textWidth = function(text, font) {
    if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
    $.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'));
    return $.fn.textWidth.fakeEl.width();
};

$.fn.dndHover = function(options) {
	return this.each(function() {
        var self = $(this);
        var collection = $();
        var dragenter = function(event) {
            if (collection.size() === 0) {
                self.trigger('dndHoverStart', [event]);
            }
            collection = collection.add(event.target);
        };
        var dragleave = function(event) {
            setTimeout(function() {
                collection = collection.not(event.target);
                if (collection.size() === 0) {
                    self.trigger('dndHoverEnd', [event]);
                }
            }, 1);
        };
        var drop = function(event) {
            setTimeout(function() {
            	collection = $();
            	self.trigger('dndHoverEnd', [event]);
            }, 1);
        };
        if(options && options === 'destroy') {
        	self.off('dragenter.dnd_hover');
	        self.off('dragleave.dnd_hover');
	        self.off('drop.dnd_hover');
        } else {
        	self.on('dragenter.dnd_hover', dragenter);
	        self.on('dragleave.dnd_hover', dragleave);
	        self.on('drop.dnd_hover', drop);
        }
    });
};
