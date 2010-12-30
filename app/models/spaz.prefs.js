var Spaz;
if (!Spaz) { Spaz = {}; };

/***********
 Spaz.Prefs
************/
if (!Spaz.Prefs) Spaz.Prefs = {};


Spaz.Prefs.defaultPreferences = {
	'usemarkdown': true,

	'window-x': 50,
	'window-y': 50,
	'window-width': 297,
	'window-height': 600,
	'window-alpha': 100,
	'window-hideafterdelay': true,
	'window-restoreonupdates': true,
	'window-shownotificationpopups': true,
	'window-minimizetosystray': true,
	'window-minimizeatstartup': false,
	'window-minimizeonbackground': false,
	'window-restoreonactivate': true,

	'window-notificationposition': 'topRight',
	'window-notificationhidedelay': 6,
	'window-notificationmethod': 'internal', // 'growl' or 'internal'
	'window-notificationmax': 10, // how many notifications can be raised at once (for messages)

	'window-showcontextmenus': true,
	'window-tooltiphidedelay': 8000,
	'window-tooltipdelay': 500,
	'window-dropshadow': true,

	'notify-messages':false,
	'notify-dms':true,
	'notify-mentions':true,
	'notify-totals':true,
	'notify-searchresults':false,
	'notify-listmessages':false,

	// 'theme-userstylesheet':null,
	'theme-basetheme': 'Leopaz',

	'sound-enabled': true,
	'wilhelm-enabled': true,

	'network-refreshinterval': 300000,
	'network-autoadjustrefreshinterval': true,
	'network-airhandlehttpauth': false,

	'debug-enabled': false,
	'inspector-enabled': false,

	'sound-url-update':	 'app:/sounds/TokyoTrainStation/CSnd.mp3',
	'sound-url-startup': 'app:/sounds/TokyoTrainStation/On.mp3',
	'sound-url-shutdown':'app:/sounds/TokyoTrainStation/Off.mp3',
	'sound-url-new':	 'app:/sounds/TokyoTrainStation/New.mp3',
	'sound-url-wilhelm': 'app:/sounds/wilhelm.mp3',

	'timeline-scrollonupdate': false,
	'timeline-maxentries': 325,
	'timeline-maxentries-dm': 25,
	'timeline-maxentries-reply': 50,
	'timeline-loadonswitch': true,
	'timeline-friends-getcount': 40,
	'timeline-replies-getcount': 20,
	'timeline-dm-getcount': 10,
	'timeline-keyboardnavwrap': false,

	'timeline-home-pager-count-max': 200, //max allowed by twitter api
	'timeline-home-pager-count': 50, //setting via adjustable prefs
	'timeline-direct-pager-count-max': 200,
	'timeline-direct-pager-count': 25,
	'timeline-replies-pager-count-max': 200,
	'timeline-replies-pager-count': 25,
	'timeline-user-pager-count-max': 200,
	'timeline-user-pager-count': 50,
	'timeline-search-pager-count-max': 100,
	'timeline-search-pager-count': 50,

	'screennames-cache-max': 150,

	'checkupdate': true,
	'checkupdate-testversions': false,

	'url-shortener': 'short.ie',

	'file-uploader': 'drippic',

	'services-twitpic-sharepassword': false,

	'services-pingfm-userappkey': '',
	'services-pingfm-enabled': false,
	'services-pingfm-sendreplies': false,
	'services-pingfm-updatetype': 'default',

	'services-shortie-email': '',
	'services-shortie-secretkey' : '',
    
	'services-bitly-login': '',
	'services-bitly-apikey' : '',

	'twitter-api-base-url': 'https://twitter.com/',
	'twitter-base-url': 'http://twitter.com/',

	'twitter-source': 'spaz',

	'twitter-disable-direct-posting':false,
	
	'twitter-enable-userstream':true,

	'dock-refreshinterval': 500,
	'dock-displayunreadbadge': true,
	'dock-unreadbadgecolor': "red",
	'dock-unreadbadgeshape': "classic",

	'entryboxhint': "What are you doing?",

	'key-toggle': "+F",
	'key-newEntry': "+T",
	'key-reply': "+Shift+@",
	'key-reloadTimeline': "Shift+F5",
	'key-showShortenWindow': "+Shift+A",
	'key-showUploadImageWindow': "+Shift+U",
	'key-highlight-code': "+R"
};


// this maps methods to pref keys that should be
// called when they are changed
/*
	the methods:
	setUI: sets the exposed prefs UI for this preference
	onChange: things to execute when the value of this pref changes (like, say, changing the opacity of the window)
	check: make sure the current value is a "sane" one, within reasonable limits or a proper boolean, etc
	setFromUI: converts the UI value into the internally stored value, if needed (say, minutes into microseconds)
*/
Spaz.Prefs.changeMethods = {
	'usemarkdown': {
		setUI: function(value) {
			$('#usemarkdown').attr('checked', value);
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},

	'window-x': {
		setUI: function(value) {},
		onSet: function(key, value) {
			return parseInt(value, 10) || 50;
		},
		onGet: function(key, value) {
			return parseInt(value, 10) || 50;
		}
	},
	'window-y': {
		setUI: function(value) {},
		onSet: function(key, value) {
			return parseInt(value, 10) || 50;
		},
		onGet: function(key, value) {
			return parseInt(value, 10) || 50;
		}
	},
	'window-width': {
		setUI: function(value) {},
		onChange: function(value) {},
		check: function() {}
	},
	'window-height': {
		setUI: function(value) {},
		onSet: function(key, value) {
			return parseInt(value, 10);
		},
		onGet: function(key, value) {
			return parseInt(value, 10);
		}
	},
	'window-alpha': {
		setUI: function(value) {
			$('#window-alpha').val(parseInt(value, 10));
		},
		onChange: function(value) {
			//alert(percentage+"%");
			Spaz.Windows.setWindowOpacity(value);
		},
		onGet: function(key, value) {
			if (value > 100) {
				value = 100;
			} else if (value < 10) {
				value = 10;
			}
			return value;
		},
		onSet: function(key, value) {
			if (value > 100) {
				value = 100;
			} else if (value < 10) {
				value = 10;
			}
			return value;
		}
	},
	'window-hideafterdelay': {
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},
	'window-restoreonupdates': {
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},
	'window-shownotificationpopups': {
		setUI: function(value) {
			$('#window-shownotificationpopups').attr('checked', value);
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},
	'window-notificationposition': {
		setUI: function(value) {
			$('#window-notificationposition').val(value);
		}
	},
	'window-notificationmethod': {
		setUI: function(value) {
			$('#window-notificationmethod').val(value);
		},
		onGet: function(key, value) {
			if (value !== 'growl') {
				return 'internal';
			}
			return value;
		},
		onSet: function(key, value) {
			if (value !== 'growl') {
				return 'internal';
			}
			return value;
		},
		check: function() {
			if (Spaz.Prefs.get('window-notificationmethod') !== 'growl') {
				Spaz.Prefs.set('window-notificationmethod', 'internal');
				$('#window-notificationposition').removeAttr("disabled");
			} else { // is growl
				$('#window-notificationposition').attr("disabled","disabled");;
			}
	   }
	},
	'window-minimizetosystray': {
		setUI: function(value) {
			$('#window-minimizetosystray').attr('checked', value);
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},
	'window-minimizeatstartup': {
		setUI: function(value) {
			$('#window-minimizeatstartup').attr('checked', value);
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},
	'window-minimizeonbackground': {
		setUI: function(value) {
			$('#window-minimizeonbackground').attr('checked', value);
		},
		onChange: function(value) {
			Spaz.Windows.enableMinimizeOnBackground(value);
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},
	'window-restoreonactivate': {
		setUI: function(value) {
			$('#window-restoreonactivate').attr('checked', value);
		},
		onChange: function(value) {
			Spaz.Windows.enableRestoreOnActivate(value);
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},
	'window-dropshadow': {
		setUI: function(value) {
			$('#window-dropshadow').attr('checked', value);
		},
		onChange: function(value) {
			Spaz.Windows.enableDropShadow(value);
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},
	'timeline-keyboardnavwrap': {
		setUI: function(value) {
			$('#timeline-keyboardnavwrap').attr('checked', value);
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},
	'timeline-home-pager-count': {
		setUI: function(value) {
			var max = Spaz.Prefs.defaultPreferences['timeline-home-pager-count-max'];
			var sel = $('#timeline-home-pager-count');
			if (sel.children().length == 0) {
				var i = 0;
				while ((i+=10) <= max) {
					sel.append('<option value="' + i + '">' + i + '</option>');
				}
			}
			sel.val(value);
		},
		onGet: function(key, value) {
			var max = Spaz.Prefs.defaultPreferences[key + '-max'];
			return parseInt(value) < max ? parseInt(value) : max;
		},
		onSet: function(key, value) {
			Spaz.Timelines.friends.twit.data[SPAZCORE_SECTION_HOME].lastid = 1;
			Spaz.Timelines.friends.twit.data[SPAZCORE_SECTION_FRIENDS].lastid = 1;
			var max = Spaz.Prefs.defaultPreferences[key + '-max'];
			return parseInt(value) < max ? parseInt(value) : max;
		}
	},
	'timeline-direct-pager-count': {
		setUI: function(value) {
			var max = Spaz.Prefs.defaultPreferences['timeline-direct-pager-count-max'];
			var sel = $('#timeline-direct-pager-count');
			if (sel.children().length == 0) {
				var i = 0;
				while ((i+=10) <= max) {
					sel.append('<option value="' + i + '">' + i + '</option>');
				}
			}
			sel.val(value);
		},
		onGet: function(key, value) {
			var max = Spaz.Prefs.defaultPreferences[key + '-max'];
			return parseInt(value) < max ? parseInt(value) : max;
		},
		onSet: function(key, value) {
			Spaz.Timelines.friends.twit.data[SPAZCORE_SECTION_DMS].lastid = 1;
			var max = Spaz.Prefs.defaultPreferences[key + '-max'];
			return parseInt(value) < max ? parseInt(value) : max;
		}
	},
	'timeline-replies-pager-count': {
		setUI: function(value) {
			var max = Spaz.Prefs.defaultPreferences['timeline-replies-pager-count-max'];
			var sel = $('#timeline-replies-pager-count');
			if (sel.children().length == 0) {
				var i = 0;
				while ((i+=10) <= max) {
					sel.append('<option value="' + i + '">' + i + '</option>');
				}
			}
			sel.val(value);
		},
		onGet: function(key, value) {
			var max = Spaz.Prefs.defaultPreferences[key + '-max'];
			return parseInt(value) < max ? parseInt(value) : max;
		},
		onSet: function(key, value) {
			Spaz.Timelines.friends.twit.data[SPAZCORE_SECTION_REPLIES].lastid = 1;
			var max = Spaz.Prefs.defaultPreferences[key + '-max'];
			return parseInt(value) < max ? parseInt(value) : max;
		}
	},
	'timeline-user-pager-count': {
		setUI: function(value) {},
		onGet: function(key, value) {
			var max = Spaz.Prefs.defaultPreferences[key + '-max'];
			return parseInt(value) < max ? parseInt(value) : max;
		},
		onSet: function(key, value) {
			var max = Spaz.Prefs.defaultPreferences[key + '-max'];
			return parseInt(value) < max ? parseInt(value) : max;
		}
	},
	'timeline-search-pager-count': {
		setUI: function(value) {},
		onGet: function(key, value) {
			var max = Spaz.Prefs.defaultPreferences[key + '-max'];
			return parseInt(value) < max ? parseInt(value) : max;
		},
		onSet: function(key, value) {
			var max = Spaz.Prefs.defaultPreferences[key + '-max'];
			return parseInt(value) < max ? parseInt(value) : max;
		}
	},

	// 'theme-userstylesheet':{
	//	setUI: function(value){
	//		$('#theme-userstylesheet').val(Spaz.Prefs.get('theme-userstylesheet'));
	//	},
	//	onChange: function(value) {
	//		if (value) {
	//			$('#UserCSSOverride').text(Spaz.Themes.loadUserStylesFromURL(value));
	//		}
	//	}
	// },


	'notify-messages': {
		setUI: function(value) {
			$('#notify-messages').attr('checked', value);
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},
	'notify-dms': {
		setUI: function(value) {
			$('#notify-dms').attr('checked', value);
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},
	'notify-mentions': {
		setUI: function(value) {
			$('#notify-mentions').attr('checked', value);
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},
	'notify-totals': {
		setUI: function(value) {
			$('#notify-totals').attr('checked', value);
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},
	'notify-searchresults': {
		setUI: function(value) {
			$('#notify-searchresults').attr('checked', value);
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},
	'notify-listmessages': {
		setUI: function(value) {
			$('#notify-listmessages').attr('checked', value);
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},



	'theme-basetheme': {
		setUI: function(value) {
			$('#theme-basetheme').val(value);
		},
		onChange: function(value) {
			Spaz.Themes.setCurrentTheme();
		},
		onGet: function(key, value) {
			if (Spaz.Themes.validThemes.indexOf(value) != -1) {
				return value;
			} else {
				return 'Leopaz';
			}
		},
		onSet: function(key, value) {
			var rs = window.confirm($L('The main window should be reloaded when switching themes.\n\nDo you want to reload it now?'));
			
			if (rs) {
				Spaz.reloadHTMLDoc();
			}
			
			if (Spaz.Themes.validThemes.indexOf(value) != -1) {
				return value;
			} else {
				return 'Leopaz';
			}
		}
	},


	'sound-enabled': {
		setUI: function(value) {
			$('#sound-enabled').attr('checked', value);
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},

	'wilhelm-enabled': {
		setUI: function(value) {
			$('#wilhelm-enabled').attr('checked', value);
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},

	'twitter-base-urls': {
		setUI: function(value) {
			$('#twitter-base-urls').val(value);
		},
		onChange: function(value) {
			if (value) {

				switch (value) {

				case 'identica':
					var baseurl = 'http://identi.ca/';
					var apiurl = 'http://identi.ca/api/';
					break;

				default:
					var baseurl = 'http://twitter.com/';
					var apiurl = 'https://twitter.com/';
					break;
				}
				Spaz.Prefs.set('twitter-api-base-url', apiurl);
				Spaz.Prefs.changeMethods['twitter-api-base-url'].setUI(apiurl);
				Spaz.Prefs.set('twitter-base-url', baseurl);
				Spaz.Prefs.changeMethods['twitter-base-url'].setUI(baseurl);
			}
		}
	},
	'twitter-api-base-url': {
		setUI: function(value) {
			sch.debug('value:' + value);
			$('#twitter-api-base-url').val(value);
		}
	},
	'twitter-base-url': {
		setUI: function(value) {
			sch.debug('value:' + value);
			$('#twitter-base-url').val(value);
		}

	},

	'twitter-disable-direct-posting': {
		setUI: function(value) {
			$('#twitter-disable-direct-posting').attr('checked', value);
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},
	
	'twitter-enable-userstream': {
		setUI: function(value) {
			$('#twitter-enable-userstream').attr('checked', value);
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			value = !!value;
			sch.trigger('pref_user_stream_changed', document, value);
			return value;
		}
	},

	'services-shortie-secretkey': {
		setUI: function(value) {
			if (value || value == '') {
				$('#services-shortie-secretkey').val(value);
				sch.debug('Shortie secretkey set...');
			} else {
				$('#services-shortie-secretkey').attr('value', '');
				sch.debug('Shortie secret key');
			}
		},
		onGet: function(key, value) {
			if (!value) {
				return null;
			}
			return value;
		},
		onSet: function(key, value) {
			if (!value) {
				return null;
			}
			return value;
		}
	},


	'services-shortie-email': {
		setUI: function(value) {
			if (value && value !== '') {
				$('#services-shortie-email').val(value);
				sch.debug('Shortie email set...');
			} else {
				$('#services-shortie-email').attr('value', '');
				sch.debug('Shortie secret key');
			}
		},
		onGet: function(key, value) {
			if (!value) {
				return null;
			}
			return value;
		},
		onSet: function(key, value) {
			if (!value) {
				return null;
			}
			return value;
		}
	},
    
	'services-bitly-login': {
		setUI: function(value) {
			if (value || value == '') {
				$('#services-bitly-login').val(value);
				sch.debug('Bit.ly login set...');
			} else {
				$('#services-bitly-login').attr('value', '');
				sch.debug('Bit.ly login');
			}
		},
		onGet: function(key, value) {
			if (!value) {
				return null;
			}
			return value;
		},
		onSet: function(key, value) {
			if (!value) {
				return null;
			}
			return value;
		}
	},


	'services-bitly-apikey': {
		setUI: function(value) {
			if (value && value !== '') {
				$('#services-bitly-apikey').val(value);
				sch.debug('Bit.ly API key set...');
			} else {
				$('#services-bitly-apikey').attr('value', '');
				sch.debug('Bit.ly API key');
			}
		},
		onGet: function(key, value) {
			if (!value) {
				return null;
			}
			return value;
		},
		onSet: function(key, value) {
			if (!value) {
				return null;
			}
			return value;
		}
	},

	'services-pingfm-userappkey': {
		setUI: function(value) {
			sch.debug('value:' + value);

			if (value && value.match(/[a-f0-9]{32}-[0-9]{10}/i)) {
				$('#services-pingfm-userappkey').val(value);
				sch.debug('Valid Ping.fm API key');
			} else {
				sch.debug('invalid!');
				$('#services-pingfm-userappkey').attr('value', '');
				sch.debug('Invalid Ping.fm API key');
				// $('#services-pingfm-userappkey').val();
			}
		},
		onGet: function(key, value) {
			if (value && value.match(/[a-f0-9]{32}-[0-9]{10}/i)) {
				return value;
			}
			return null;
		},
		onSet: function(key, value) {
			if (value && value.match(/[a-f0-9]{32}-[0-9]{10}/i)) {
				return value;
			}
			sch.warn('invalid pingfm api key');
			return null;
		}
	},
	'services-pingfm-enabled': {
		setUI: function(value) {
			$('#services-pingfm-enabled').attr('checked', value);
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},
	'services-pingfm-sendreplies': {
		setUI: function(value) {
			$('#services-pingfm-sendreplies').attr('checked', value);
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},


	'services-twitpic-sharepassword': {
		setUI: function(value) {
			$('#services-twitpic-sharepassword').attr('checked', value);
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},


	'network-refreshinterval': {
		setUI: function(value) {
			$('#network-refreshinterval').val(parseInt(value, 10) / 60000);

			var minutes = parseInt(value, 10) / 60000;
			var refperhour = 60 / minutes;
			var numreqs = Math.ceil(refperhour * 3);

			$('#refreshRateInfoValue').text(numreqs.toString())
		},
		onGet: function(key, value) {
			if (value < 2 * 60000) {
				value = 2 * 60000;
			}
			return value;
		},
		onSet: function(key, value) {
			if (value < 2 * 60000) {
				value = 2 * 60000;
			}
			return value;
		},
		setFromUI: function(value) {
			return value * 60000;
		}
	},
	'network-autoadjustrefreshinterval': {
		setUI: function(value) {
			$('#network-autoadjustrefreshinterval').attr('checked', value);
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},
	'network-airhandlehttpauth': {
		setUI: function(value) {
			$('#network-airhandlehttpauth').attr('checked', value);
		},
		onChange: function(value) {
			sch.debug('Setting HTTPAuth handling to ' + value);
			window.htmlLoader.authenticate = value;
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},


	'timeline-maxentries': {
		onGet: function(key, value) {
			if (value < 300) {
				value = 300;
			}
			if (value > 1000) {
				value = 1000;
			}
			return value;
		},
		onSet: function(key, value) {
			if (value < 300) {
				value = 300;
			}
			if (value > 1000) {
				value = 1000;
			}
			return value;
		}
	},
	'timeline-scrollonupdate': {
		setUI: function(value) {
			$('#timeline-scrollonupdate').attr('checked', value);
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},

	'checkupdate': {
		setUI: function(value) {
			$('#checkupdate').attr('checked', value);
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},
	'checkupdate-testversions': {
		setUI: function(value) {
			$('#checkupdate-testversions').attr('checked', value);
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},


	'debug-enabled': {
		setUI: function(value) {
			$('#debug-enabled').attr('checked', value);
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},
	
	'inspector-enabled': {
		setUI: function(value) {
			$('#inspector-enabled').attr('checked', value);
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		}
	},

	'screennames-cache-max': {
		onGet: function(key, value) {
			if (value < 150) {
				value = 150;
			}
			return value;
		},
		onSet: function(key, value) {
			if (value < 150) {
				value = 150;
			}
			return value;
		}
	},

	'dock-refreshinterval': {
		setUI: function(value) {
			$('#dock-refreshinterval').val(value);
		},
		onChange: function(value) {
			Spaz.Dock.sync();
		},
		onGet: function(key, value) {
			if (value < 200) {
				value = 200;
			}
			return value;
		},
		onSet: function(key, value) {
			if (value < 200) {
				value = 200;
			}
			return value;
		},
		setFromUI: function(value) {
			return value;
		}
	},
	'dock-displayunreadbadge': {
		setUI: function(value) {
			$('#dock-displayunreadbadge').attr('checked', value);
		},
		onChange: function(value) {
			Spaz.Dock.sync();
		},
		onGet: function(key, value) {
			return !!value;
		},
		onSet: function(key, value) {
			return !!value;
		},
		setFromUI: function(value) {
			return value;
		}
	},
	'dock-unreadbadgecolor': {
		setUI: function(value) {
			$('#dock-unreadbadgecolor').val(value);
		},
		onChange: function(value) {
			Spaz.Dock.setColor(value);
		}
	},

	'dock-unreadbadgeshape': {
		setUI: function(value) {
			$('#dock-unreadbadgeshape').val(value);
		},
		onChange: function(value) {
			Spaz.Dock.setShape(value);
		}
	}

};


/*
 * Set up SpazCore prefs and accounts objects
 */
Spaz.Prefs._prefs = new SpazPrefs(Spaz.Prefs.defaultPreferences, null, Spaz.Prefs.changeMethods);
Spaz.Prefs._accounts = {}; // a placeholder where we will store the SpazAccounts obj


/**
 * Initializes the preferences: sets prefs from Spaz.Prefs.defaultPreferences, loads prefs file, and sets up the prefs UI
 */
Spaz.Prefs.init = function() {

	sch.debug('LOADING');
	Spaz.Prefs._prefs.load();

	Spaz.Prefs._accounts = new SpazAccounts(Spaz.Prefs._prefs);

	sch.debug('THIS IS THE USERNAME:');
	sch.debug(Spaz.Prefs.getUsername()+'@'+Spaz.Prefs.getAccountType());

	sch.debug('SETTING SOUND FILE LOCATIONS');
	Spaz.Prefs.setSoundFileLocations();

	sch.debug('INIT UI');
	Spaz.Prefs.initUI();

};






Spaz.Prefs.initUI = function() {
	for (pkey in Spaz.Prefs._prefs._prefs) {
		//sch.debug(pkey);
		if (Spaz.Prefs.changeMethods[pkey]) {
			if (Spaz.Prefs.changeMethods[pkey].setUI) {
				Spaz.Prefs.changeMethods[pkey].setUI(Spaz.Prefs.get(pkey));
			}
			if (Spaz.Prefs.changeMethods[pkey].onChange) {
				Spaz.Prefs.changeMethods[pkey].onChange(Spaz.Prefs.get(pkey));
			}
		}
		$('#username').val(Spaz.Prefs.getUsername());
		//sch.debug('set #username val to'+$('#username').val());
		// $('#password').val(Spaz.Prefs.getPassword());
	}





	$('#window-alpha').bind('change', Spaz.Prefs.setFromUI);
	$('#usemarkdown').bind('change', Spaz.Prefs.setFromUI);
	$('#window-minimizetosystray').bind('change', Spaz.Prefs.setFromUI);
	$('#window-minimizeatstartup').bind('change', Spaz.Prefs.setFromUI);
	$('#window-minimizeonbackground').bind('change', Spaz.Prefs.setFromUI);
	$('#window-restoreonactivate').bind('change', Spaz.Prefs.setFromUI);
	$('#window-shownotificationpopups').bind('change', Spaz.Prefs.setFromUI);
	$('#window-notificationposition').bind('change', Spaz.Prefs.setFromUI);
	$('#window-notificationmethod').bind('change', Spaz.Prefs.setFromUI);
	$('#window-dropshadow').bind('change', Spaz.Prefs.setFromUI);
	$('#timeline-keyboardnavwrap').bind('change', Spaz.Prefs.setFromUI);
	$('#theme-basetheme').bind('change', Spaz.Prefs.setFromUI);

	$('#timeline-home-pager-count').bind('change', Spaz.Prefs.setFromUI);
	$('#timeline-direct-pager-count').bind('change', Spaz.Prefs.setFromUI);
	$('#timeline-replies-pager-count').bind('change', Spaz.Prefs.setFromUI);

	$('#notify-messages').bind('change', Spaz.Prefs.setFromUI);
	$('#notify-dms').bind('change', Spaz.Prefs.setFromUI);
	$('#notify-mentions').bind('change', Spaz.Prefs.setFromUI);
	$('#notify-totals').bind('change', Spaz.Prefs.setFromUI);
	$('#notify-searchresults').bind('change', Spaz.Prefs.setFromUI);
	$('#notify-listmessages').bind('change', Spaz.Prefs.setFromUI);

	$('#sound-enabled').bind('change', Spaz.Prefs.setFromUI);
	$('#wilhelm-enabled').bind('change', Spaz.Prefs.setFromUI);
	$('#checkupdate').bind('change', Spaz.Prefs.setFromUI);
	$('#checkupdate-testversions').bind('change', Spaz.Prefs.setFromUI);
	$('#network-refreshinterval').bind('change', Spaz.Prefs.setFromUI);
	$('#network-airhandlehttpauth').bind('change', Spaz.Prefs.setFromUI);
	$('#network-autoadjustrefreshinterval').bind('change', Spaz.Prefs.setFromUI);
	$('#debug-enabled').bind('change', Spaz.Prefs.setFromUI);
	$('#inspector-enabled').bind('change', Spaz.Prefs.setFromUI);
	$('#usemarkdown').bind('change', Spaz.Prefs.setFromUI);
	$('#timeline-scrollonupdate').bind('change', Spaz.Prefs.setFromUI);
	$('#twitter-base-urls').bind('change', Spaz.Prefs.setFromUI);
	$('#twitter-api-base-url').bind('change', Spaz.Prefs.setFromUI);
	$('#twitter-base-url').bind('change', Spaz.Prefs.setFromUI);
	$('#twitter-disable-direct-posting').bind('change', Spaz.Prefs.setFromUI);
	$('#twitter-enable-userstream').bind('change', Spaz.Prefs.setFromUI);
	$('#services-twitpic-sharepassword').bind('change', Spaz.Prefs.setFromUI);
	$('#services-pingfm-userappkey').bind('change', Spaz.Prefs.setFromUI);
	$('#services-pingfm-enabled').bind('change', Spaz.Prefs.setFromUI);
	$('#services-pingfm-sendreplies').bind('change', Spaz.Prefs.setFromUI);
	$('#services-shortie-email').bind('change', Spaz.Prefs.setFromUI);
	$('#services-shortie-secretkey').bind('change', Spaz.Prefs.setFromUI);
	$('#services-bitly-login').bind('change', Spaz.Prefs.setFromUI);
	$('#services-bitly-apikey').bind('change', Spaz.Prefs.setFromUI);
	$('#dock-refreshinterval').bind('change', Spaz.Prefs.setFromUI);
	$('#dock-displayunreadbadge').bind('change', Spaz.Prefs.setFromUI);
	$('#dock-unreadbadgecolor').bind('change', Spaz.Prefs.setFromUI);
	$('#dock-unreadbadgeshape').bind('change', Spaz.Prefs.setFromUI);

};


Spaz.Prefs.setFromUI = function(event) {
	// sch.debug(JSON.stringify(event));
	// sch.debug('event.srcElement.id='+event.srcElement);
	var id = event.srcElement.id

	sch.debug("setFromUI - " + id)

	if (event.srcElement.tagName == "INPUT" && event.srcElement.type == "checkbox") {
		if ($('#' + id).attr('checked')) {
			var val = true;
		} else {
			var val = false;
		}
	} else {
		var val = $('#' + id).val();
	}

	// rewrite the incoming value if needed
	if (Spaz.Prefs.changeMethods[id] && Spaz.Prefs.changeMethods[id].setFromUI) {
		val = Spaz.Prefs.changeMethods[id].setFromUI(val);
	}

	// set the preference
	Spaz.Prefs.set(id, val);

	if (Spaz.Prefs.changeMethods[id]) {
		if (Spaz.Prefs.changeMethods[id].check) {
			sch.debug("Calling check on " + id + " -- current val is " + Spaz.Prefs.get(id));
			Spaz.Prefs.changeMethods[id].check();
		}
		if (Spaz.Prefs.changeMethods[id].setUI) {
			sch.debug("Calling setUI on " + id + " -- current val is " + Spaz.Prefs.get(id));
			Spaz.Prefs.changeMethods[id].setUI(Spaz.Prefs.get(id));
		}
		if (Spaz.Prefs.changeMethods[id].onChange) {
			sch.debug("Calling onChange on " + id + " -- current val is " + Spaz.Prefs.get(id));
			Spaz.Prefs.changeMethods[id].onChange(Spaz.Prefs.get(id));
		}
	}
};

/*
 * Allow user-created sounds by checking for their presence in the app storage directory.
 * If found, override the defaults set in Spaz.Prefs.defaultPreferences.
 */
Spaz.Prefs.setSoundFileLocations = function() {
	sch.debug("Setting sound file locations");

	var soundFileUpdate = air.File.applicationStorageDirectory;
	soundFileUpdate = soundFileUpdate.resolvePath('usersounds/Csnd.mp3');

	var soundFileStartup = air.File.applicationStorageDirectory;
	soundFileStartup = soundFileStartup.resolvePath('usersounds/On.mp3');

	var soundFileShutdown = air.File.applicationStorageDirectory;
	soundFileShutdown = soundFileShutdown.resolvePath('usersounds/Off.mp3');

	var soundFileNew = air.File.applicationStorageDirectory;
	soundFileNew = soundFileNew.resolvePath('usersounds/New.mp3');

	var soundFileWilhelm = air.File.applicationStorageDirectory;
	soundFileWilhelm = soundFileWilhelm.resolvePath('usersounds/wilhelm.mp3');

	if (soundFileUpdate.exists) {
		Spaz.Prefs._prefs.get('sound-url-update') = soundFileUpdate.url;
	}
	sch.debug('sound-url-update is: ' + Spaz.Prefs._prefs.get('sound-url-update'));

	if (soundFileStartup.exists) {
		Spaz.Prefs._prefs.get('sound-url-startup') = soundFileStartup.url;
	}
	sch.debug('sound-url-startup is: ' + Spaz.Prefs._prefs.get('sound-url-startup'));

	if (soundFileShutdown.exists) {
		Spaz.Prefs._prefs.get('sound-url-shutdown') = soundFileShutdown.url;
	}
	sch.debug('sound-url-shutdown is: ' + Spaz.Prefs._prefs.get('sound-url-shutdown'));

	if (soundFileNew.exists) {
		Spaz.Prefs._prefs.get('sound-url-new') = soundFileNew.url;
	}
	sch.debug('sound-url-new is: ' + Spaz.Prefs._prefs.get('sound-url-new'));

	if (soundFileWilhelm.exists) {
		Spaz.Prefs._prefs.get('sound-url-wilhelm') = soundFileWilhelm.url;
	}
	sch.debug('sound-url-wilhelm is: ' + Spaz.Prefs._prefs.get('sound-url-wilhelm'));
};


Spaz.Prefs.savePrefs = function() {
	sch.debug('saving prefs');
	Spaz.Prefs._prefs.save();
};


Spaz.Prefs.resetPrefs = function() {
	Spaz.Prefs._prefs.resetPrefs()
};


Spaz.Prefs.get = function(key) {
	return Spaz.Prefs._prefs.get(key);
};


Spaz.Prefs.set = function(key, value) {
	sch.debug("setting "+key+" to "+value+" ("+typeof value+")");
	return Spaz.Prefs._prefs.set(key, value);
};



Spaz.Prefs.setPrefs = function() {
	// sch.debug('Verifying password');
	Spaz.Data.verifyCredentials();
	// sch.debug('saving Prefs');
	Spaz.Prefs.savePrefs();
}

Spaz.Prefs.setCurrentUser = function() {
	sch.debug('setCurrentUser is @TODO');
	return;

	//	   var user = $('#username').val();
	//	   var pass = $('#password').val();
	// var accobj;
	// 
	//	   sch.debug('set new username and pass (' + user + ')');
	// 
	// if (Spaz.Prefs._currentUserId) {
	//	if ( ( accobj = Spaz.Prefs._accounts.get(Spaz.Prefs._currentUserId) ) ) {
	//		accobj.username = user;
	//		accobj.password = pass;
	//		Spaz.Prefs._accounts.update(id, accobj);
	//	}
	// } else {
	//	var newaccobj = Spaz.Prefs._accounts.add(user, pass, SPAZCORE_ACCOUNT_TWITTER);
	//	Spaz.Prefs.setCurrentUserId(newaccobj.id);
	// }
	// 
	//	   sch.debug('saved data');
};



Spaz.Prefs.getUserAccount = function(id) {
	return Spaz.Prefs._accounts.get(id);
}



Spaz.Prefs.setCurrentUserId = function(id) {
	Spaz.Prefs.set('current-user-id', id);
};

Spaz.Prefs.getCurrentUserId = function() {
	return Spaz.Prefs.getCurrentAccountId();
};


Spaz.Prefs.setHandleHTTPAuth = function(state) {
	sch.debug(state);
	if (state) {
		Spaz.Prefs.handleHTTPAuth = 1
		window.htmlLoader.shouldAuthenticate = true;
	} else {
		Spaz.Prefs.handleHTTPAuth = 0;
		window.htmlLoader.shouldAuthenticate = false;
	}
	sch.debug(Spaz.Prefs.handleHTTPAuth);
	sch.debug(window.htmlLoader.shouldAuthenticate);
}

Spaz.Prefs.setDebugEnable = function(state) {
	Spaz.Debug.setEnable(state);
}


Spaz.Prefs.checkRefreshPeriod = function(val) {
	val = parseInt(val);
	if (val < 1) {
		val = 1;
	} else if (val > 60) {
		val = 60;
	}

	// convert msecs to minutes
	Spaz.Prefs.set('network-refreshinterval', val * 60000);
	//Spaz.UI.setPrefsFormVal('prefs-refresh-interval', val);
}


Spaz.Prefs.checkWindowOpacity = function(percentage) {
	//alert(percentage+"%");
	percentage = parseInt(percentage);
	if (isNaN(percentage)) {
		percentage = 100;
	}
	if (percentage < 25) {
		percentage = 25;
	}
	var val = parseInt(percentage) / 100;
	if (isNaN(val)) {
		val = 1;
	} else if (val >= 1) {
		val = 1;
	} else if (val <= 0) {
		val = 1;
	}

	window.htmlLoader.alpha = val;

	Spaz.Prefs.set('window-alpha', percentage);
	// Spaz.UI.setPrefsFormVal('prefs-opacity-percentage', Spaz.Prefs.windowOpacity);
}




Spaz.Prefs.setRateLimit = function(rateinfo, data) {
	sch.debug(JSON.stringify(rateinfo));

	var limit = rateinfo.hourly_limit;
	var per_min = Math.ceil((60 / (limit / 3)));
	var per_ms = per_min * 60000;

	sch.debug("per_min = " + per_min);
	sch.debug("per_ms  = " + per_ms);

	Spaz.UI.statusBar('Twitter says limit is ' + limit + '/hour. Will refresh every ' + per_min + ' min');

	Spaz.Prefs.changeMethods['network-refreshinterval'].setUI(per_ms);

	Spaz.Prefs.set('network-refreshinterval', per_ms);
	// Spaz.Section.friends.mincachetime = per_ms;
}






/**
 * retrieves the username for the current account 
 */
Spaz.Prefs.getUsername = function() {
	var currentAccountId = Spaz.Prefs.getCurrentAccountId();
	if (currentAccountId) {
		var accobj = Spaz.Prefs._accounts.get(currentAccountId);
		return !!accobj ? accobj.username : null;
	} else {
		return null;
	}

};

/**
 * DEPRECATED; calls Spaz.Prefs.getAuthKey
 */
Spaz.Prefs.getPassword = function() {
	sch.debug('Spaz.Prefs.getPassword is deprecated; use Spaz.Prefs.getAuthKey');
	return Spaz.Prefs.getAuthKey();
};

/**
 * Returns the current account's auth key 
 */
Spaz.Prefs.getAuthKey = function() {
	var currentAccountId = Spaz.Prefs.getCurrentAccountId();
	sch.debug('getAuthKey currentAccountId:'+currentAccountId);
	if (currentAccountId) {
		var accobj = Spaz.Prefs._accounts.get(currentAccountId);
		return !!accobj ? accobj.auth : null;
	} else {
		return null;
	}	
};

/**
 * Retrieves the custom API url for the current account
 */
Spaz.Prefs.getCustomAPIUrl = function() {
    return Spaz.Prefs._accounts.getMeta(Spaz.Prefs.getCurrentAccountId(), 'twitter-api-base-url');
};

/**
 * Returns a SpazAuth object based on the current user's type and auth key 
 */
Spaz.Prefs.getAuthObject = function() {
	var authkey = Spaz.Prefs.getAuthKey();
	sch.debug('getAuthObject authkey:'+authkey);
	if (authkey) {
		var auth = new SpazAuth(Spaz.Prefs.getAccountType());
		auth.load(authkey);
		return auth;
	} else {
		return null;
	}
}

/**
 * Returns the current account's type 
 */
Spaz.Prefs.getAccountType = function() {
	var currentAccountId = Spaz.Prefs.getCurrentAccountId();
	if (currentAccountId) {
		var accobj = Spaz.Prefs._accounts.get(currentAccountId);
		return !!accobj ? accobj.type : null;
	} else {
		return null;
	}

};

/**
 * Returns the current account object
 */
Spaz.Prefs.getCurrentAccount = function() {
	var currentAccountId = Spaz.Prefs.getCurrentAccountId();
	if (currentAccountId) {
		return Spaz.Prefs._accounts.get(currentAccountId);
	} else {
		return null;
	}

};


Spaz.Prefs.getCurrentAccountId = function() {
	return Spaz.Prefs.get('current-user-id');
}


Spaz.Prefs.getRefreshInterval = function() {
	return Spaz.Prefs.get('network-refreshinterval');
	// return 1000*5;
}

Spaz.Prefs.getDockRefreshInterval = function() {
	return Spaz.Prefs.get('dock-refreshinterval');
	// return 1000*5;
}

Spaz.Prefs.getDockDisplayUnreadBadge = function() {
	return Spaz.Prefs.get('dock-displayunreadbadge');
	// return 1000*5;
}

Spaz.Prefs.getHandleHTTPAuth = function() {
	return Spaz.Prefs.get('network-airhandlehttpauth');
}

Spaz.Prefs.getToggleKey = function() {
	return Spaz.Prefs.get('key-toggle');
}

