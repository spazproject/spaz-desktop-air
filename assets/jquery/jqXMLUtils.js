// JavaScript Document
if($) {
	//Converts XML DOM to JSON
	$.extend ({
		xmlToJSON: function(xdoc) {
		try {
			if(!xdoc){ return null; }
			var tmpObj = {};
				tmpObj.typeOf = "JSXBObject";
			var xroot = (xdoc.nodeType == 9)?xdoc.documentElement:xdoc;
				tmpObj.RootName = xroot.nodeName;
			if(xdoc.nodeType == 3 || xdoc.nodeType == 4) {
				return xdoc.nodeValue;
			}			
			//Set Object Nodes
			function setObjects(obj, node) {
				var elemName;	//Element name
				var cnode;	//Current Node
				var tObj;	//New subnode
				var cName = "";
				if(!node) { return null; }				
				//Set node attributes if any
				if(node.attributes.length > 0){setAttributes(obj, node);}				
				obj.Text = "";
				if(node.hasChildNodes()) {
					var nodeCount = node.childNodes.length - 1;	
					var n = 0;
					do { //Order is irrelevant (speed-up)
						cnode = node.childNodes[n];
						switch(cnode.nodeType) {
							case 1: //Node
							//Process child nodes
							obj._children = [];
							//SOAP XML FIX to remove namespaces (i.e. soapenv:)
							elemName = (cnode.localName)?cnode.localName:cnode.baseName;
							elemName = formatName(elemName);
							if(cName != elemName) { obj._children.push(elemName); }
								//Create sub elemns array
								if(!obj[elemName]) {
									obj[elemName] = []; //Create Collection
								}
								tObj = {};
								obj[elemName].push(tObj);
								if(cnode.attributes.length > 0) {
									setAttributes(tObj, cnode);
								}
								//Set Helper functions (contains, indexOf, sort, etc);
								if(!obj[elemName].contains) {
									setHelpers(obj[elemName]);
								}	
							cName = elemName;
							if(cnode.hasChildNodes()) {
								setObjects(tObj, cnode); //Recursive Call
							}
							break;
							case 3: //Text Value
							obj.Text += $.trim(cnode.nodeValue);
							break;
							case 4: //CDATA
							obj.Text += (cnode.text)?$.trim(cnode.text):$.trim(cnode.nodeValue);
							break;
						}
					} while(n++ < nodeCount);
				}
			}
			//Set collections
			function setHelpers(grpObj) {
				//Selects a node withing array where attribute = value
				grpObj.getNodeByAttribute = function(attr, obj) {
					if(this.length > 0) {
						var cNode;
						var maxLen = this.length -1;
						try {
							do {
								cNode = this[maxLen];
								if(cNode[attr] == obj) {
									return cNode;
								}
							} while(maxLen--);
						} catch(e) {return false;}
						return false;
					}
				}
				
				grpObj.contains = function(attr, obj) {
					if(this.length > 0) {
						var maxLen = this.length -1;
						try {
							do {
								if(this[maxLen][attr] == obj) {
									return true;
								}
							} while(maxLen--);
						} catch(e) {return false;}
						return false;
					}
				}
				
				grpObj.indexOf = function(attr, obj) {
					var pos = -1;
					if(this.length > 0) {
						var maxLen = this.length -1;
						try {
							do {
								if(this[maxLen][attr] == obj) {
									pos = maxLen;
								}
							} while(maxLen--);
						} catch(e) {return -1;}
						return pos;
					}
				}
				
				grpObj.SortByAttribute = function(col, dir) {
					if(this.length) {				
						function getValue(pair, idx) {
							var out = pair[idx];
							out = (isNumeric(out))?parseFloat(out):out;
							return out;
						}
						function sortFn(a, b) {
							var res = 0;
							var tA, tB;						
							tA = getValue(a, col);
							tB = getValue(b, col);
							if(tA < tB) { res = -1;	} else if(tB < tA) { res = 1; }
							if(dir) {
								res = (dir.toUpperCase() == "DESC")?(0 - res):res;
							}
							return res;
						}
						this.sort(sortFn);
					}
				}
				
				grpObj.SortByValue = function(dir) {
					if(this.length) {
						function getValue(pair) {
							var out = pair.Text;
							out = (isNumeric(out))?parseFloat(out):out;
							return out;
						}
						function sortFn(a, b) {
							var res = 0;
							var tA, tB;
							tA = getValue(a);
							tB = getValue(b);
							if(tA < tB) { res = -1;	} else if(tB < tA) { res = 1; }
							if(dir) {
								res = (dir.toUpperCase() == "DESC")?(0 - res):res;
							}
							return res;
						}
						this.sort(sortFn);
					}
				}
				grpObj.SortByNode = function(node, dir) {
					if(this.length) {
						function getValue(pair, node) {
							var out = pair[node][0].Text;
							out = (isNumeric(out))?parseFloat(out):out;
							return out;
						}
						function sortFn(a, b) {
							var res = 0;
							var tA, tB;
							tA = getValue(a, node);
							tB = getValue(b, node);
							if(tA < tB) { res = -1;	} else if(tB < tA) { res = 1; }
							if(dir) {
								res = (dir.toUpperCase() == "DESC")?(0 - res):res;
							}
							return res;
						}
						this.sort(sortFn);
					}
				}
			}
			//Set Attributes of an object
			function setAttributes(obj, node) {
				if(node.attributes.length > 0) {
					var a = node.attributes.length-1;
					var attName;
					obj._attributes = [];
					do { //Order is irrelevant (speed-up)
						attName = String(formatName(node.attributes[a].name));
						obj._attributes.push(attName);				
						obj[attName] = $.trim(node.attributes[a].value);
					} while(a--);
				}
			}
			//Alters attribute and collection names to comply with JS
			function formatName(name) {
				var regEx = /-/g;
				var tName = String(name).replace(regEx,"_");
				return tName;
			}
			var isNumeric = function(s) {
				var testStr = "";
				if(s && typeof s == "string") { testStr = s; }
				var pattern = /^((-)?([0-9]*)((\.{0,1})([0-9]+))?$)/;
				return pattern.test(testStr);
			}
			//RUN
			setObjects(tmpObj, xroot);
			//Clean-up memmory
			xdoc = null;
			xroot = null;
			return tmpObj;
			
			} catch(e) {
				return null;	
			}
		}		
	})
	
	//Converts Text to XML DOM
	$.extend({
		textToXML: function(strXML) {
			try {
			var xmlDoc = ($.browser.msie)?new ActiveXObject("Microsoft.XMLDOM"):new DOMParser();
				xmlDoc.async = false;
			} catch(e) {throw new Error("XML Parser could not be instantiated");}
			var out;
			try {
				if($.browser.msie) {
					out = (xmlDoc.loadXML(strXML))?xmlDoc:false;
				} else {		
					out = xmlDoc.parseFromString(strXML, "text/xml");
				}
			} catch(e) { throw new Error("Error parsing XML string"); }
			return out;
		}
	})	
} else {
	alert("jQuery library is not present");	
}