/**
 * a library to handle CSS-based filtering of the main timeline by swapping in different sets of CSS rules
 */
Spaz.cssFilters = {};

Spaz.cssFilters.filters = [
	{
		'label': 'All',
		'css': 'div.timeline-entry       { display:block; }\
				div.timeline-entry.reply { display:block; }\
				div.timeline-entry.dm    { display:block; }'
	},
	{
		label: '@mentions and DMs',
		'css': 'div.timeline-entry       { display:none; }\
				div.timeline-entry.reply { display:block; }\
				div.timeline-entry.dm    { display:block; }'
	},
	{
		label: '@mentions',
		'css': 'div.timeline-entry       { display:none; }\
				div.timeline-entry.reply { display:block; }\
				div.timeline-entry.dm    { display:none; }'
	},
	{
		label: 'DMs',
		'css': 'div.timeline-entry       { display:none; }\
				div.timeline-entry.reply { display:none; }\
				div.timeline-entry.dm    { display:block; }'
	},
	{
		label: 'Unread',
		'css': 'div.timeline-entry       { display:block; }\
				div.timeline-entry.reply { display:block; }\
				div.timeline-entry.dm    { display:block; }\
				div.timeline-entry.read  { display:none;  }'
	},
	{
		label: 'No API RTs',
		'css': 'div.timeline-entry       { display:block; }\
				div.timeline-entry.reply { display:block; }\
				div.timeline-entry.dm    { display:block; }\
				div.timeline-entry.retweet { display:none;}'

	}
];

Spaz.cssFilters.getCSS = function(label) {
	for (var i=0; i < Spaz.cssFilters.filters.length; i++) {
		if (Spaz.cssFilters.filters[i].label === label) {
			return Spaz.cssFilters.filters[i].css;
		}
	}
	return false;
};


Spaz.cssFilters.applyFilter = function(label) {
	
	if (jQuery('#cssfilter').length < 1) {
		jQuery('head').append('<style id="cssfilter" type="text/css"></style>');
	}
	
	var css = Spaz.cssFilters.getCSS(label);
	
	jQuery('#cssfilter').text(css);
};


Spaz.cssFilters.clearFilter = function() {
	jQuery('#cssfilter').remove();
};


Spaz.cssFilters.addFilter = function(label, css) {
	if ( !(Spaz.cssFilters.setFilterCSS(label, css)) ) {
		Spaz.cssFilters.filters.push({
			'label':label,
			'css':css
		});
	}
};

Spaz.cssFilters.setFilterCSS = function(label, css) {
	for (var i=0; i < Spaz.cssFilters.filters.length; i++) {
		if (Spaz.cssFilters.filters[i].label === label) {
			Spaz.cssFilters.filters[i].css = css;
			return true;
		}
	}
	return false;
};

Spaz.cssFilters.removeFilter = function(label) {
	for (var i=0; i < Spaz.cssFilters.filters.length; i++) {
		if (Spaz.cssFilters.filters[i].label === label) {
			Spaz.cssFilters.filters[i] = null;
			return true;
		}
	}
	return false;
};
