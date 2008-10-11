var Spaz; if (!Spaz) Spaz = {};


/***********
Spaz.Editor
************/
if (!Spaz.Editor) Spaz.Editor = {};


Spaz.Editor.bold = function() {
	Spaz.Editor.$wrap('**', '**');
}


Spaz.Editor.italics = function() {
	Spaz.Editor.$wrap('*', '*');
}

Spaz.Editor.code = function() {
	Spaz.Editor.$wrap('`', '`');
}

Spaz.Editor.link = function() {
	Spaz.Editor.$wrap('[', '](http://)', -8, -1);
}


Spaz.Editor.preview = function() {
	var converter = new Showdown.converter();
	$('#preview').html(converter.makeHtml($('#entrybox').val()));
}


// selstart and selend are from the END! 
Spaz.Editor.$wrap = function(open, close, selstart, selend) {
	if (!selstart) {
		selstart = 0
	}
	if (!selend) {
		selend = 0
	}
	
	var editor = $('#entrybox')
	var start = editor[0].selectionStart;
	var end = editor[0].selectionEnd;
	var len = editor.val().length;
	var s1 = editor.val().substring(0,start);
    var s2 = editor.val().substring(start, end)
    var s3 = editor.val().substring(end, len);
		
	editor.val(s1 + open + s2 + close + s3)

	if (s2.length == 0) {
		editor[0].setSelectionRange((s1 + open).length, (s1 + open).length);
	} else {
		editor[0].setSelectionRange((s1 + open + s2 + close).length + selstart, (s1 + open + s2 + close).length + selend);
	}
	// preview()
}




Spaz.Editor.initSuggestions = function() {
	
	air.trace("old: " + Spaz.uc.usernames);
	Spaz.uc.usernames = Spaz.Cache.getScreenNamesAsTags();
	air.trace("new: " + Spaz.uc.usernames);
	
	
	// $('#entrybox').tagSuggest({
	// 	'tags':Spaz.Cache.getScreenNamesAsTags(),
	// 	'tagContainerId':'suggestions',
	// 	'tagWrap':'li',
	// 	delay:100,
	// });

};