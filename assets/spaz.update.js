/* this is based on code taken from the Adobe AIR prelease forums, used with permission */



var Spaz; if (!Spaz) Spaz = {};


//////////////////////////////////////////////////////////////////////
//
// Spaz.Update
// This handles the update of the application.
//
//////////////////////////////////////////////////////////////////////
if(typeof runtime!='undefined'){
	Spaz.Update = function(currentVersion, updateXMLFileURL, uiDiv)
	{
		this.currentVersion = currentVersion;
		this.updateXMLFileURL = updateXMLFileURL;
		this.uiDiv = uiDiv;
		
		Spaz.Bridge.updaterSetupUIDiv(uiDiv);
		
		this.updateApplicationURL = null;
		
		this.timer = null;
		
		this.updateXMLLoadedProperties = {};
		this.ui = {};
		
		this.urlStream = null;
		this.fileData = null;
	};
	
	Spaz.Update.prototype.setUpdateXMLFileURL = function(updateXMLFileURL)
	{
		this.updateXMLFileURL = updateXMLFileURL;
	};
	
	Spaz.Update.prototype.checkForUpdate = function()
	{
		// starts the update procedure
		
		var ret = Spaz.Bridge.updaterSetupUI();
	
		var self = this;
		
		var reqInfo = new Spaz.Utils.loadURL.Request();
		reqInfo.url = this.updateXMLFileURL;
		reqInfo.successCallback = function(req) { self.parseUpdateXMLFile(req); };
		reqInfo.errorCallback = function(req) { self.errorGettingUpdateXMLFile(req); };
		reqInfo.extractRequestOptions(this.updateXMLFileRequestOptions)
		
		this.timer = setTimeout(function()
		{
			self.timer = null;
			Spaz.Utils.loadURL(reqInfo.method, reqInfo.url, reqInfo.async, reqInfo.successCallback, reqInfo);
		}, 0);    
	};
	
	Spaz.Update.prototype.cancelUpdate = function()
	{
		if (this.timer)
		{
			this.timer.clearTimeout();
			this.timer = null;
		}    
	};
	
	Spaz.Update.prototype.errorGettingUpdateXMLFile = function(req)
	{
		 Spaz.Bridge.updaterHideUI(this.uiDiv);
		
		 var errorStr = "Error getting remote XML descriptor '" + this.updateXMLFileURL + "':\n" + 
			"status: " + req.xhRequest.status + "/" + req.xhRequest.statusText;
			
		 Spaz.Bridge.statusBar(errorStr);
		 Spaz.Utils.reportError(errorStr);
	}
	
	
	Spaz.Update.prototype.parseUpdateXMLFile = function(req)
	{
		var doc = Spaz.Utils.getXMLObject(req.xhRequest);
		if (doc == null) 
		{
		 //  this.uiDiv.style.display = "none";
  		   Spaz.Bridge.updaterHideUI();
		   var errorStr  = "Error parsing remote XML descriptor '" + this.updateXMLFileURL + "'";
		   Spaz.Bridge.statusBar(errorStr);
		   Spaz.Utils.reportError(errorStr);
		   return;
		}
		
		for (var idx = 0; idx < doc.childNodes.length; idx ++)
		{
			var child = doc.childNodes[idx];
			if (child.nodeType == 1)
				if (child.nodeName.toLowerCase() == "ui") 
				{
					// get UI for handling different cases
					for (var j = 0; j < child.childNodes.length; j ++)
					{
						var childui = child.childNodes[j];
						if (childui.nodeType == 1) 
						   this.ui[childui.nodeName] = Spaz.Utils.getTextContent(childui);
					}
				}
				else 
				{
					this.updateXMLLoadedProperties[child.nodeName] = Spaz.Utils.getTextContent(child);
				}
		}
		
		var compared  = Spaz.Update.compareVersions(this.currentVersion, this.updateXMLLoadedProperties['version']);
		switch(compared)
		{
			case 1:
				Spaz.dump('upgrade');
				var str = Spaz.Utils.prepareTemplate(this.ui['upgrade'], this.updateXMLLoadedProperties);
				Spaz.Bridge.updaterHandleUpgrade(str);
				
				break;
				
			case -1:
				Spaz.dump('downgrade');
				Spaz.Bridge.updaterHandleDowngrade();
				break;
			
			case 0:
				Spaz.dump('same');
				Spaz.Bridge.updaterHandleNoUpgrade();
				break;
		}
		// Spaz.Bridge.hideLoading();
	};
	
	
	
	// start of download for the application
	Spaz.Update.prototype.startDownloadNewVersion = function() 
	{
		var self = this;
		var failed = false;
		this.urlStream = new air.URLStream();
		var urlString = this.updateXMLFileURL.substring(0, this.updateXMLFileURL.lastIndexOf("/")) + "/" + this.updateXMLLoadedProperties["filename"];
		
		this.urlStream.addEventListener(air.Event.COMPLETE, function() { if (!failed) { self.loadedComplete();} else { self.loadedFailed(); } });
		this.urlStream.addEventListener(air.IOErrorEvent.IO_ERROR, function() { self.downloadFailed(urlString); });
		this.urlStream.addEventListener(air.HTTPStatusEvent.HTTP_RESPONSE_STATUS, function(ev) { if (ev.status != 200) failed = true; } );    
		this.urlStream.load(new air.URLRequest(urlString));
	};
	
	
	// download completed, write air file to disk
	Spaz.Update.prototype.loadedComplete = function (ev)
	{
		var self = this;
		
		var fileData = new air.ByteArray();
		this.urlStream.readBytes(fileData, 0, this.urlStream.bytesAvailable);
		Spaz.dump("DL filename:"+this.updateXMLLoadedProperties["filename"])
		var appStorageDir = air.File.applicationStorageDirectory;
		Spaz.dump("AppStorageDir:"+appStorageDir.nativePath);
		var file = air.File.applicationStorageDirectory.resolvePath(this.updateXMLLoadedProperties["filename"]);
		
		var fileStream = new air.FileStream();
		fileStream.addEventListener(air.Event.CLOSE, function() { self.triggerUpdate()} );
		fileStream.addEventListener(air.IOErrorEvent.IO_ERROR, function() { Spaz.UI.statusBar("io error filestream"); } );
		fileStream.openAsync(file, air.FileMode.WRITE);
		fileStream.writeBytes(fileData, 0, fileData.length);
		fileStream.close();
	};
	
	// trigger the actual update
	Spaz.Update.prototype.triggerUpdate = function (ev)
	{
		this.uiDiv.innerHTML = "DONE";
	
		var updater = new air.Updater();
		var airFile = air.File.applicationStorageDirectory.resolvePath(this.updateXMLLoadedProperties["filename"]);
		var version = this.updateXMLLoadedProperties['version'];
		updater.update(airFile, version);
	};
	
	
	
	Spaz.Update.prototype.registerForOnStart = function()
	{
		
	};
	
	Spaz.Update.compareVersions = function(currentVersion, siteVersion) 
	{
		
		// alert('currentVersion:'+currentVersion)
		// alert('siteVersion:'+siteVersion)
		
		var siteV = {};
		var currV = {};
		
		var pieces = siteVersion.split('.');
		Spaz.dump(pieces);
		siteV.major = parseInt(pieces[0]);
		siteV.minor = parseInt(pieces[1]);
		siteV.micro = parseInt(pieces[2]);
		siteV.builddate = parseInt(pieces[3]);
		
		var pieces = currentVersion.split('.');
		Spaz.dump(pieces);
		currV.major = parseInt(pieces[0]);
		currV.minor = parseInt(pieces[1]);
		currV.micro = parseInt(pieces[2]);
		currV.builddate = parseInt(pieces[3]);
		
		
		if (siteV.major > currV.major) {
			return 1;
		} else if (siteV.major < currV.major) {
			return -1;
		} else { // minor could still be bigger
			
			if (siteV.minor > currV.minor) {
				return 1;
			} else if (siteV.minor < currV.minor) {
				return -1;
			} else { // micro could still be bigger
				
				if (siteV.micro > currV.micro) {
					return 1;
				} else if (siteV.micro < currV.micro) {
					return -1;
				} else {
					if (siteV.builddate > currV.builddate) {
						return 1;
					} else if (siteV.builddate < currV.builddate) {
						return -1;
					} else {
						return 0;
					}
				}
			}
			
		}
		return 0;
		
		
		// Spaz.dump('site string:'+siteVersion)
		//     var siteVersion = parseFloat(siteVersion);
		// Spaz.dump('site:'+siteVersion)
		// Spaz.dump('current string:'+currentVersion)
		//     var currentVersion = parseFloat(currentVersion);
		// Spaz.dump('current:'+currentVersion)
		//     if (currentVersion < siteVersion) return 1;
		//     if (currentVersion > siteVersion) return -1;
		//     return 0;
	}
	
	
	
	// Prefs stuff
	Spaz.Update.checkUpdate = 1;
	
	Spaz.Update.descriptorURL = 'http://funkatron.com/apps/spaz/AIR/UpdateDescriptor.xml';
	
	
	Spaz.Update.setCheckUpdateState = function(state) {
		Spaz.dump("CheckUpdate State: "+state);
		if (state) {
			Spaz.Update.checkUpdateOn()
		} else {
			Spaz.Update.checkUpdateOff()
		}
	}
	Spaz.Update.checkUpdateOn = function() {
		Spaz.dump("CheckUpdate ON");
		Spaz.Update.checkUpdate = 1;
	}
	Spaz.Update.checkUpdateOff = function() {
		Spaz.dump("CheckUpdate OFF");
		Spaz.Update.checkUpdate = 0;
	}
	
	
	
	

}else{

	Spaz.Update = function(){};
	
	Spaz.Update.setCheckUpdateState = function (state){
		Spaz.Bridge.setCheckUpdateState(state);
	}
	
	Spaz.Update.checkUpdate = function(){
		return Spaz.Bridge.getCheckUpdate();
	}
	
	Spaz.Update.prototype.setupUI = function(){
		var uiDiv;
		var ret = {};
		
		if (this.uiDiv) uiDiv = eSpaz(this.uiDiv);
		if (!uiDiv) {
				uiDiv = document.createElement("div");
				uiDiv.style.overflow = "auto";
				uiDiv.style.backgroundColor = "white";
				uiDiv.style.top = "0px";
				uiDiv.style.left = "0px";           
				uiDiv.setAttribute("id", "SpazUpdate_container");
				document.body.appendChild(uiDiv);
				this.uiDivAppended = true;
		}
		// if (uiDiv.getElementsByTagName("div")[0]) 
		//     uiDiv.getElementsByTagName("div")[0].innerHTML = "Checking for updates...";
		// else
		//    uiDiv.innerHTML = "Checking for updates...";
	
		// Spaz.UI.statusBar('Checking for new version');
		// Spaz.UI.showLoading();
	
		// uiDiv.style.width = document.body.clientWidth + "px";
		// uiDiv.style.height = document.body.clientHeight + "px";
		// uiDiv.style.position = "absolute";    
		//     uiDiv.style.backgroundColor = "white";
		//uiDiv.style.display = "block";
		this.uiDiv=uiDiv;
	}
	
	
	
	Spaz.Update.prototype.handleUpgrade = function(str)
	{
	   this.uiDiv.innerHTML = str; //Spaz.Utils.prepareTemplate(this.ui['upgrade'], this.updateXMLLoadedProperties);
	   
	   Spaz.UI.centerPopup(this.uiDiv.id);
	   this.uiDiv.style.display = "block";
	   var self = this;
	
	   Spaz.Utils.addEventListener("SpazUpdate_update", "click", function() { self.updateBtnClick(); });
	   Spaz.Utils.addEventListener("SpazUpdate_cancel", "click", function() { self.cancelBtnClick(); });
	   Spaz.UI.statusBar('A new version of Spaz is now available');
	};
	
	Spaz.Update.prototype.updateBtnClick = function() 
	{
		// @TODO: check EULA
		Spaz.dump('updateBtnClick()');
		this.uiDiv.innerHTML = 'Downloading upgrade...';
		Spaz.Bridge.startDownloadNewVersion();
	};
	
	Spaz.Update.prototype.cancelBtnClick = function() 
	{
	   if (this.uiDivAppended) 
	   {
		   this.uiDiv.parent.remove(this.uiDiv);    
	   }
	   else 
	   {
		   this.uiDiv.style.display = "none";
	   }
	};
	
	
	Spaz.Update.prototype.handleDowngrade = function()
	{
	   this.cancelBtnClick(); 
	   Spaz.UI.statusBar('The online version is older than your version');
	};
	
	Spaz.Update.prototype.handleNoUpgrade = function()
	{
	   this.cancelBtnClick(); 
	   Spaz.UI.statusBar('You have the newest version');
	};

	
	Spaz.Update.prototype.downloadFailed = function(urlString) 
	{
		Spaz.UI.statusBar("IO Error. The updated application file '" + urlString + "' cannot be downloaded!"); 
		this.cancelBtnClick();
	};
	
	
	Spaz.Update.prototype.loadedFailed = function() 
	{
		Spaz.UI.statusBar("Downloading '" + this.updateXMLLoadedProperties["filename"] + "' has failed!");
		this.cancelBtnClick();
	};

	Spaz.Update.updater = new Spaz.Update();
}




//////////////////////////////////////////////////////////////////////
//
// Spaz.Utils
// Utility functions
//////////////////////////////////////////////////////////////////////

var eSpaz;
if (!eSpaz)
{
	eSpaz = function(element)
	{
		if (arguments.length > 1)
		{
			for (var i = 0, elements = [], length = arguments.length; i < length; i++)
				elements.push(eSpaz(arguments[i]));
			return elements;
		}
		if (typeof element == 'string')
			element = document.getElementById(element);
		return element;
	}
}

if (!Spaz.Utils) Spaz.Utils = {};


Spaz.Utils.addEventListener = function(element, eventType, handler, capture)
{
	try
	{
		element = eSpaz(element);
		if (element.addEventListener)
			element.addEventListener(eventType, handler, capture);
		else if (element.attachEvent)
			element.attachEvent("on" + eventType, handler);
	}
	catch (e) {}
};

Spaz.Utils.removeEventListener = function(element, eventType, handler, capture)
{
	try
	{
		element = eSpaz(element);
		if (element.removeEventListener)
			element.removeEventListener(eventType, handler, capture);
		else if (element.detachEvent)
			element.detachEvent("on" + eventType, handler);
	}
	catch (e) {}
};


Spaz.Utils.prepareTemplate = function(template, replacements)
{
	var returnStr = template;
	for (var r in replacements)
	{
		 var re = new RegExp("{" + r +  "}", "gi");
		 returnStr = returnStr.replace(re, replacements[r]);   
	}
	return returnStr;
}

Spaz.Utils.setOptions = function(obj, optionsObj, ignoreUndefinedProps)
{
	if (!optionsObj)
		return;

	for (var optionName in optionsObj)
	{
		if (ignoreUndefinedProps && optionsObj[optionName] == undefined)
			continue;
		obj[optionName] = optionsObj[optionName];
	}
};

Spaz.Utils.reportError = function(str)
{
	Spaz.dump(str);
}

Spaz.Utils.getXMLObject = function(xhRequest) 
{
	var resp = xhRequest.responseXML;
	
	var manualParseRequired = false;

	if (xhRequest.status != 200)
	{
		if (xhRequest.status == 0)
		{
			if (xhRequest.responseText && (!resp || !resp.firstChild))
				manualParseRequired = true;
		}
	}
	else if (!resp)
	{
		// The server said it sent us data, but for some reason we don't have
		// an XML DOM document. 
		// Try to manually parse the XML string, just in case the server
		// gave us an unexpected Content-Type.
		manualParseRequired = true;
	}

	if (manualParseRequired)
	{
		try
		{
			var domParser = new DOMParser;
			resp = domParser.parseFromString(str, 'text/xml');
		}
		catch (e)
		{
			resp = null;
		}
		
	}
	var resp = resp.documentElement;
	if (!resp  || !resp.firstChild || resp.firstChild.nodeName == "parsererror" || resp.firstChild.nodeName == 'body')
		return null;

	return resp;
}

Spaz.Utils.getTextContent = function(oNode)
{
	var text = ""; 
	if (oNode) 
	{   
		// W3C DOM Level 3 
		if (typeof oNode.textContent != "undefined")
		{
			text = oNode.textContent; 
		}
		// W3C DOM Level 2 
		else
		{
			if (oNode.childNodes && oNode.childNodes.length)
			for (var i = oNode.childNodes.length; i--; i>0) 
			{ 
				  var o = oNode.childNodes[i]; 
				  if (o.nodeType == 3 /* Node.TEXT_NODE */) 
					  text = o.nodeValue + text; 
				  else 
					  text = Spaz.Utils.getTextContent(o) + text; 
			}
		}
	}
	return text;
}

Spaz.Utils.loadURL = function(method, url, async, callback, opts)
{
	var req = new Spaz.Utils.loadURL.Request();
	req.method = method;
	req.url = url;
	req.async = async;
	req.successCallback = callback;
	Spaz.Utils.setOptions(req, opts);

	try
	{
		req.xhRequest = new XMLHttpRequest();

		if (req.async)
			req.xhRequest.onreadystatechange = function() { Spaz.Utils.loadURL.callback(req); };

		req.xhRequest.open(req.method, req.url, req.async, req.username, req.password);

		if (req.headers)
		{
			for (var name in req.headers)
				req.xhRequest.setRequestHeader(name, req.headers[name]);
		}

		req.xhRequest.send(req.postData);

		if (!req.async)
			Spaz.Utils.loadURL.callback(req);
	}
	catch(e) { req = null; Spaz.Utils.reportError("Exception caught while loading " + url + ": " + e); }

	return req;
};

Spaz.Utils.loadURL.callback = function(req)
{
	if (!req || req.xhRequest.readyState != 4)
		return;
	if (req.successCallback && (req.xhRequest.status == 200 || req.xhRequest.status == 0))
		req.successCallback(req);
	else if (req.errorCallback)
		req.errorCallback(req);
};

Spaz.Utils.loadURL.Request = function()
{
	var props = Spaz.Utils.loadURL.Request.props;
	var numProps = props.length;

	for (var i = 0; i < numProps; i++)
		this[props[i]] = null;

	this.method = "GET";
	this.async = true;
	this.headers = {};
};

Spaz.Utils.loadURL.Request.props = [ "method", "url", "async", "username", "password", "postData", "successCallback", "errorCallback", "headers", "userData", "xhRequest"];

Spaz.Utils.loadURL.Request.prototype.extractRequestOptions = function(opts, undefineRequestProps)
{
	if (!opts)
		return;

	var props = Spaz.Utils.loadURL.Request.props;
	var numProps = props.length;

	for (var i = 0; i < numProps; i++)
	{
		var prop = props[i];
		if (opts[prop] != undefined)
		{
			this[prop] = opts[prop];
			if (undefineRequestProps)
				opts[prop] = undefined;
		}
	}
};