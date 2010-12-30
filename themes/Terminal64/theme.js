/*
	hide the tools toggle and use the header label to trigger it
*/
 (function() {
	var $tmtoggle = $('#tools-menu-toggle');
	var $headerlabel = $('#header-label');

	$tmtoggle.hide();

	$headerlabel.bind('click', 
	function(e) {
		$tmtoggle
		// show it quickly at a certain position so we can position the menu
		.show()
		.css('left', '20px')
		.css('top', '21px')
		.css('opacity', 0);
		$tmtoggle.trigger(e);
		$tmtoggle.hide();
		return false;

	});


})();


// Make #entryform resizable
// TODO: Remember height in prefs
 (function() {
	var $body = $('body'),
		$timeline = $('#timeline-tabs-content, .TabbedPanelsContentGroup'),
		$entryForm = $('#entryform'),
		entryFormBottom = parseInt($entryForm.css('bottom'), 10),
		$entryBoxPopup = $('#entrybox-popup'),
		$resize = $('<div id="entryform-resize"></div>'),
		resizing = false,
		maxEntryFormHeight = function() {
			return nativeWindow.height - 96;
		},
		setEntryFormHeight = function(newHeight) {
			$timeline.css('bottom', newHeight + 28);
			$entryForm.height(newHeight);
			$entryBoxPopup.css('bottom', newHeight - 1);

		},
		onMouseMove = function(ev) {
			if (!resizing) {
				return;
			}

			var newHeight = nativeWindow.height - ev.pageY - entryFormBottom;

			// Set max height: don't overlap header
			newHeight = Math.min(maxEntryFormHeight(), newHeight);

			// Set min height: fit at least one line of text
			newHeight = Math.max(35, newHeight);

			setEntryFormHeight(newHeight);

		},
		onMouseUp = function(ev) {
			resizing = false;
		},
		onMouseEnter = function(ev) {
			resizing = false;
		},
		onMouseOut = function(ev) {
			if (resizing && $(ev.target).is('body')) {
				resizing = false;

			}

		};

	$resize.prependTo($entryForm)
		.mousedown(function(ev) {
			sch.error('mousedown');
			resizing = true;
			$body
			.mouseout(onMouseOut)
			// Must bind this first so it runs first
			.mouseenter(onMouseEnter)
			// Backup for when body mouseout isn't caught
			.mouseup(onMouseUp)
			.mousemove(onMouseMove);

		})
		.mouseup(onMouseUp);

	window.nativeWindow.addEventListener(
		air.NativeWindowBoundsEvent.RESIZE, 
		function() {
			sch.error('air.NativeWindowBoundsEvent.RESIZE');
			var max = maxEntryFormHeight();
			sch.error("max:"+max);
			$entryForm.height();
			if ($entryForm.height() > max) {
				setEntryFormHeight(max);
			}
		}
	);

})();


/**
 * bitmap emoticons are not 80s.
 */
(function() {
	Spaz.TimelineFilters.friends.removeFilter('emoticons');
	Spaz.TimelineFilters['public'].removeFilter('emoticons');
	Spaz.TimelineFilters.lists.removeFilter('emoticons');
	Spaz.TimelineFilters.search.removeFilter('emoticons');
	Spaz.TimelineFilters.other.removeFilter('emoticons');
})();

/**
 * change header label text 
 */
(function() {
	var jqlabel = jQuery('#header-label');
	var html = jqlabel.html();
	html = html.replace('Spaz', 'READY.');
	jqlabel.html(html);
})();

