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
        self.on('dragenter', function(event) {
            if (collection.size() === 0) {
                self.trigger('dndHoverStart');
            }
            collection = collection.add(event.target);
        });
        self.on('dragleave', function(event) {
            setTimeout(function() {
                collection = collection.not(event.target);
                if (collection.size() === 0) {
                    self.trigger('dndHoverEnd');
                }
            }, 1);
        });
        self.on('drop', function(event) {
            setTimeout(function() {
            	collection = $();
            	self.trigger('dndHoverEnd');
            }, 1);
        });
    });
};