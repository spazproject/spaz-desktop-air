(function($){

if(!window.Spaz){ window.Spaz = {}; }
if(!window.Spaz.Profile){ window.Spaz.Profile = {}; }

var Spaz = window.Spaz;

Spaz.Profile.lastProfileUsername = null;

Spaz.Profile.show = function(username){
	if(username && Spaz.Profile.lastProfileUsername !== username){
		Spaz.Profile.build(username);
		Spaz.Profile.lastProfileUsername = username;
	}

	Spaz.UI.openPopboxInline('#profileWindow');
};

Spaz.Profile.hide = function(){
	// Hides the currently visible profile, if any.
	Spaz.UI.closePopbox();
};

Spaz.Profile.build = function(username){
	// Builds HTML for the profile window

	Spaz.Profile.showLoading();

	var $profile = $('#popbox-content-profile').children('.content'),
	    baseURL  = Spaz.Prefs.get('twitter-base-url');

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
		// Build image view
		$profile.find('.profile-user-image').
			css('background-image', 'url(' + data.profile_image_url + ')').
			html(username);

		// Build name views
		$profile.find('.real-name').text(data.name);
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
		$profile.find('.counts .following em').
			text(numberWithCommas(data.friends_count));
		$profile.find('.counts .followers em').
			text(numberWithCommas(data.followers_count)).
			siblings('.label').
			html(data.followers_count == 1 ? 'follower' : 'followers');
		$profile.find('.counts .listed em').
			text(numberWithCommas(data.listed_count));
		$profile.find('.counts .tweets em').
			text(numberWithCommas(data.statuses_count)).
			siblings('.label').
			html(data.statuses_count == 1 ? 'tweet' : 'tweets');
		$profile.find('.counts .faves em').
			text(numberWithCommas(data.favourites_count)).
			siblings('.label').
			html(data.favourites_count == 1 ? 'favorite' : 'favorites');

		// Build follow/unfollow button
		(function(){
			// FIXME: Implement
		})();

		// Build lists menu
		(function(){
			// FIXME: Implement
		})();

		// Build tools menu
		(function(){
			// FIXME: Implement
		})();

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
		sch.openInBrowser(baseURL + username);
	});
	$profile.delegate('ul.counts .following', 'click', function(ev){
		sch.openInBrowser(baseURL + username + '/following');
	});
	$profile.delegate('ul.counts .followers', 'click', function(ev){
		sch.openInBrowser(baseURL + username + '/followers');
	});
	$profile.delegate('ul.counts .listed', 'click', function(ev){
		sch.openInBrowser(baseURL + username + '/lists/memberships');
	});
	$profile.delegate('ul.counts .faves', 'click', function(ev){
		sch.openInBrowser(baseURL + username + '/favorites');
	});
	$profile.delegate('.tweets', 'click', function(ev){
		sch.openInBrowser(baseURL + username);
	});
	$profile.delegate('.bio .username.clickable', 'click', function(ev){
		Spaz.Profile.show($(ev.target).attr('data-username'));
	});
	$profile.delegate('.bio .hashtag.clickable', 'click', function(ev){
		Spaz.Profile.hide();
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
