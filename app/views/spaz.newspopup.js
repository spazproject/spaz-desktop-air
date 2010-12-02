Spaz.Newspopup = {
	
	'initWindow' : function() {
		var container = $('#news-content');
		Spaz.UI.openPopboxInline('#newsWindow');
		container.html('<div class="loading">Loading…</div>');
	},
	
	'build' : function(force) {
		var tpl = Spaz.Newspopup.tpl;
		
		$.getJSON("http://getspaz.com/feeds/spaz-desktop.json", function(data) {
			
			// return out if we don't have new items
			if (!force && !Spaz.Newspopup.hasNewItems(data.feed.last_updated)) { return; }
			
			Spaz.Newspopup.initWindow();

			for (var i=0; i < data.feed.entries.length; i++) {
				data.feed.entries[i].humanDate = Spaz.Newspopup.humanDate;
			}
			
			var html = $.mustache(tpl, data.feed);
			var container = $('#news-content').html(html);
		});
		
	},
	
	'humanDate':function(text, render) {
		text = new Date(this.publishedDate).toString('M/d/yyyy');
		return text;
	},
	
	'hasNewItems':function(last_updated) {
		var local_last_upated = Spaz.Prefs.get('news_last_updated');
		
		if (local_last_upated) {
			if (new Date(local_last_upated) >= new Date(last_updated)) {
				return false;
			}
		}
		
		Spaz.Prefs.set('news_last_updated', last_updated);
		
		return true;
	},
	
	'tpl':[
		'{{#entries}}' 
		,'<div class="entry">'
		,'	<div class="title"><a href="{{link}}">{{title}}</a></div>'
		,'	<div class="date">{{humanDate}}</em></div>'
		,'	<div class="entry-content">{{{content}}}</div>'
		,'</div>'
		,'{{/entries}}'
	].join('')
};