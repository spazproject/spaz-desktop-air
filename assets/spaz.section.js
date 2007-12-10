if (!Spaz.Section) Spaz.Section = {};

Spaz.Section.friends = {
	panel:    'panel-friends',
	timeline: 'timeline-friends', 
	tab:      'tab-friends',
	tabIndex: 0,
	url:      'https://twitter.com/statuses/friends_timeline.json',
	lastid:   0,
	lastcheck:0,
	currdata: null,
 	prevdata: null,
	autoload: true,
	mincachetime:1
}
Spaz.Section.replies = {
	panel:    'panel-replies',
	timeline: 'timeline-replies', 
	tab:      'tab-replies',
	tabIndex: 1,
	url:      'https://twitter.com/statuses/replies.json',
	lastid:   0,
	lastcheck:0,
	currdata: null,
 	prevdata: null,
	autoload: true,
	mincachetime:1
}
Spaz.Section.dms = {
	panel:    'panel-dms',
	timeline: 'timeline-dms', 
	tab:      'tab-dms',
	tabIndex: 2,
	url:      'https://twitter.com/direct_messages.json',
	lastid:   0,
	lastcheck:0,
	currdata: null,
 	prevdata: null,
	autoload: true,
	mincachetime:1
	
}
Spaz.Section.user = {
	panel:    'panel-user',
	timeline: 'timeline-user', 
	tab:      'tab-user',
	tabIndex: 3,
	url:      'https://twitter.com/statuses/user_timeline.json',
	lastid:   0,
	lastcheck:0,
	currdata: null,
 	prevdata: null,
	autoload: false,
	mincachetime:1
	
}
Spaz.Section.public = {
	panel:    'panel-public',
	timeline: 'timeline-public', 
	tab:      'tab-public',
	tabIndex: 4,
	url:      'https://twitter.com/statuses/public_timeline.json',
	lastid:   0,
	lastcheck:0,
	currdata: null,
 	prevdata: null,
	autoload: true,
	mincachetime:1
	
}
Spaz.Section.friendslist = {
	panel:    'panel-friendslist',
	timeline: 'timeline-friendslist', 
	tab:      'tab-friendslist',
	tabIndex: 5,
	url:      'https://twitter.com/statuses/friends.json',
	lastid:   0,
	lastcheck:0,
	currdata: null,
 	prevdata: null,
	autoload: false,
	mincachetime:60000*15
	
}
Spaz.Section.followerslist = {
	panel:    'panel-followerslist',
	timeline: 'timeline-followerslist', 
	tab:      'tab-followerslist',
	tabIndex: 6,
	url:      'https://twitter.com/statuses/followers.json',
	lastid:   0,
	lastcheck:0,
	currdata: null,
 	prevdata: null,
	autoload: false,
	mincachetime:60000*15	
}
Spaz.Section.prefs = {
	panel:    'panel-prefs',
	timeline: 'timeline-prefs', 
	tab:      'tab-prefs',
	tabIndex: 7,
	autoload: false,
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