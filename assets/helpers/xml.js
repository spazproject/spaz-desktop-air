function createXMLFromString (string) {
  var xmlParser, xmlDocument;
  try {
	xmlParser = new DOMParser();
	xmlDocument = xmlParser.parseFromString(string, 'text/xml');
	return xmlDocument;
  }
  catch (e) {
	output("Can't create XML document.");
	return null;
  }
}


