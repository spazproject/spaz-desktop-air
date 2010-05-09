var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.Autocomplete
************/
if (!Spaz.Autocomplete) Spaz.Autocomplete = {};

Spaz.Autocomplete.sources  = {};
Spaz.Autocomplete.statuses = {};
Spaz.Autocomplete.screenNames = [];
Spaz.Autocomplete.hashTags = [];

// Spaz.Autocomplete.maxScreenNames = 300;

Spaz.Autocomplete.initSuggestions = function() {
	Spaz.uc.setUsernames(Spaz.Autocomplete.getScreenNames());
	Spaz.uc.setHashtags(Spaz.Autocomplete.getHashTags());
};



Spaz.Autocomplete.addScreenName = function(name) {
	if (Spaz.Autocomplete.screenNames.indexOf(name) == -1) {
		Spaz.Autocomplete.screenNames.push(name)
		sch.debug('Added "'+name.toLowerCase()+'". Number of screen names is '+Spaz.Autocomplete.getScreenNamesCount());
	}
};

Spaz.Autocomplete.delScreenName = function(name) {
	if (Spaz.Autocomplete.screenNames.indexOf(name)) {
		sch.dump('Spaz.Autocomplete.delScreenName not yet implemented');
	}
	
};

Spaz.Autocomplete.getScreenNames = function() {
	Spaz.Autocomplete.screenNames = [];
	
	if (Spaz.Timelines.friends) {
		$('.user-screen-name', Spaz.Timelines.friends.timeline.timeline_container_selector).each(function() {
			var name = $(this).attr('user-screen_name');
			if (Spaz.Autocomplete.screenNames.indexOf(name) == -1) {
				Spaz.Autocomplete.screenNames.push(name);
			}
		});
	}
	
	sch.debug('Screen Names:')
	sch.debug(Spaz.Autocomplete.screenNames);
	
	return Spaz.Autocomplete.screenNames;	
};


Spaz.Autocomplete.getScreenNamesCount = function() {
	return Spaz.Autocomplete.screenNames.length;
}



Spaz.Autocomplete.getHashTags = function() {
	Spaz.Autocomplete.hashTags = [];
	
	if (Spaz.Timelines.friends) {		
		$('.hashtag', Spaz.Timelines.friends.timeline.timeline_container_selector).each(function() {
			var hashtag = $(this).text().replace('#', '');
			sch.debug("this hashtag:"+hashtag);
			if (Spaz.Autocomplete.hashTags.indexOf(hashtag) == -1) {
				Spaz.Autocomplete.hashTags.push(hashtag);
			}
		});
	}

	sch.debug('HashTags:')
	sch.debug(Spaz.Autocomplete.hashTags);
	
	return Spaz.Autocomplete.hashTags;
};

Spaz.Autocomplete.getHashTagsCount = function() {
	return Spaz.Autocomplete.hashTags.length;
}
