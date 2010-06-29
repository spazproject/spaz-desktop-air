var Spaz; if (!Spaz) Spaz = {};

/*************
Spaz.Uploadservice
*************/
if (!Spaz.Uploadservice) Spaz.Uploadservice = {};


/*
	parseResponse should return one of these key/val pairs:
	- {'url':'http://foo.bar/XXXX'}
	- {'error':'Error message'}
*/
Spaz.Uploadservice.services = {
	'drippic' : {
		'url' : 'http://drippic.com/drippic2/upload',
		'parseResponse': function(data) {
			
			var parser=new DOMParser();
			xmldoc = parser.parseFromString(data,"text/xml");

			var status;
			var rspAttr = xmldoc.getElementsByTagName("rsp")[0].attributes;
			status = rspAttr.getNamedItem("stat").nodeValue;
			
			if (status == 'ok') {
				var mediaurl = $(xmldoc).find('mediaurl').text();
				return {'url':mediaurl};
			} else {
				var errAttributes;
				if (xmldoc.getElementsByTagName("err")[0]) {
					errAttributes = xmldoc.getElementsByTagName("err")[0].attributes;
				} else {
					errAttributes = xmldoc.getElementsByTagName("error")[0].attributes;
				}
				
				sch.error(errAttributes);
				errMsg = errAttributes.getNamedItem("msg").nodeValue;
				sch.error(errMsg);
				return {'error':errMsg};
			}
		}
	},
	'pikchur' : {
		'url'  : 'http://api.pikchur.com/simple/upload',
		'extra': {
			'api_key':'MzTrvEd/uPNjGDabr539FA',
			'source':'Spaz'
		},
		'parseResponse': function(data) {
			var parser=new DOMParser();
			xmldoc = parser.parseFromString(data,"text/xml");
	
			var status;
			var rspAttr = xmldoc.getElementsByTagName("rsp")[0].attributes;
			status = rspAttr.getNamedItem("stat").nodeValue;
			
			if (status == 'ok') {
				var mediaurl = $(xmldoc).find('mediaurl').text();
				return {'url':mediaurl};
			} else {
				var errAttributes;
				if (xmldoc.getElementsByTagName("err")[0]) {
					errAttributes = xmldoc.getElementsByTagName("err")[0].attributes;
				} else {
					errAttributes = xmldoc.getElementsByTagName("error")[0].attributes;
				}
				
				sch.error(errAttributes);
				errMsg = errAttributes.getNamedItem("msg").nodeValue;
				sch.error(errMsg);
				return {'error':errMsg};
			}
		}
	},
	// 'yfrog' : {
	// 	'url' : 'http://yfrog.com/api/xauth_upload',
	// 	'extra': {
	// 		'key':'579HINUYe8d826dd61808f2580cbda7f13433310'
	// 	},
	// 	'parseResponse': function(data) {
	// 		
	// 		var parser=new DOMParser();
	// 		xmldoc = parser.parseFromString(data,"text/xml");
	// 
	// 		var status;
	// 		var rspAttr = xmldoc.getElementsByTagName("rsp")[0].attributes;
	// 		status = rspAttr.getNamedItem("stat").nodeValue;
	// 		
	// 		if (status == 'ok') {
	// 			var mediaurl = $(xmldoc).find('mediaurl').text();
	// 			return {'url':mediaurl};
	// 		} else {
	// 			var errAttributes;
	// 			if (xmldoc.getElementsByTagName("err")[0]) {
	// 				errAttributes = xmldoc.getElementsByTagName("err")[0].attributes;
	// 			} else {
	// 				errAttributes = xmldoc.getElementsByTagName("error")[0].attributes;
	// 			}
	// 			
	// 			sch.error(errAttributes);
	// 			errMsg = errAttributes.getNamedItem("msg").nodeValue;
	// 			sch.error(errMsg);
	// 			return {'error':errMsg};
	// 		}
	// 		
	// 	}
	// },
	'twitpic' : {
		'url' : 'http://api.twitpic.com/2/upload.json',
		'extra': {
			'key':'3d8f511397248dc913193a6195c4a018'
		},
		'parseResponse': function(data) {
			
			if (sch.isString(data)) {
				data = sch.deJSON(data);
			}
			
			if (data.url) {
				return {'url':data.url};
			} else {
				return {'error':'unknown error'};
			}
			
		}
	},
	'twitgoo' : {
		'url'  : 'http://twitgoo.com/api/upload',
		'extra': {
			'format':'xml',
			'source':'Spaz',
			'source_url':'http://getspaz.com'
		},
		'parseResponse': function(data) {
			
			var parser=new DOMParser();
			xmldoc = parser.parseFromString(data,"text/xml");

			var status;
			var rspAttr = xmldoc.getElementsByTagName("rsp")[0].attributes;
			status = rspAttr.getNamedItem("status").nodeValue;

			if (status == 'ok') {
				var mediaurl = $(xmldoc).find('mediaurl').text();
				return {'url':mediaurl};
			} else {
				var errAttributes;
				if (xmldoc.getElementsByTagName("err")[0]) {
					errAttributes = xmldoc.getElementsByTagName("err")[0].attributes;
				} else {
					errAttributes = xmldoc.getElementsByTagName("error")[0].attributes;
				}

				sch.error(errAttributes);
				errMsg = errAttributes.getNamedItem("msg").nodeValue;
				sch.error(errMsg);
				return {'error':errMsg};
			}
			
		}
	}
};


Spaz.Uploadservice.getAuthHeader = function(opts) {
	
	opts = sch.defaults({
		'getEchoHeaderOpts':{}
	}, opts);
	
	var auth_header;
	var user = Spaz.Prefs.getUser();
	var pass = Spaz.Prefs.getPass();
	
	if (Spaz.Prefs.get('twitter-api-base-url').indexOf('twitter.com') != -1) { // this is Twitter. hopefully

		SpazAuth.addService(SPAZCORE_ACCOUNT_TWITTER, {
			authType: SPAZCORE_AUTHTYPE_OAUTH,
			consumerKey: SPAZCORE_CONSUMERKEY_TWITTER,
			consumerSecret: SPAZCORE_CONSUMERSECRET_TWITTER,
			accessURL: 'https://twitter.com/oauth/access_token'
		});

		var prefs = new SpazPrefs(null, 'spazcore_prefs');
		prefs.load();
		var accts = new SpazAccounts(prefs);
		var auth  = new SpazAuth(SPAZCORE_ACCOUNT_TWITTER);

		if ( !(account_id = prefs.get(user + '_account_id')) ) {
			
			try {
				var rs = auth.authorize(user, pass);
			} catch(e) {
				sch.error(e);
				rs = false;
			}
			if(rs) {
				account_id = accts.add(user, auth.save(), SPAZCORE_ACCOUNT_TWITTER).id;
				prefs.set(user + '_account_id', account_id);
			} else {
				
			}
		}
		if (account_id) {
			var account = accts.get(account_id);
			auth.load(account.auth);
			var twit	= new SpazTwit({'auth':auth});
			auth_header = twit.getEchoHeader(opts.getEchoHeaderOps);
		}
	} else {
		pass = Spaz.Prefs.getPass();
		auth_header = "Basic " + Base64.encode(user + ":" + pass);
	}
	
	sch.error(auth_header);
	return auth_header;

};


Spaz.Uploadservice.upload = function(opts) {

	var srvc = Spaz.Uploadservice.services[opts.service];

	opts = sch.defaults({
		extra:{}
	}, opts);

	/*
		file url
	*/
	opts.url      = srvc.url;
	if (srvc.extra) {
		opts.extra = jQuery.extend(opts.extra, srvc.extra);
	}
	
	var onSuccess;
	if (srvc.parseResponse) {
		onSuccess = function(data) {
			var rs = srvc.parseResponse.call(srvc, data);
			return opts.onSuccess(rs);
		};
	} else {
		onSuccess = opts.onSuccess;
	}
	
	/*
		get auth stuff
	*/
	var auth_header;
	if (opts.service == 'yfrog') {
		verify_url  = 'https://api.twitter.com/1/account/verify_credentials.xml';
		auth_header = Spaz.Uploadservice.getAuthHeader({
			'getEchoHeaderOpts': {
				'verify_url':verify_url
			}
		});
	} else {
		verify_url  = 'https://api.twitter.com/1/account/verify_credentials.json';
		auth_header = Spaz.Uploadservice.getAuthHeader();
	}
	
	if (auth_header.indexOf('Basic ') === 0) {
		opts.username = Spaz.Prefs.getUser();
		opts.password = Spaz.Prefs.getPass();
	} else {
		opts.headers = {
			'X-Auth-Service-Provider': verify_url,
			'X-Verify-Credentials-Authorization':auth_header
		};
		
	}
	
	sch.error(sch.enJSON(opts));
	
	sc.helpers.HTTPUploadFile(opts, onSuccess, opts.onFailure);
	
};
