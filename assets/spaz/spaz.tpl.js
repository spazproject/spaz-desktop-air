var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.UI
***********/
if (!Spaz.Tpl) Spaz.Tpl = {};

Spaz.Tpl.parse =function(path, data) {
	var tpl		= Spaz.Sys.getFileContents(path);
	var parsed  = Spaz.Sys.ClassicSB.parseTpl(tpl, data, path)
	return parsed;
};