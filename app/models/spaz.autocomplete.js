var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.Autocomplete
************/
if (!Spaz.Autocomplete) Spaz.Autocomplete = {};

Spaz.Autocomplete.sources  = {};
Spaz.Autocomplete.statuses = {};
Spaz.Autocomplete.screenNames = [];

// 'username':{ 'count':0 }
// this isn't used yet, but it really should be
Spaz.Autocomplete.screenNamesAccesses = {};

// Spaz.Autocomplete.maxScreenNames = 300;

Spaz.Autocomplete.addScreenName = function(name) {
	if (Spaz.Autocomplete.screenNames.indexOf(name) == -1) {
		Spaz.Autocomplete.screenNames.push(name)
		Spaz.dump('Added "'+name.toLowerCase()+'". Number of screen names is '+Spaz.Autocomplete.getScreenNamesCount());
	}
};

Spaz.Autocomplete.delScreenName = function(name) {
	if (Spaz.Autocomplete.screenNames.indexOf(name)) {
		sch.dump('Spaz.Autocomplete.delScreenName not yet implemented');
	}
	
};

Spaz.Autocomplete.getScreenNames = function() {
	// return Spaz.Autocomplete.screenNames;
	
	var screen_names = [];
	
	$('.user-screen-name', '#'+Spaz.Section.friends.timeline).each(function() {
		name = $(this).attr('user-screen_name');
		if (screen_names.indexOf(name) == -1) {
			screen_names.push(name);
			// sch.dump('Added "'+name+'". Number of screen names is '+screen_names.length);
		}
	});
	
	sch.error('Screen Names:')
	sch.error(screen_names);
	
	return screen_names;
	
}

Spaz.Autocomplete.getScreenNamesCount = function() {
	return Spaz.Autocomplete.screenNames.length;
}
