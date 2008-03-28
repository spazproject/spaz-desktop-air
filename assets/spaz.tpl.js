var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.UI
***********/
if (!Spaz.Tpl) Spaz.Tpl = {};

Spaz.Tpl.parse =function(path, data) {
	tpl = Spaz.Sys.getFileContents(path);
	var jqparsed = $('');
	return jqparsed.html(tpl, data);
}; 