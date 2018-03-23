/*
 * Emoji plugin for summernote [https://github.com/summernote/summernote]
 * Canonical - https://github.com/nilobarp/summernote-ext-emoji
 */

odoo.define('muk_web_utils.summernote_ext_emoji', function (require) {
'use strict';

var tmpl = $.summernote.renderer.getTemplate();
var emojis = [ 
	'bowtie', 'smile', 'laughing', 'blush', 'smiley', 'relaxed',
	'smirk', 'heart_eyes', 'kissing_heart', 'kissing_closed_eyes',
	'flushed', 'relieved', 'satisfied', 'grin', 'wink',
	'stuck_out_tongue_winking_eye', 'stuck_out_tongue_closed_eyes',
	'grinning', 'kissing', 'kissing_smiling_eyes', 'stuck_out_tongue',
	'sleeping', 'worried', 'frowning', 'anguished', 'open_mouth',
	'grimacing', 'confused', 'hushed', 'expressionless', 'unamused',
	'sweat_smile', 'sweat', 'disappointed_relieved', 'weary',
	'pensive', 'disappointed', 'confounded', 'fearful', 'cold_sweat',
	'persevere', 'cry', 'sob', 'joy', 'astonished', 'scream',
	'neckbeard', 'tired_face', 'angry', 'rage', 'triumph', 'sleepy',
	'yum', 'mask', 'sunglasses', 'dizzy_face', 'imp', 'smiling_imp',
	'neutral_face', 'no_mouth', 'innocent', 'alien', 'yellow_heart',
	'blue_heart', 'purple_heart', 'heart', 'green_heart',
	'broken_heart', 'heartbeat', 'heartpulse', 'two_hearts',
	'revolving_hearts', 'cupid', 'sparkling_heart', 'sparkles', 'star',
	'star2', 'dizzy', 'boom', 'collision', 'anger', 'exclamation',
	'question', 'grey_exclamation', 'grey_question', 'zzz', 'dash',
	'sweat_drops', 'notes', 'musical_note', 'fire', 'hankey', 'poop',
	'shit', '+1', 'thumbsup', '-1', 'thumbsdown', 'ok_hand', 'punch',
	'facepunch', 'fist', 'v', 'wave', 'hand', 'raised_hand',
	'open_hands', 'point_up', 'point_down', 'point_left',
	'point_right', 'raised_hands', 'pray', 'point_up_2', 'clap',
	'muscle', 'metal', 'fu', 'walking', 'runner', 'running', 'couple',
	'family', 'two_men_holding_hands', 'two_women_holding_hands',
	'dancer', 'dancers', 'ok_woman', 'no_good',
	'information_desk_person', 'raising_hand', 'bride_with_veil',
	'person_with_pouting_face', 'person_frowning', 'bow', 'couplekiss',
	'couple_with_heart', 'massage', 'haircut', 'nail_care', 'boy',
	'girl', 'woman', 'man', 'baby', 'older_woman', 'older_man',
	'person_with_blond_hair', 'man_with_gua_pi_mao', 'man_with_turban',
	'construction_worker', 'cop', 'angel', 'princess', 'smiley_cat',
	'smile_cat', 'heart_eyes_cat', 'kissing_cat', 'smirk_cat',
	'scream_cat', 'crying_cat_face', 'joy_cat', 'pouting_cat',
	'japanese_ogre', 'japanese_goblin', 'see_no_evil', 'hear_no_evil',
	'speak_no_evil', 'guardsman', 'skull', 'feet', 'lips', 'kiss',
	'droplet', 'ear', 'eyes', 'nose', 'tongue', 'love_letter',
	'bust_in_silhouette', 'busts_in_silhouette', 'speech_balloon',
	'thought_balloon', 'feelsgood', 'finnadie', 'goberserk', 'godmode',
	'hurtrealbad', 'rage1', 'rage2', 'rage3', 'rage4', 'suspect',
	'trollface', 'sunny', 'umbrella', 'cloud', 'snowflake', 'snowman',
	'zap', 'cyclone', 'foggy', 'ocean', 'cat', 'dog', 'mouse',
	'hamster', 'rabbit', 'wolf', 'frog', 'tiger', 'koala', 'bear',
	'pig', 'pig_nose', 'cow', 'boar', 'monkey_face', 'monkey', 'horse',
	'racehorse', 'camel', 'sheep', 'elephant', 'panda_face', 'snake',
	'bird', 'baby_chick', 'hatched_chick', 'hatching_chick', 'chicken',
	'penguin', 'turtle', 'bug', 'honeybee', 'ant', 'beetle', 'snail',
	'octopus', 'tropical_fish', 'fish', 'whale', 'whale2', 'dolphin',
	'cow2', 'ram', 'rat', 'water_buffalo', 'tiger2', 'rabbit2',
	'dragon', 'goat', 'rooster', 'dog2', 'pig2', 'mouse2', 'ox',
	'dragon_face', 'blowfish', 'crocodile', 'dromedary_camel',
	'leopard', 'cat2', 'poodle', 'paw_prints', 'bouquet',
	'cherry_blossom', 'tulip', 'four_leaf_clover', 'rose', 'sunflower',
	'hibiscus', 'maple_leaf', 'leaves', 'fallen_leaf', 'herb',
	'mushroom', 'cactus', 'palm_tree', 'evergreen_tree',
	'deciduous_tree', 'chestnut', 'seedling', 'blossom', 'ear_of_rice',
	'shell', 'globe_with_meridians', 'sun_with_face',
	'full_moon_with_face', 'new_moon_with_face', 'new_moon',
	'waxing_crescent_moon', 'first_quarter_moon',
	'waxing_gibbous_moon', 'full_moon', 'waning_gibbous_moon',
	'last_quarter_moon', 'waning_crescent_moon',
	'last_quarter_moon_with_face', 'first_quarter_moon_with_face',
	'moon', 'earth_africa', 'earth_americas', 'earth_asia', 'volcano',
	'milky_way', 'partly_sunny', 'octocat', 'squirrel', 'bamboo',
	'gift_heart', 'dolls', 'school_satchel', 'mortar_board', 'flags',
	'fireworks', 'sparkler', 'wind_chime', 'rice_scene',
	'jack_o_lantern', 'ghost', 'santa', 'christmas_tree', 'gift',
	'bell', 'no_bell', 'tanabata_tree', 'tada', 'confetti_ball',
	'balloon', 'crystal_ball', 'cd', 'dvd', 'floppy_disk', 'camera',
	'video_camera', 'movie_camera', 'computer', 'tv', 'iphone',
	'phone', 'telephone', 'telephone_receiver', 'pager', 'fax',
	'minidisc', 'vhs', 'sound', 'speaker', 'mute', 'loudspeaker',
	'mega', 'hourglass', 'hourglass_flowing_sand', 'alarm_clock',
	'watch', 'radio', 'satellite', 'loop', 'mag', 'mag_right',
	'unlock', 'lock', 'lock_with_ink_pen', 'closed_lock_with_key',
	'key', 'bulb', 'flashlight', 'high_brightness', 'low_brightness',
	'electric_plug', 'battery', 'calling', 'email', 'mailbox',
	'postbox', 'bath', 'bathtub', 'shower', 'toilet', 'wrench',
	'nut_and_bolt', 'hammer', 'seat', 'moneybag', 'yen', 'dollar',
	'pound', 'euro', 'credit_card', 'money_with_wings', 'e-mail',
	'inbox_tray', 'outbox_tray', 'envelope', 'incoming_envelope',
	'postal_horn', 'mailbox_closed', 'mailbox_with_mail',
	'mailbox_with_no_mail', 'door', 'smoking', 'bomb', 'gun', 'hocho',
	'pill', 'syringe', 'page_facing_up', 'page_with_curl',
	'bookmark_tabs', 'bar_chart', 'chart_with_upwards_trend',
	'chart_with_downwards_trend', 'scroll', 'clipboard', 'calendar',
	'date', 'card_index', 'file_folder', 'open_file_folder',
	'scissors', 'pushpin', 'paperclip', 'black_nib', 'pencil2',
	'straight_ruler', 'triangular_ruler', 'closed_book', 'green_book',
	'blue_book', 'orange_book', 'notebook',
	'notebook_with_decorative_cover', 'ledger', 'books', 'bookmark',
	'name_badge', 'microscope', 'telescope', 'newspaper', 'football',
	'basketball', 'soccer', 'baseball', 'tennis', '8ball',
	'rugby_football', 'bowling', 'golf', 'mountain_bicyclist',
	'bicyclist', 'horse_racing', 'snowboarder', 'swimmer', 'surfer',
	'ski', 'spades', 'hearts', 'clubs', 'diamonds', 'gem', 'ring',
	'trophy', 'musical_score', 'musical_keyboard', 'violin',
	'space_invader', 'video_game', 'black_joker',
	'flower_playing_cards', 'game_die', 'dart', 'mahjong', 'clapper',
	'memo', 'pencil', 'book', 'art', 'microphone', 'headphones',
	'trumpet', 'saxophone', 'guitar', 'shoe', 'sandal', 'high_heel',
	'lipstick', 'boot', 'shirt', 'tshirt', 'necktie', 'womans_clothes',
	'dress', 'running_shirt_with_sash', 'jeans', 'kimono', 'bikini',
	'ribbon', 'tophat', 'crown', 'womans_hat', 'mans_shoe',
	'closed_umbrella', 'briefcase', 'handbag', 'pouch', 'purse',
	'eyeglasses', 'fishing_pole_and_fish', 'coffee', 'tea', 'sake',
	'baby_bottle', 'beer', 'beers', 'cocktail', 'tropical_drink',
	'wine_glass', 'fork_and_knife', 'pizza', 'hamburger', 'fries',
	'poultry_leg', 'meat_on_bone', 'spaghetti', 'curry',
	'fried_shrimp', 'bento', 'sushi', 'fish_cake', 'rice_ball',
	'rice_cracker', 'rice', 'ramen', 'stew', 'oden', 'dango', 'egg',
	'bread', 'doughnut', 'custard', 'icecream', 'ice_cream',
	'shaved_ice', 'birthday', 'cake', 'cookie', 'chocolate_bar',
	'candy', 'lollipop', 'honey_pot', 'apple', 'green_apple',
	'tangerine', 'lemon', 'cherries', 'grapes', 'watermelon',
	'strawberry', 'peach', 'melon', 'banana', 'pear', 'pineapple',
	'sweet_potato', 'eggplant', 'tomato', 'corn', 'house',
	'house_with_garden', 'school', 'office', 'post_office', 'hospital',
	'bank', 'convenience_store', 'love_hotel', 'hotel', 'wedding',
	'church', 'department_store', 'european_post_office',
	'city_sunrise', 'city_sunset', 'japanese_castle',
	'european_castle', 'tent', 'factory', 'tokyo_tower', 'japan',
	'mount_fuji', 'sunrise_over_mountains', 'sunrise', 'stars',
	'statue_of_liberty', 'bridge_at_night', 'carousel_horse',
	'rainbow', 'ferris_wheel', 'fountain', 'roller_coaster', 'ship',
	'speedboat', 'boat', 'sailboat', 'rowboat', 'anchor', 'rocket',
	'airplane', 'helicopter', 'steam_locomotive', 'tram',
	'mountain_railway', 'bike', 'aerial_tramway', 'suspension_railway',
	'mountain_cableway', 'tractor', 'blue_car', 'oncoming_automobile',
	'car', 'red_car', 'taxi', 'oncoming_taxi', 'articulated_lorry',
	'bus', 'oncoming_bus', 'rotating_light', 'police_car',
	'oncoming_police_car', 'fire_engine', 'ambulance', 'minibus',
	'truck', 'train', 'station', 'train2', 'bullettrain_front',
	'bullettrain_side', 'light_rail', 'monorail', 'railway_car',
	'trolleybus', 'ticket', 'fuelpump', 'vertical_traffic_light',
	'traffic_light', 'warning', 'construction', 'beginner', 'atm',
	'slot_machine', 'busstop', 'barber', 'hotsprings',
	'checkered_flag', 'crossed_flags', 'izakaya_lantern', 'moyai',
	'circus_tent', 'performing_arts', 'round_pushpin',
	'triangular_flag_on_post' 
];

/* IE polyfill */
if (!Array.prototype.filter) {
	Array.prototype.filter = function(fun /* , thisp */) {
		var len = this.length >>> 0;
		if (typeof fun != "function")
			throw new TypeError();

		var res = [];
		var thisp = arguments[1];
		for (var i = 0; i < len; i++) {
			if (i in this) {
				var val = this[i];
				if (fun.call(thisp, val, i, this))
					res.push(val);
			}
		}
		return res;
	};
}

var addListener = function() {
	$('body').on('click', '#emoji-filter', function(e) {
		e.stopPropagation();
		$('#emoji-filter').focus();
	});
	$('body').on('keyup', '#emoji-filter', function(e) {
		var filteredList = filterEmoji($('#emoji-filter').val());
		$("#emoji-dropdown .emoji-list").html(filteredList);
	});
};

var dropdown = function() {
	return '<div class="dropdown-menu dropdown-keep-open" id="emoji-dropdown" style="width: 200px; padding: 10px;">'
			+ '<div class="row">'
			+ '<div class="col-md-12">'
			+ '<input type="text" class="form-control" id="emoji-filter"/>'
			+ '<br/>'
			+ '</div>'
			+ '</div>'
			+ '<div class="emoji-list">'
			+ render(emojis) + '</div>' + '</div>';
};

var render = function(emojis) {
	var emoList = '';
	/* limit list to 24 images */
	var emojis = emojis.slice(0, 24);
	var chunks = chunkEmoji(emojis, 4);
	for (var j = 0; j < chunks.length; j++) {
		emoList += '<div class="row">';
		for (var i = 0; i < chunks[j].length; i++) {
			var emo = chunks[j][i];
			emoList += '<div class="col-xs-3">'
					+ '<a href="javascript:void(0)" data-event="selectEmoji" data-value="'
					+ emo
					+ '"><span style="background: url(\''
					+ '/muk_web_utils/static/lib/summernote/emoji/pngs/'
					+ emo
					+ '.png\'); display: inline-block; width: 24px; height: 24px; background-size: 24px;"></span></a>'
					+ '</div>';
		}
		emoList += '</div>';
	}

	return emoList;
};

var chunkEmoji = function(list, chunkSize) {
		var R = [];
		for (var i = 0; i < list.length; i += chunkSize)
			R.push(list.slice(i, i + chunkSize));
		return R;
	}

var filterEmoji = function(value) {
	var filtered = emojis.filter(function(el) {
		return el.indexOf(value) > -1;
	});
	return render(filtered);
};

$.summernote.addPlugin({
	buttons : {
		"emoji" : function(lang, options) {
			addListener();
			return tmpl.iconButton(options.iconPrefix + 'smile-o', {
				title : 'Emoji',        
                value : 'Emoji', 
				hide : true,
				dropdown : dropdown()
			});
		}
	},

	events : {
		selectEmoji : function(event, editor, layoutInfo, value) {
			var $editable = layoutInfo.editable();
			var img = new Image();
            img.src = '/muk_web_utils/static/lib/summernote/emoji/pngs/' + value + '.png';
            img.alt = value;
            img.className = 'emoji-icon-inline';
			editor.insertNode($editable, img);
		}
	}
});

});