var Spaz;
if (!Spaz) Spaz = {};

/***********
Spaz.Wilhelm
***********/
if (!Spaz.Wilhelm) Spaz.Wilhelm = {};


Spaz.Wilhelm.start = function() {
	sch.debug('Applying Flash Filter Dropshadow and Negative');

	if (Spaz.Prefs.get('window-dropshadow')) {
		sch.dump('Applying Flash Filter Dropshadow');

		window.htmlLoader.filters = window.runtime.Array(
			new window.runtime.flash.filters.DropShadowFilter(3, 90, 0, .8, 6, 6),
			new window.runtime.flash.filters.ColorMatrixFilter(([ - 1, 0, 0, 0, 255, 0, -1, 0, 0, 255, 0, 0, -1, 0, 255, 0, 0, 0, 1, 0]))
		);
	} else {
		window.htmlLoader.filters = window.runtime.Array(
			new window.runtime.flash.filters.ColorMatrixFilter(([ - 1, 0, 0, 0, 255, 0, -1, 0, 0, 255, 0, 0, -1, 0, 255, 0, 0, 0, 1, 0]))
		);
	}

	var $wilhelm = $('#wilhelm');
	$wilhelm.center();
	$wilhelm.show(300);
	setTimeout(Spaz.Wilhelm.end, 960); // end with a timeout instead of relying on sound to finish
};

Spaz.Wilhelm.end = function() {
	if (Spaz.Prefs.get('window-dropshadow')) {
		sch.dump('Applying Flash Filter Dropshadow');

		window.htmlLoader.filters = window.runtime.Array(
			new window.runtime.flash.filters.DropShadowFilter(3, 90, 0, .8, 6, 6)
		);
	}
	$('#wilhelm').hide();
};