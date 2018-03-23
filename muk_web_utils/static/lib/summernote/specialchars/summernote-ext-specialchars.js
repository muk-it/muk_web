/*
 * Emoji plugin for summernote [https://github.com/summernote/summernote]
 * Canonical - https://github.com/JustinEldracher/summernote-plugins
 */

odoo.define('muk_web_utils.summernote_ext_specialchars', function (require) {
'use strict';

//template
var tmpl = $.summernote.renderer.getTemplate();

// core functions: range, dom
var range = $.summernote.core.range;
var dom = $.summernote.core.dom;

var KEY = {
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
  ENTER: 13
};
var COLUMN_LENGTH = 15;
var COLUMN_WIDTH = 35;

var currentColumn, currentRow, totalColumn, totalRow = 0;

// special characters data set
var specialCharDataSet = [
	"&#33;",
	"&#34;",
	"&#35;",
	"&#36;",
	"&#37;",
	"&#38;",
	"&#39;",
	"&#40;",
	"&#41;",
	"&#42;",
	"&#43;",
	"&#44;",
	"&#45;",
	"&#46;",
	"&#47;",
	"&#48;",
	"&#49;",
	"&#50;",
	"&#51;",
	"&#52;",
	"&#53;",
	"&#54;",
	"&#55;",
	"&#56;",
	"&#57;",
	"&#58;",
	"&#59;",
	"&#60;",
	"&#61;",
	"&#62;",
	"&#63;",
	"&#64;",
	"&#65;",
	"&#66;",
	"&#67;",
	"&#68;",
	"&#69;",
	"&#70;",
	"&#71;",
	"&#72;",
	"&#73;",
	"&#74;",
	"&#75;",
	"&#76;",
	"&#77;",
	"&#78;",
	"&#79;",
	"&#80;",
	"&#81;",
	"&#82;",
	"&#83;",
	"&#84;",
	"&#85;",
	"&#86;",
	"&#87;",
	"&#88;",
	"&#89;",
	"&#90;",
	"&#91;",
	"&#92;",
	"&#93;",
	"&#94;",
	"&#95;",
	"&#96;",
	"&#97;",
	"&#98;",
	"&#99;",
	"&#100;",
	"&#101;",
	"&#102;",
	"&#103;",
	"&#104;",
	"&#105;",
	"&#106;",
	"&#107;",
	"&#108;",
	"&#109;",
	"&#110;",
	"&#111;",
	"&#112;",
	"&#113;",
	"&#114;",
	"&#115;",
	"&#116;",
	"&#117;",
	"&#118;",
	"&#119;",
	"&#120;",
	"&#121;",
	"&#122;",
	"&#123;",
	"&#124;",
	"&#125;",
	"&#126;",
	"&#192;",
	"&#193;",
	"&#194;",
	"&#195;",
	"&#196;",
	"&#197;",
	"&#198;",
	"&#199;",
	"&#200;",
	"&#201;",
	"&#202;",
	"&#203;",
	"&#204;",
	"&#205;",
	"&#206;",
	"&#207;",
	"&#208;",
	"&#209;",
	"&#210;",
	"&#211;",
	"&#212;",
	"&#213;",
	"&#214;",
	"&#216;",
	"&#217;",
	"&#218;",
	"&#219;",
	"&#220;",
	"&#221;",
	"&#222;",
	"&#223;",
	"&#224;",
	"&#225;",
	"&#226;",
	"&#227;",
	"&#228;",
	"&#229;",
	"&#230;",
	"&#231;",
	"&#232;",
	"&#233;",
	"&#234;",
	"&#235;",
	"&#236;",
	"&#237;",
	"&#238;",
	"&#239;",
	"&#240;",
	"&#241;",
	"&#242;",
	"&#243;",
	"&#244;",
	"&#245;",
	"&#246;",
	"&#248;",
	"&#249;",
	"&#250;",
	"&#251;",
	"&#252;",
	"&#253;",
	"&#254;",
	"&#255;",
	"&#161;",
	"&#162;",
	"&#163;",
	"&#164;",
	"&#165;",
	"&#166;",
	"&#167;",
	"&#168;",
	"&#169;",
	"&#170;",
	"&#171;",
	"&#172;",
	"&#174;",
	"&#175;",
	"&#176;",
	"&#177;",
	"&#178;",
	"&#179;",
	"&#180;",
	"&#181;",
	"&#182;",
	"&#184;",
	"&#185;",
	"&#186;",
	"&#187;",
	"&#188;",
	"&#189;",
	"&#190;",
	"&#191;",
	"&#215;",
	"&#247;",
	"&#8704;",
	"&#8706;",
	"&#8707;",
	"&#8709;",
	"&#8711;",
	"&#8712;",
	"&#8713;",
	"&#8715;",
	"&#8719;",
	"&#8721;",
	"&#8722;",
	"&#8727;",
	"&#8730;",
	"&#8733;",
	"&#8734;",
	"&#8736;",
	"&#8743;",
	"&#8744;",
	"&#8745;",
	"&#8746;",
	"&#8747;",
	"&#8756;",
	"&#8764;",
	"&#8773;",
	"&#8776;",
	"&#8800;",
	"&#8801;",
	"&#8804;",
	"&#8805;",
	"&#8834;",
	"&#8835;",
	"&#8836;",
	"&#8838;",
	"&#8839;",
	"&#8853;",
	"&#8855;",
	"&#8869;",
	"&#8901;",
	"&#913;",
	"&#914;",
	"&#915;",
	"&#916;",
	"&#917;",
	"&#918;",
	"&#919;",
	"&#920;",
	"&#921;",
	"&#922;",
	"&#923;",
	"&#924;",
	"&#925;",
	"&#926;",
	"&#927;",
	"&#928;",
	"&#929;",
	"&#931;",
	"&#932;",
	"&#933;",
	"&#934;",
	"&#935;",
	"&#936;",
	"&#937;",
	"&#945;",
	"&#946;",
	"&#947;",
	"&#948;",
	"&#949;",
	"&#950;",
	"&#951;",
	"&#952;",
	"&#953;",
	"&#954;",
	"&#955;",
	"&#956;",
	"&#957;",
	"&#958;",
	"&#959;",
	"&#960;",
	"&#961;",
	"&#962;",
	"&#963;",
	"&#964;",
	"&#965;",
	"&#966;",
	"&#967;",
	"&#968;",
	"&#969;",
	"&#977;",
	"&#978;",
	"&#982;",
	"&#338;",
	"&#339;",
	"&#352;",
	"&#353;",
	"&#376;",
	"&#402;",
	"&#710;",
	"&#732;",
	"&#8194;",
	"&#8195;",
	"&#8201;",
	"&#8204;",
	"&#8205;",
	"&#8206;",
	"&#8207;",
	"&#8211;",
	"&#8212;",
	"&#8216;",
	"&#8217;",
	"&#8218;",
	"&#8220;",
	"&#8221;",
	"&#8222;",
	"&#8224;",
	"&#8225;",
	"&#8226;",
	"&#8230;",
	"&#8240;",
	"&#8242;",
	"&#8243;",
	"&#8249;",
	"&#8250;",
	"&#8254;",
	"&#8364;",
	"&#8482;",
	"&#8592;",
	"&#8593;",
	"&#8594;",
	"&#8595;",
	"&#8596;",
	"&#8629;",
	"&#8968;",
	"&#8969;",
	"&#8970;",
	"&#8971;",
	"&#9674;",
	"&#9824;",
	"&#9827;",
	"&#9829;",
	"&#9830;",
];

/**
 * @member plugin.specialChar
 * @private
 * @param {jQuery} $editable
 * @return {String}
 */
var getTextOnRange = function ($editable) {
  $editable.focus();

  var rng = range.create();

  // if range on anchor, expand range with anchor
  if (rng.isOnAnchor()) {
    var anchor = dom.ancestor(rng.sc, dom.isAnchor);
    rng = range.createFromNode(anchor);
  }

  return rng.toString();
};

/**
 * Make Special Characters Table
 *
 * @member plugin.specialChar
 * @private
 * @return {jQuery}
 */
var makeSpecialCharSetTable = function () {
  var $table = $("<div/>").attr("id", "specialCharTable");
	$.each(specialCharDataSet, function (idx, text) {
		var $block = $("<span/>").attr("style", "border:1px solid black;display:inline-block;height:50px;width:35px;text-align:center;font-size:14pt;color:black;padding-top:10px;cursor:pointer;")
			.addClass("note-specialchar-node char-" + idx).attr("title", text).attr("id", "char-" + idx);
		$block.append(text);
		$table.append($block);
	});

  return $table;
};

/**
 * Show Special Characters and set event handlers on dialog controls.
 *
 * @member plugin.specialChar
 * @private
 * @param {jQuery} $dialog
 * @param {jQuery} $dialog
 * @param {Object} text
 * @return {Promise}
 */
var showSpecialCharDialog = function ($editable, $dialog, text) {
  return $.Deferred(function (deferred) {
    var $specialCharDialog = $dialog.find('.note-specialchar-dialog');
    var $specialCharNode = $specialCharDialog.find('.note-specialchar-node');
    var $selectedNode = null;
    var ARROW_KEYS = [KEY.UP, KEY.DOWN, KEY.LEFT, KEY.RIGHT];
    var ENTER_KEY = KEY.ENTER;
	  var pos = 0;
	  var end = specialCharDataSet.length;

    function addActiveClass($target) {
      if (!$target) {
        return;
      }
      $target.find('span').addClass('active');
      $selectedNode = $target;
    }

    function removeActiveClass($target) {
      $target.find('span').removeClass('active');
      $selectedNode = null;
    }

    // find next node
    function findNextNode(row, column) {
      var findNode = null;
      $.each($specialCharNode, function (idx, $node) {
        var findRow = Math.ceil((idx + 1) / COLUMN_LENGTH);
        var findColumn = ((idx + 1) % COLUMN_LENGTH === 0) ? COLUMN_LENGTH : (idx + 1) % COLUMN_LENGTH;
        if (findRow === row && findColumn === column) {
          findNode = $node;
          return false;
        }
      });
      return $(findNode);
    }

    function arrowKeyHandler(keyCode) {
      // left, right, up, down key
      var w = $("#specialCharTable").css("width") + "";
		w = w.substr(0, w.length - 2);
		var cols = Math.floor(w / 35);
		pos = parseInt(pos);

      if (KEY.LEFT === keyCode) {
			if (pos > 0) {
				pos--;
				clear();
				$(".char-" + pos).css("border", "1px solid blue").css("background-color", "aliceblue");
				$selectedNode = $(".char-" + pos);
			}
      } else if (KEY.RIGHT === keyCode) {
			if (pos < end - 1) {
				pos++;
				clear();
				$(".char-" + pos).css("border", "1px solid blue").css("background-color", "aliceblue");
				$selectedNode = $(".char-" + pos);
			}
		} else if (KEY.UP === keyCode) {
			if (pos - cols >= 0) {
				clear();
				pos = pos - cols;
				$(".char-" + pos).css("border", "1px solid blue").css("background-color", "aliceblue");
				$selectedNode = $(".char-" + pos);
			}
		} else if (KEY.DOWN === keyCode) {
			if (pos + cols <= end) {
				clear();
				pos = pos + cols;
				$(".char-" + pos).css("border", "1px solid blue").css("background-color", "aliceblue");
				$selectedNode = $(".char-" + pos);
			}
		}
	  }

    function enterKeyHandler() {
      if (!$selectedNode) {
        return;
      }
		
		pos = 0;
      deferred.resolve(decodeURIComponent($selectedNode.attr("title")));
      $specialCharDialog.modal('hide');
    }

    function keyDownEventHandler(event) {
      event.preventDefault();
      var keyCode = event.keyCode;
      if (keyCode === undefined || keyCode === null) {
			return;
      }
      // check arrowKeys match
      if (ARROW_KEYS.indexOf(keyCode) > -1) {
			arrowKeyHandler(keyCode);
      } else if (keyCode === ENTER_KEY) {
			enterKeyHandler();
      }
      return false;
    }

    // remove class
    removeActiveClass($specialCharNode);
    // find selected node
    if (text) {
      for (var i = 0; i < $specialCharNode.length; i++) {
        var $checkNode = $($specialCharNode[i]);
        if ($checkNode.text() === text) {
          addActiveClass($checkNode);
          currentRow = Math.ceil((i + 1) / COLUMN_LENGTH);
          currentColumn = (i + 1) % COLUMN_LENGTH;
        }
      }
    }

    $specialCharDialog.one('shown.bs.modal', function () {
      $(document).on('keydown', keyDownEventHandler);
      $specialCharNode.on('click', function (event) {
        event.preventDefault();
		  pos = 0;
        deferred.resolve(decodeURIComponent(event.currentTarget.title));
        $specialCharDialog.modal('hide');
      });
		$specialCharNode.mouseenter(function() {
			clear();
			$(this).css("border", "1px solid blue").css("background-color", "aliceblue");
			$selectedNode = $(this);
			var thisid = $(this).attr("id") + "";
			pos = thisid.substr(5);
		});
		$specialCharNode.mouseleave(function() {
			clear();
		});
    }).one('hidden.bs.modal', function () {
      $specialCharNode.off('click');
      $(document).off('keydown', keyDownEventHandler);
      if (deferred.state() === 'pending') {
        deferred.reject();
      }
    }).modal('show');

    // tooltip
    /*$dialog.find('span').tooltip({
      container: $specialCharDialog.find('.form-group'),
      trigger: 'hover',
      placement: 'top'
    });*/

    // $editable blur
    $editable.blur();
	  
	  function clear() {
		  $specialCharNode.css("border", "1px solid black").css("background-color", "white");
		  $selectedNode = null;
	  }
  });
};

/**
 * @class plugin.specialChar
 *
 * Special Characters Plugin
 *
 * ### load script
 *
 * ```
 * < script src="plugin/summernote-ext-specialchar.js"></script >
 * ```
 *
 * ### use a plugin in toolbar
 * ```
 *    $("#editor").summernote({
 *    ...
 *    toolbar : [
 *        ['group', [ 'specialChar' ]]
 *    ]
 *    ...    
 *    });
 * ```
 */
$.summernote.addPlugin({
  /** @property {String} name name of plugin */
  name: 'specialChar',
  /**
   * @property {Object} buttons
   * @property {function(object): string} buttons.specialChar
   */
  buttons: {
    specialChar: function (lang, options) {
      return tmpl.iconButton(options.iconPrefix + 'circle-o ' + options.iconPrefix, {
        event: 'showSpecialCharDialog',
        title: lang.specialChar.specialChar,
        hide: true
      });
    }
  },

  /**
   * @property {Object} dialogs
   * @property {function(object, object): string} dialogs.specialChar
  */
  dialogs: {
    specialChar: function (lang) {
      var body = '<div class="form-group row-fluid">' +
                    makeSpecialCharSetTable()[0].outerHTML +
                 '</div>';
      return tmpl.dialog('note-specialchar-dialog', lang.specialChar.select, body);
    }
  },
  /**
   * @property {Object} events
   * @property {Function} events.showSpecialCharDialog
   */
  events: {
    showSpecialCharDialog: function (event, editor, layoutInfo) {
      var $dialog = layoutInfo.dialog(),
          $editable = layoutInfo.editable(),
          currentSpecialChar = getTextOnRange($editable);

      // save current range
      editor.saveRange($editable);

      showSpecialCharDialog($editable, $dialog, currentSpecialChar).then(function (selectChar) {
        // when ok button clicked

        // restore range
        editor.restoreRange($editable);
        
        // build node
        var $node = $('<span></span>').html(selectChar)[0];
		  //var $node = $(selectChar)[0];
        
        if ($node) {
          // insert character node
          editor.insertNode($editable, $node);
        }
      }).fail(function () {
        // when cancel button clicked
        editor.restoreRange($editable);
      });
    }
  },

  // define language
  langs: {
    'en-US': {
      specialChar: {
        specialChar: 'Special Characters',
        select: 'Select Special characters'
      }
    },
    'ko-KR': {
      specialChar: {
        specialChar: '특수문자',
        select: '특수문자를 선택하세요'
      }
    }
  }
});

});