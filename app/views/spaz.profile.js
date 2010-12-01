(function($){

if(!window.Spaz){ window.Spaz = {}; }
if(!window.Spaz.Profile){ window.Spaz.Profile = {}; }

var Spaz = window.Spaz;

Spaz.Profile.lastProfileUsername = null;

Spaz.Profile.show = function(username){
	if(!username){ return; }

	if(Spaz.Profile.lastProfileUsername === username){
		// Repeat profile. Don't rebuild HTML, but ensure that menu listeners
		// are still bound.
		Spaz.Data.getUser('@' + username, document, function(userData){
			Spaz.Profile.buildListsMenu(userData);
			Spaz.Profile.buildToolsMenu(userData);
		});
	}else{
		Spaz.Profile.build(username);
		Spaz.Profile.lastProfileUsername = username;
	}

	Spaz.UI.openPopboxInline('#profileWindow');
};

Spaz.Profile.hide = function(){
	// Hides the currently visible profile, if any.
	Spaz.UI.closePopbox();
};

Spaz.Profile.isVisible = function(username){
	var profileSelector = (
	    	username ?
	    		'#popbox-content-profile[data-username=' + username + ']' :
	    		'#popbox-content-profile'
	    );
	return $(profileSelector).is(':visible');
};

Spaz.Profile.build = function(username){
	// Builds HTML for the profile window

	Spaz.Profile.showLoading();

	var $profileWrapper = $('#popbox-content-profile'),
	    $profile = $profileWrapper.children('.content'),
	    baseURL  = Spaz.Prefs.get('twitter-base-url');

	$profileWrapper.attr('data-username', username);

	function numberWithCommas(num){
		// Adapted from: http://www.mredkj.com/javascript/nfbasic.html
		var numStr   = num + '',
		    numParts = numStr.split('.'),
		    numInt   = numParts[0],
		    numDec   = numParts.length > 1 ? '.' + numParts[1] : '',
		    regex    = /(\d+)(\d{3})/;
		while(regex.test(numInt)){
			numInt = numInt.replace(regex, '$1' + ',' + '$2');
		}
		return numInt + numDec;
	}

	function onUserDataLoad(data){
		$profileWrapper.toggleClass('following', !!data.following);

		// Build image view
		$profile.find('.profile-user-image').
			css('background-image', 'url(' + data.profile_image_url + ')').
			html(username);

		// Build name views
		(function(){
			var $realName = $profile.find('.real-name');
			if(data.name){
				$realName.text(data.name).show();
			}else{
				$realName.hide();
			}
		})();
		$profile.find('.username').text('@' + username); // data.screen_name

		// Build location view
		(function(){
			var $location = $profile.find('p.location'),
			    value = data.location;
			if(value){
				$location.children('.value').text(value).
					unbind('click').click(function(ev){
						sch.openInBrowser('http://maps.google.com/?q=' +
							window.escape(value));
					});
				$location.show();
			}else{
				$location.hide();
			}
		})();

		// Build website view
		(function(){
			var $website = $profile.find('p.website'),
			    value = data.url;
			if(value){
				$website.text(value).show().unbind('click').click(function(ev){
					sch.openInBrowser(value);
				});
			}else{
				$website.hide();
			}
		})();

		// Build bio view
		(function(){
			var $bio = $profile.find('p.bio'),
			    value = data.description;
			if(value){
				$bio.html(sch.makeClickable(value, {
					screenname: {
						tpl: '<span class="username clickable" title="View profile" ' +
							'data-username="#username#">@#username#</span>'
					},
					hashtag: {
						tpl: '<span class="hashtag clickable" ' +
							'title="Search for this hashtag" ' +
							'data-hashtag="#hashtag_enc#">##hashtag#</span>'
					}
				})).show();
			}else{
				$bio.hide();
			}
		})();

		// Build counter views
		$profile.find('.counts .tweets em').
			text(numberWithCommas(data.statuses_count)).
			siblings('.label').
			html(+data.statuses_count === 1 ? 'tweet' : 'tweets');
		$profile.find('.counts .following em').
			text(numberWithCommas(data.friends_count));
		$profile.find('.counts .followers em').
			text(numberWithCommas(data.followers_count)).
			siblings('.label').
			html(+data.followers_count === 1 ? 'follower' : 'followers');
		$profile.find('.counts .listed em').
			text(numberWithCommas(data.listed_count));

		Spaz.Profile.buildListsMenu(data);
		Spaz.Profile.buildToolsMenu(data);

		Spaz.Profile.hideLoading();
	}

	// Request data
	Spaz.Data.getUser('@' + username, document, onUserDataLoad);

	// Add listeners
	$profile.undelegate();
	$profile.delegate('.profile-user-image', 'click', function(ev){
		sch.openInBrowser(baseURL + 'account/profile_image/' + username);
	});
	$profile.delegate('.name', 'click', function(ev){
		sch.openInBrowser(baseURL + '#!/' + username);
	});
	$profile.delegate('.tweets', 'click', function(ev){
		sch.openInBrowser(baseURL + '#!/' + username);
	});
	$profile.delegate('ul.counts .following', 'click', function(ev){
		sch.openInBrowser(baseURL + '#!/' + username + '/following');
	});
	$profile.delegate('ul.counts .followers', 'click', function(ev){
		sch.openInBrowser(baseURL + '#!/' + username + '/followers');
	});
	$profile.delegate('ul.counts .listed', 'click', function(ev){
		sch.openInBrowser(baseURL + '#!/' + username + '/lists/memberships');
	});
	$profile.delegate('.faves', 'click', function(ev){
		sch.openInBrowser(baseURL + '#!/' + username + '/favorites');
	});
	$profile.delegate('.bio .username.clickable', 'click', function(ev){
		Spaz.Profile.show($(ev.target).attr('data-username'));
	});
	$profile.delegate('.bio .hashtag.clickable', 'click', function(ev){
		Spaz.Profile.hide();
	});
	Spaz.Profile.buildFollowButton(username);
};

Spaz.Profile.buildFollowButton = function(username){
	var $profileWrapper = $('#popbox-content-profile'),
	    $controls = $profileWrapper.children('.controls');

	$controls.undelegate();
	$controls.delegate('button.follow', 'click', function(ev){
		Spaz.Data.addFriend('@' + username, {
			onSuccess: function(userData){
				$profileWrapper.addClass('following');
				Spaz.Profile.buildToolsMenu(userData);
			}
		});
	});
	$controls.delegate('button.unfollow', 'click', function(ev){
		Spaz.Data.removeFriend('@' + username, {
			onSuccess: function(userData){
				$profileWrapper.removeClass('following');
				Spaz.Profile.buildToolsMenu(userData);
			}
		});
	});
};

Spaz.Profile.buildListsMenu = function(userData){
	// Spaz.Profile.listsMenu = new SpazMenu({
	// 	base_id:    'profile-lists-menu',
	// 	base_class: 'spaz-menu',
	// 	li_class:   'spaz-menu-item',
	// 	items_func: function(itemsData){
	// 		var items = []
	//
	// 		// FIXME: Implement
	// 		items.push({ label: 'N/A' });
	//
	// 		return items;
	// 	}
	// });
	// Spaz.Profile.listsMenu.bindToggle(
	// 	'#popbox-content-profile div.controls button.lists');
};

Spaz.Profile.buildToolsMenu = function(userData){
	Spaz.UserMenu.create(userData);
	Spaz.UserMenu.menu.bindToggle(
		'#popbox-content-profile div.controls button.tools', {
		afterShow: function(){
			Spaz.UserMenu.updateFollowToggle(userData);
		}
	});
};

Spaz.Profile.showLoading = function(){
	$('#popbox-content-profile').children('.content').addClass('loading');
};

Spaz.Profile.hideLoading = function(){
	var $content = $('#popbox-content-profile').children('.content.loading');
	if($content[0]){
		$content.removeClass('loading');
	}
};



})(window.jQuery);
