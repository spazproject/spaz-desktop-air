Spaz.TimelineFilters = {};

Spaz.TimelineFilters.defaultEntryFilters = [
	{
		'label':'nl2br',
		'func':function(d) {
			d.text = sch.nl2br(d.text);
			if (d.SC_is_retweet) {
				d.retweeted_status.text = sch.nl2br(d.retweeted_status.text);
			}
			return d;
		}
	},
	{
		'label':'autolink',
		'func':function(d) {
			d.text = sch.makeClickable(d.text, SPAZ_MAKECLICKABLE_OPTS);
			if (d.SC_is_retweet) {
				d.retweeted_status.text = sch.makeClickable(d.retweeted_status.text, SPAZ_MAKECLICKABLE_OPTS);
			}
			return d;
		}
	},
	{
		'label':'emoticons',
		'func':function(d) {
			d.text = Emoticons.SimpleSmileys.convertEmoticons(d.text);
			if (d.SC_is_retweet) {
				d.retweeted_status.text = Emoticons.SimpleSmileys.convertEmoticons(d.retweeted_status.text);
			}
			return d;
		}
	},
	{
		'label':'markdown',
		'func':function(d) {
			var md = new Showdown.converter();
			d.text = md.makeHtml(d.text);
			d.text = d.text.replace(/href="([^"]+)"/gi, 'href="$1" title="Open link in a browser window" class="inline-link"');		
			return d;	
		}
	},
	{
		'label':'getImageURLs',
		'func':function(d) {
			var sui = new SpazImageURL();
			if (d.SC_is_retweet) {
				d.SC_thumbnail_urls = sui.getThumbsForUrls(d.retweeted_status.text);
			} else {
				d.SC_thumbnail_urls = sui.getThumbsForUrls(d.SC_text_raw||d.text);
			}
			return d;
		}
	}
];

/*
	Build our default filter chains
*/
Spaz.TimelineFilters.friends = new SpazFilterChain({filters:Spaz.TimelineFilters.defaultEntryFilters});

Spaz.TimelineFilters['public'] = new SpazFilterChain({filters:Spaz.TimelineFilters.defaultEntryFilters});

Spaz.TimelineFilters.lists = new SpazFilterChain({filters:Spaz.TimelineFilters.defaultEntryFilters});

Spaz.TimelineFilters.search = new SpazFilterChain({filters:Spaz.TimelineFilters.defaultEntryFilters});

Spaz.TimelineFilters.other = new SpazFilterChain({filters:Spaz.TimelineFilters.defaultEntryFilters});
