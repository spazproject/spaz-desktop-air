if (!Spaz.Section) Spaz.Section = {};


Spaz.Section.friends = {
	panel:    'panel-friends',
	timeline: 'timeline-friends', 
	tab:      'tab-friends',
	tabIndex: 0,
	urls: new Array(Spaz.Data.url_friends_timeline,Spaz.Data.url_replies_timeline,Spaz.Data.url_dm_timeline),
	lastid:   0,
	lastcheck:0,
	currdata: null,
 	prevdata: null,
	autoload: true,
	canclear: true,
	mincachetime:60000*3
}

Spaz.Section.user = {
	panel:    'panel-user',
	timeline: 'timeline-user', 
	tab:      'tab-user',
	tabIndex: 1,
	urls:      new Array('https://twitter.com/statuses/user_timeline.json', 'http://twitter.com/direct_messages/sent.json'),
	lastid:   0,
	lastcheck:0,
	currdata: null,
 	prevdata: null,
	autoload: false,
	canclear: true,
	mincachetime:60000*2
}

Spaz.Section.public = {
	panel:    'panel-public',
	timeline: 'timeline-public', 
	tab:      'tab-public',
	tabIndex: 2,
	urls:      new Array('https://twitter.com/statuses/public_timeline.json'),
	lastid:   0,
	lastcheck:0,
	currdata: null,
 	prevdata: null,
	autoload: true,
	canclear: true,
	mincachetime:1
	
}
Spaz.Section.friendslist = {
	panel:    'panel-friendslist',
	timeline: 'timeline-friendslist', 
	tab:      'tab-friendslist',
	tabIndex: 5,
	urls:      new Array('https://twitter.com/statuses/friends.json'),
	lastid:   0,
	lastcheck:0,
	currdata: null,
 	prevdata: null,
	autoload: false,
	canclear: false,
	mincachetime:60000*15
	
}
Spaz.Section.followerslist = {
	panel:    'panel-followerslist',
	timeline: 'timeline-followerslist', 
	tab:      'tab-followerslist',
	tabIndex: 6,
	urls:      new Array('https://twitter.com/statuses/followers.json'),
	lastid:   0,
	lastcheck:0,
	currdata: null,
 	prevdata: null,
	autoload: false,
	canclear: false,
	mincachetime:60000*15	
}
Spaz.Section.prefs = {
	panel:    'panel-prefs',
	timeline: 'timeline-prefs', 
	tab:      'tab-prefs',
	tabIndex: 3,
	autoload: false,
	canclear: false
	// url:      'https://twitter.com/statuses/followers.json',
	// lastid:   0
}



Spaz.Section.getSectionFromTab = function(tab) {
	var sectionStr = tab.id.replace(/tab-/, '');
	Spaz.dump('section for tab:'+sectionStr);
	return Spaz.Section[sectionStr];
};


Spaz.Section.getSectionFromTimeline = function(timeline) {
	var sectionStr = timeline.id.replace(/timeline-/, '');
	Spaz.dump('section for tab:'+sectionStr);
	return Spaz.Section[sectionStr];
};