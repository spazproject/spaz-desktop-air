

function SpazPostPanel(opts) {

	
	this.container = opts.container || document.getElementById('entryform');
	this.textarea  = opts.textarea  || document.getElementById('entrybox');
	this.counter   = opts.counter   || document.getElementById('chars-left-count');
	this.irt_container = opts.irt_container || document.getElementById('irt');
	this.irt_message = opts.irt_message || document.getElementById('irt-message');
	this.irt_id_attr   = opts.irt_id_attr   || 'data-status-id';
	this.menu      = opts.menu      || null;
	this.maxlen    = opts.maxlen    || 140;
	this.on_over   = opts.on_over   || this.on_over_default;
	this.on_under  = opts.on_under  || this.on_under_default;
	this.on_submit = opts.on_submit || null;
	this.shortlink_service = opts.shortlink_service || SPAZCORE_SHORTURL_SERVICE_BITLY;
	
	this.irt_status = '';
	this.irt_status_id = 0;
	
	
	var thisPP = this;
		
	this.updateCharCount = function(e) {

		var curr_count = thisPP.textarea.value.length;
		var left = thisPP.maxlen - curr_count;
		thisPP.counter.innerText = left.toString();
	
	
		var info = {
			'entry_el':thisPP.textarea,
			'count_el':thisPP.counter,
			'curr_count':curr_count,
			'left':left,
			'max':thisPP.maxlen
		};
	
		if (left < 0) {
			thisPP.on_over.call(thisPP.textarea, info);
		} else if (left >= 0) {
			thisPP.on_under.call(thisPP.textarea, info);
		}

	};


	this.addListeners();

}



SpazPostPanel.prototype.prepMessage = function() {
	this.clearPostIRT();
	this.textarea.focus();
	this.setMessageText('');
};

SpazPostPanel.prototype.prepReply = function(username, status_id, status_text) {
	
	this.clearPostIRT();
	
	this.textarea.focus();
	
	var text = '@';
	
    if (username) {
		text += username + ' ';
    }

	this.setPostIRT(status_id, status_text);
	
	this.setMessageText(text);
	
};

SpazPostPanel.prototype.prepRetweet = function(screenname, text) {
	this.clearPostIRT();
	this.textarea.focus();
	var text = 'RT @' + screenname + ': '+text+'';
	this.setMessageText(text);
};

SpazPostPanel.prototype.prepDirectMessage = function(username) {
	this.clearPostIRT();
	this.textarea.focus();
	var text = 'd ';

    if (username) {
		text += (username + ' ');
    }
	this.setMessageText(text);
};

SpazPostPanel.prototype.prepPhotoPost = function(url) {
	
	this.clearPostIRT();
	this.textarea.focus();
	if (!url) {
		return false;
	}

	var text = url + ' ';

	this.setMessageText(text);
};



SpazPostPanel.prototype.clearPostIRT = function() {
	this.irt_status = '';
	this.irt_status_id = 0;
	jQuery(this.irt_container).hide();
	jQuery(this.irt_message).attr(this.irt_id_attr, this.irt_status_id)
							.text(this.irt_status);
};



SpazPostPanel.prototype.shortenText = function() {
	var longtext  = this.getMessageText();
	var shorttext = this.shortener.shorten(longtext);
	this.setMessageText(shorttext);
};




SpazPostPanel.prototype.setPostIRT = function(status_id, status_text) {
	
	if (status_id) {
		this.irt_status_id = status_id;
		jQuery(this.irt_container).show();
		jQuery(this.irt_message).attr(this.irt_id_attr, this.irt_status_id)
								.text(this.irt_status_id);

	}
	
	if (status_text) {
		this.irt_status = status_text;
		jQuery(this.irt_message).text(this.irt_status);
	}
	
};




SpazPostPanel.prototype.setMessageText = function(text) {
	this.textarea.value = text;
	this.updateCharCount();
};


SpazPostPanel.prototype.getMessageText = function() {
	return this.textarea.value;
};




SpazPostPanel.prototype.addListeners = function() {
	/*
		add listeners
	*/
	sc.helpers.listen(this.textarea, 'keyup', this.updateCharCount);
	sc.helpers.listen(this.textarea, 'focus', this.updateCharCount);
	sc.helpers.listen(this.textarea, 'blur', this.updateCharCount);

};

SpazPostPanel.prototype.removeListeners = function() {
	/*
		remove listeners
	*/
	sc.helpers.unlisten(this.textarea, 'keyup', this.updateCharCount);
	sc.helpers.unlisten(this.textarea, 'focus', this.updateCharCount);
	sc.helpers.unlisten(this.textarea, 'blur', this.updateCharCount);

};


SpazPostPanel.prototype.on_over_default = function(info) {
	jQuery(info.count_el).addClass('over').removeClass('under');
	jQuery(info.entry_el).addClass('over').removeClass('under');
};


SpazPostPanel.prototype.on_under_default = function(info) {
	jQuery(info.count_el).addClass('under').removeClass('over');
	jQuery(info.entry_el).addClass('under').removeClass('over');
};


SpazPostPanel.prototype.shortenText = function() {
	var stxt = new SpazShortText();
	var shorttext = stxt.shorten(this.getMessageText());
	this.setMessageText(shorttext);
	this.updateCharCount();
};

SpazPostPanel.prototype.shortenURLs = function() {
	
	var thisPP = this;
	
	var event_target = this.textarea;
	
	var surl = new SpazShortURL(this.shortlink_service);
	
	var longurls = sc.helpers.extractURLs(this.getMessageText());

	/*
		check URL lengths
	*/
	var reallylongurls = [];
	for (var i=0; i<longurls.length; i++) {
		if (longurls[i].length > 25) { // only shorten links longer than 25chars
			reallylongurls.push(longurls[i]);
		}
	}
	
	/*
		drop out if we don't have any URLs
	*/
	if (reallylongurls.length < 1) {
		return;
	}
	
	function onShortURLSuccess(e) {
		Spaz.UI.statusBar('URLs shortened');
		Spaz.UI.hideLoading();		
		
		var data = sch.getEventData(e);
		var newtext = sc.helpers.replaceMultiple(thisPP.getMessageText(), data);
		thisPP.setMessageText(newtext); 
		thisPP.updateCharCount();
		sch.unlisten(event_target, sc.events.newShortURLSuccess, onShortURLSuccess);
		sch.unlisten(event_target, sc.events.newShortURLFailure, onShortURLFailure);
	}
	function onShortURLFailure(e) {
		Spaz.UI.statusBar('URL shortening failed');
		Spaz.UI.hideLoading();

		thisPP.updateCharCount();
		sch.unlisten(event_target, sc.events.newShortURLSuccess, onShortURLSuccess);
		sch.unlisten(event_target, sc.events.newShortURLFailure, onShortURLFailure);
	}
	
	sch.listen(event_target, sc.events.newShortURLSuccess, onShortURLSuccess);
	sch.listen(event_target, sc.events.newShortURLFailure, onShortURLFailure);


	Spaz.UI.statusBar('Shortening URLs in message');
	Spaz.UI.showLoading();
	surl.shorten(reallylongurls, {
		'event_target':event_target,
		'apiopts': {
			'version':'2.0.1',
			'format':'json',
			'login':'spazcore',
			'apiKey':'R_f3b86681a63a6bbefc7d8949fd915f1d'
		}
	});
};


SpazPostPanel.prototype.submit = function() {
	
	if (this.on_submit) {
		this.on_submit.call(this);
	}
};

SpazPostPanel.prototype.disable = function() {
	this.disabled = true;
	this.textarea.setAttribute("disabled","disabled");
};

SpazPostPanel.prototype.enable = function() {
	this.disabled = false;
	this.textarea.removeAttribute("disabled");
};


SpazPostPanel.prototype.reset = function() {
	this.clearPostIRT();
	this.setMessageText('');
	this.updateCharCount();
};
