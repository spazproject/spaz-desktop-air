/**
 * a library to handle CSS-based filtering of the main timeline by swapping in different sets of CSS rules
 */
Spaz.cssFilters = {};

Spaz.cssFilters.filters = [
	{
		label: 'All',
		id:    'view-friends-menu-all',
		'css': 'div.timeline-entry       { display:block; }\
				div.timeline-entry.reply { display:block; }\
				div.timeline-entry.dm    { display:block; }'
	},
	{
		label: '@Mentions and DMs',
		id:    'view-friends-menu-replies-dms',
		'css': 'div.timeline-entry       { display:none; }\
				div.timeline-entry.reply { display:block; }\
				div.timeline-entry.dm    { display:block; }'
	},
	{
		label: '@Mentions',
		id:    'view-friends-menu-replies',
		'css': 'div.timeline-entry       { display:none; }\
				div.timeline-entry.reply { display:block; }\
				div.timeline-entry.dm    { display:none; }'
	},
	{
		label: 'DMs',
		id:    'view-friends-menu-dms',
		'css': 'div.timeline-entry       { display:none; }\
				div.timeline-entry.reply { display:none; }\
				div.timeline-entry.dm    { display:block; }'
	},
	{
		label: 'Unread',
		id:    'view-friends-menu-unread',
		'css': 'div.timeline-entry       { display:block; }\
				div.timeline-entry.reply { display:block; }\
				div.timeline-entry.dm    { display:block; }\
				div.timeline-entry.read  { display:none;  }'
	},
	{
		label: 'No API RTs',
		id:    'view-friends-menu-no-rts',
		'css': 'div.timeline-entry       { display:block; }\
				div.timeline-entry.reply { display:block; }\
				div.timeline-entry.dm    { display:block; }\
				div.timeline-entry.retweet { display:none;}'

	}
];

/**
 * default 
 */
Spaz.cssFilters.currentFilter = 'view-friends-menu-all';

/**
 * get CSS code for this id 
 */
Spaz.cssFilters.getCSS = function(id) {
	for (var i=0; i < Spaz.cssFilters.filters.length; i++) {
		if (Spaz.cssFilters.filters[i].id === id) {
			return Spaz.cssFilters.filters[i].css;
		}
	}
	return false;
};

/**
 * apply a given filter 
 */
Spaz.cssFilters.applyFilter = function(id) {
	var css = Spaz.cssFilters.getCSS(id),
	    $style = jQuery('#cssfilter');

	if ($style.length < 1) {
		$style = jQuery('<style id="cssfilter" data-filter="'+id+'" type="text/css"></style>');
		jQuery('head').append($style);
	}
	
	Spaz.cssFilters.currentFilter = id;
	
	$style.text(css);
	$(document).trigger('UNREAD_COUNT_CHANGED');
		
};

/**
 * clear the filter 
 */
Spaz.cssFilters.clearFilter = function() {
	jQuery('#cssfilter').remove();
	Spaz.cssFilters.currentFilter = null;
};

/**
 * add a filter 
 */
Spaz.cssFilters.addFilter = function(data) {
	if ( data.label && data.id && data.css &&
		   !(Spaz.cssFilters.setFilterCSS(data.id, data.css))
		) {
		Spaz.cssFilters.filters.push(data);
	}
};

/**
 * remove a filter 
 */
Spaz.cssFilters.removeFilter = function(id) {
	for (var i=0; i < Spaz.cssFilters.filters.length; i++) {
		if (Spaz.cssFilters.filters[i].id === id) {
			Spaz.cssFilters.filters[i] = null;
			return true;
		}
	}
	return false;
};

/**
 * set CSS for a filter 
 */
Spaz.cssFilters.setFilterCSS = function(id, css) {
	for (var i=0; i < Spaz.cssFilters.filters.length; i++) {
		if (Spaz.cssFilters.filters[i].id === id) {
			Spaz.cssFilters.filters[i].css = css;
			return true;
		}
		Spaz.cssFilters.currentFilter = id;
	}
	return false;
};
