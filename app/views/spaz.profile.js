(function($){

if(!window.Spaz){ window.Spaz = {}; }
if(!window.Spaz.Profile){ window.Spaz.Profile = {}; }

var Spaz = window.Spaz;

Spaz.Profile.lastProfileUsername = null;

Spaz.Profile.show = function(username){
	if(username && Spaz.Profile.lastProfileUsername != username){
		Spaz.Profile.build(username);
		Spaz.Profile.lastProfileUsername = username;
	}

	Spaz.UI.openPopboxInline('#profileWindow');
};

Spaz.Profile.build = function(username){
	// Builds HTML for the profile window

	Spaz.Profile.showLoading();

	var $profile = $('#popbox-content-profile').children('.content'),
	    baseURL  = Spaz.Prefs.get('twitter-base-url');

	sch.listen(document, 'get_user_succeeded', function(ev, data){
		// Build image view
		$profile.find('.profile-user-image').
			css('background-image', 'url(' + data.profile_image_url + ')').
			html(username);

		// Build name views
		$profile.find('.real-name').text(data.name);
		$profile.find('.username').text('@' + username); // data.screen_name

		// Build location view
		(function(){
			var $location = $profile.children('p.location'),
			    value = data.location;
			if(value){
				$location.text(value).show().unbind('click').click(function(ev){
					sch.openInBrowser('http://maps.google.com/?q=' + escape(value));
				});
			}else{
				$location.hide();
			}
		})();

		// Build website view
		(function(){
			var $website = $profile.children('p.website'),
			    value = data.url;
			if(value){
				$website.text(value).show().unbind('click').click(function(ev){
					sch.openInBrowser(value);
				});
			}else{
				$website.hide();
			}
		})();

		// Build counter views
		$profile.find('.counts .following em').text(data.friends_count);
		$profile.find('.counts .followers em').text(data.followers_count);
		$profile.find('.counts .listed em').text(data.listed_count);

		// Build tweet count view
		$profile.find('.tweets').text(data.statuses_count +
			(data.statuses_count > 1 ? ' tweets' : ' tweet'));

		// Build bio view
		(function(){
			var $bio = $profile.children('p.bio'),
			    value = data.description;
			value ? $bio.text(value).show() : $bio.hide();
		})();

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
	});

	// Request data
	Spaz.Data.getUser('@' + username, document);

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
	$profile.delegate('.tweets', 'click', function(ev){
		sch.openInBrowser(baseURL + username);
	});
};

Spaz.Profile.showLoading = function(){
	// FIXME: Implement
};

Spaz.Profile.hideLoading = function(){
	// FIXME: Implement
};



})(jQuery);
