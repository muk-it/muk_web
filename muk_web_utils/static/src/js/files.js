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

odoo.define('muk_web_utils.files', function (require) {
"use strict";

var core = require('web.core');
var utils = require('web.utils');

var QWeb = core.qweb;
var _t = core._t;

var traverse_items = function(items, structure) {
	var $result = $.Deferred();
    var files = [];
    var events = [];
    function traverse_item() {
        var $get = $.Deferred();
        var item, file;
        events.push($get);
        if (items[i] instanceof DataTransferItem) {
            item = items[i].webkitGetAsEntry();
            file = items[i].getAsFile();
        } else {
            item = items[i];
        }
        if (item) {
            if (item.isFile) {
                files.push(item);
                $get.resolve();
            } else if (item.isDirectory) {
            	var dirReader = item.createReader();
                dirReader.readEntries(function (entries) {
                    traverse_items(entries, structure).then(function (result) {
                        if(structure) {
                        	files.push({
                            	name: item.name,
                            	fullPath: item.fullPath,
                            	files: result,
                            	isDirectory: true,
                            	isFile: false,
                            });
                        } else {
                        	files = _.union(files, result);
                        }
                        $get.resolve();
                    });
                });
            }
        } else if (file) {
        	if(file.size) {
        		file.isFileItem = !!file.size;
                files.push(file);
        	}
            $get.resolve();
        } else {
            console.warn("Your browser doesn't support Drag and Drop!");
            $get.resolve();
        }
    };
    for (var i = 0; i < items.length; i++) {
        traverse_item();
    }
    $.when.apply($, events).then(function () {
        $result.resolve(files);
    });
    return $result;
};

var count_files_in_structure = function(structure) {
	var counter = 0;
	_.each(structure, function(item, index, structure) {
		if(item.isFile || item.isFileItem) {
			counter++;
		} else if(item.isDirectory) {
			counter += count_files_in_structure(item.files);
		}
	});
	return counter;
}

var get_file_list = function(items) {
	return traverse_items(items, false);
};

var get_file_structure = function(items) {
	return traverse_items(items, true);
};

var load_file = function(file, callback) {
	var fileReader = new FileReader();
	fileReader.readAsDataURL(file);
	fileReader.onloadend = callback;
};

var read_file = function(file, callback) {
	if(file.isFile) {
		file.file(function(file) {
			load_file(file, callback);
		});
	} else {
		load_file(file, callback);
	}
};

return {
	traverse_items: traverse_items,
	count_files_in_structure: count_files_in_structure,
	get_file_list: get_file_list,
	get_file_structure: get_file_structure,
	load_file: load_file,
	read_file: read_file,
};

});