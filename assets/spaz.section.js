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
	mincachetime:60000*3,
	build: function(force){
		Spaz.Data.getDataForTimeline(this, force)
	},
	onAjaxComplete: function(url,xhr,msg){
		Spaz.Data.onSectionAjaxComplete(this,url,xhr,msg);
	},
	addItem: function(item) {
		Spaz.UI.addItemToTimeline(item, this)
	},
	cleanup: function(attribute){
		Spaz.UI.cleanupTimeline(this.timeline);
		Spaz.Cache.buildScreenNameCache();
		Spaz.Editor.initSuggestions();
	},
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
	mincachetime:60000*2,
	build: function(force){
		Spaz.Data.getDataForTimeline(this, force)
	},
	onAjaxComplete: function(url,xhr,msg){
		Spaz.Data.onSectionAjaxComplete(this,url,xhr,msg);
	},
	addItem: function(item) {
		Spaz.UI.addItemToTimeline(item, this)
	},
	cleanup: function(attribute){
		Spaz.UI.cleanupTimeline(this.timeline);
		Spaz.Cache.buildScreenNameCache();
		Spaz.Editor.initSuggestions();
	},

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
	mincachetime:1,
	build: function(force){
		Spaz.Data.getDataForTimeline(this, force)
	},
	onAjaxComplete: function(url,xhr,msg){
		Spaz.Data.onSectionAjaxComplete(this,url,xhr,msg);
	},
	addItem: function(item) {
		Spaz.UI.addItemToTimeline(item, this)
	},
	cleanup: function(attribute){
		Spaz.UI.cleanupTimeline(this.timeline);
	},
	
}


Spaz.Section.search = {
	panel:    'panel-search',
	timeline: 'timeline-search', 
	tab:      'tab-search',
	tabIndex: 2,
	urls:      new Array('http://summize.com/search.json?q={{query}}'),
	lastid:   0,
	lastcheck:0,
	currdata: null,
 	prevdata: null,
	autoload: true,
	canclear: true,
	mincachetime:1,
	
	lastquery:null,
	
	build: function(force){

		if ($('#search-for').val().length>0) {

			if ( this.lastquery !=  $('#search-for').val() ) {			

				$('#'+Spaz.Section.search.timeline+' .timeline-entry').remove();
			
				Spaz.UI.statusBar("Searching for '"+$('#search-for').val()+"'…");
				Spaz.UI.showLoading();
			
				var url = 'http://summize.com/search.json';
				var data =	{
								"rpp"	:50,
								"q"		:encodeURI($('#search-for').val()),
							};
				$.get(url, data, this.onAjaxComplete)

			}

		}
		
	},
	onAjaxComplete: function(data,msg){
		
		var data = JSON.parse(data);
		Spaz.dump(data);
		
		var term = data.query;
		
		if (data && data.results) {
			
			// $('#search-results').empty();
			
			function summizeToTweet(result) {
				var tweet = {
					"text"					: result.text,
					"created_at"			: result.created_at,
					"id"					: result.id,
					"in_reply_to_user_id"	: result.to_user_id,
				    "favorited"				: false,
				    "source"				: "web",
				    "truncated"				: false,
					"user" : {
						"id"				: result.from_user_id,
						"screen_name"		: result.from_user,
						"profile_image_url"	: result.profile_image_url,
						"protected"			: false,
					}
				}
				
				// air.trace(JSON.stringify(tweet));
				
				return tweet
			}
			
			Spaz.UI.statusBar("Found "+data.results.length+" results for '"+$('#search-for').val()+"'");
			Spaz.UI.hideLoading();
			
			for(var x =0; x<data.results.length; x++) {
				Spaz.Section.search.addItem( summizeToTweet(data.results[x]) )
			}
			Spaz.dump('cleaning up timeline');
			Spaz.Section.search.cleanup();
			
			// add search term highlighting
			$('#'+Spaz.Section.search.timeline + " div.timeline-entry").each( function() {
				$.highlight(this, term.toUpperCase());
			});
		}
		
	},
	addItem: function(item) {
		Spaz.UI.addItemToTimeline(item, this)
	},
	cleanup: function(attribute){
		Spaz.UI.cleanupTimeline(this.timeline, true, true);
	},
	
}

Spaz.Section.friendslist = {
	panel:    'panel-friendslist',
	timeline: 'timeline-friendslist', 
	tab:      'tab-friendslist',
	tabIndex: 3,
	urls:      new Array('https://twitter.com/statuses/friends.json'),
	lastid:   0,
	lastcheck:0,
	currdata: null,
 	prevdata: null,
	autoload: false,
	canclear: false,
	mincachetime:60000*15,
	build: function(force){
		Spaz.Data.getDataForTimeline(this, force)
	},
	onAjaxComplete: function(url,xhr,msg){
		$('#tbody-friendslist').empty()
		Spaz.Data.onSectionAjaxComplete(this,url,xhr,msg);
	},
	addItem: function(item) {
		item.timeline = this.timeline;
		var tpl		= Spaz.Sys.getFileContents('app:/templates/friendslist-row.tpl');
		var parsed = Spaz.Sys.ClassicSB.parseTpl(tpl, item)
		$('#tbody-friendslist').append(parsed);
	},
	cleanup: function(){
		$("#table-friendslist tr:even").addClass('even');
		$("#table-friendslist tr:odd").addClass('odd');
		Spaz.Cache.buildScreenNameCache();
		Spaz.Editor.initSuggestions();
	},
	
}

Spaz.Section.followerslist = {
	panel:    'panel-followerslist',
	timeline: 'timeline-followerslist', 
	tab:      'tab-followerslist',
	tabIndex: 4,
	urls:      new Array('https://twitter.com/statuses/followers.json'),
	lastid:   0,
	lastcheck:0,
	currdata: null,
 	prevdata: null,
	autoload: false,
	canclear: false,
	mincachetime:60000*15,
	build: function(force){
		Spaz.Data.getDataForTimeline(this, force)
	},
	onAjaxComplete: function(url,xhr,msg){
		$('#tbody-followerslist').empty()
		Spaz.Data.onSectionAjaxComplete(this,url,xhr,msg);
	},
	addItem: function(item) {		
		item.timeline = this.timeline;
		var tpl		= Spaz.Sys.getFileContents('app:/templates/friendslist-row.tpl');
		var parsed = Spaz.Sys.ClassicSB.parseTpl(tpl, item)
		$('#tbody-followerslist').append(parsed);
	},
	cleanup: function(){
		$("#table-followerslist tr:even").addClass('even');
		$("#table-followerslist tr:odd").addClass('odd');
		Spaz.Cache.buildScreenNameCache();
		Spaz.Editor.initSuggestions();
	},
}

Spaz.Section.prefs = {
	panel:    'panel-prefs',
	timeline: 'timeline-prefs', 
	tab:      'tab-prefs',
	tabIndex: 5,
	autoload: false,
	canclear: false,
	build: function(force){},
	onAjaxComplete: function(url,xhr,msg){},
	addItem: function(item) {},
	cleanup: function(attribute){},
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