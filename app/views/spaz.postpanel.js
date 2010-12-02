

function SpazPostPanel(opts) {

	
	this.container = opts.container || document.getElementById('entryform');
	this.textarea  = opts.textarea	|| document.getElementById('entrybox');
	this.counter   = opts.counter	|| document.getElementById('chars-left-count');
	this.counter_desc	= opts.counter_desc	  || document.getElementById('chars-left-description');
	this.irt_container	= opts.irt_container  || document.getElementById('irt');
	this.$irt_container = jQuery(this.irt_container);
	this.irt_message	= opts.irt_message	  || document.getElementById('irt-message');
	this.$irt_message	= jQuery(this.irt_message);
	this.irt_id_attr	= opts.irt_id_attr	  || 'data-status-id';
	// this.menu	  = opts.menu	   || null;
	this.menus	   = opts.menus		|| {};
	this.maxlen	   = opts.maxlen	|| 140;
	this.on_over   = opts.on_over	|| this.on_over_default;
	this.on_under  = opts.on_under	|| this.on_under_default;
	this.on_submit = opts.on_submit || null;
	// this.shortlink_service = opts.shortlink_service || SPAZCORE_SHORTURL_SERVICE_BITLY;
	this.shortlink_service = opts.shortlink_service || SPAZCORE_SHORTURL_SERVICE_JMP;
	
	this.irt_status = '';
	this.irt_status_id = 0;
	
	this.addListeners();
	this.buildShortenMenu();
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
	
	if (sch.isArray(username)) {
		username = username.join(' @');
	}
	
	if (username) {
		text += username + ' ';
	}

	this.setPostIRT(status_id, status_text);
	
	this.setMessageText(text);
	
};

SpazPostPanel.prototype.prepRetweet = function(screenname, text) {
    this.clearPostIRT();
    this.textarea.focus();
    text = 'RT @' + screenname + ': '+text+'';
    this.setMessageText(text);
};

SpazPostPanel.prototype.prepVia = function(screenname, text) {
    this.clearPostIRT();
    this.textarea.focus();
    text = text +' /via @' + screenname;
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
	return text;
};



SpazPostPanel.prototype.clearPostIRT = function() {
	this.irt_status = '';
	this.irt_status_id = 0;
	this.$irt_container.hide();
	this.$irt_message.attr(this.irt_id_attr, this.irt_status_id)
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
		this.$irt_container.show();
		this.$irt_message.attr(this.irt_id_attr, this.irt_status_id)
			.text(this.irt_status_id);

	}
	
	if (status_text) {
		this.irt_status = status_text;
		this.$irt_message.text(this.irt_status);
	}
	
};




SpazPostPanel.prototype.setMessageText = function(text) {
	this.textarea.value = text;
	this.updateTextMetadata();
};


SpazPostPanel.prototype.getMessageText = function() {
	return this.textarea.value;
};




SpazPostPanel.prototype.addListeners = function() {
	var thisPP = this;
	
	jQuery('#entrybox-popup')
		.mousedown(function(e) {
			thisPP.panelClicked = true;
		})
		.mouseup(function(e) {
			thisPP.panelClicked = false;
			thisPP.textarea.focus();
		});
		
		
	
	jQuery(thisPP.textarea).
		keyup(function(e){ thisPP.updateTextMetadata(); }).
		focus(function(e){
			thisPP.updateTextMetadata();
			Spaz.UI.showEntryboxTip();
			jQuery('#entrybox-popup').fadeIn('fast');
		}).
		blur(function(e){
			thisPP.updateTextMetadata();
			if (!thisPP.panelClicked) {
				sch.debug('panel NOT clicked, blur-ing');
				Spaz.UI.resetStatusBar();
				jQuery("body").focus();
				jQuery('#entrybox-popup').fadeOut('fast');
				thisPP.panelClicked = false;
			} else {
				sch.debug('panel clicked, blocking blur');
			}
			return false;
		});
};

// SpazPostPanel.prototype.removeListeners = function() {
//	sc.helpers.unlisten(this.textarea, 'keyup');
//	sc.helpers.unlisten(this.textarea, 'focus');
//	sc.helpers.unlisten(this.textarea, 'blur');
// };

SpazPostPanel.prototype.updateTextMetadata = function(){
	var thisPP = this;

	// Update character count
	(function(){
		var count = thisPP.textarea.value.length,
			left  = thisPP.maxlen - count;
		thisPP.counter.innerText = left.toString();
		thisPP.counter_desc.innerText = 'left';

		var info = {
			entry_el:	thisPP.textarea,
			count_el:	thisPP.counter,
			curr_count: count,
			left:		left,
			max:		thisPP.maxlen
		};

		if (left < 0) {
			thisPP.on_over.call(thisPP.textarea, info);
		} else {
			thisPP.on_under.call(thisPP.textarea, info);
		}
	})();

	// Add styling hook for DMs
	(function(){
		var $textarea	 = jQuery(thisPP.textarea),
			text		 = $textarea.val(),
			textareaIsDM = $textarea.hasClass('dm'),
			textIsDM	 = text.match(/^d /);

		if(textIsDM && !textareaIsDM){
			$textarea.addClass('dm');
		}else if(!textIsDM && textareaIsDM){
			$textarea.removeClass('dm');
		}
	})();
};

SpazPostPanel.prototype.on_over_default = function(info) {
	jQuery(info.count_el).addClass('over').removeClass('under');
	jQuery(info.entry_el).addClass('over').removeClass('under');
};


SpazPostPanel.prototype.on_under_default = function(info) {
	jQuery(info.count_el).addClass('under').removeClass('over');
	jQuery(info.entry_el).addClass('under').removeClass('over');
};

SpazPostPanel.prototype.buildShortenMenu = function(){
	var thisPP	= this,
		menuId	= 'entrybox-shorten-menu',
		menu,
		$toggle = $('#entrybox-shorten');

	// Build menu
	menu = this.menus.shorten = new SpazMenu({
		base_id:	menuId,
		base_class: 'spaz-menu',
		li_class:	'spaz-menu-item',
		items_func: function(){
			return [
				{
					label:	 'Shorten URLs',
					handler: Spaz.UI.shortenPostPanelURLs
				},
				{
					label:	 'Shorten text',
					handler: Spaz.UI.shortenPostPanelText
				}
			];
		}
	});
	menu.bindToggle($toggle.selector, {
		afterShow: function(e){
			jQuery(thisPP.textarea).focus();
		}
	});
};

SpazPostPanel.prototype.shortenText = function() {
	var stxt = new SpazShortText();
	var shorttext = stxt.shorten(this.getMessageText());
	this.setMessageText(shorttext);
	this.updateTextMetadata();
};

SpazPostPanel.prototype.shortenURLs = function() {
	
	var thisPP = this;
	
	var event_target = this.textarea;
	
	var surl = new SpazShortURL(this.shortlink_service);
	
	var longurls = sc.helpers.extractURLs(this.getMessageText());

	sch.debug(this.getMessageText());
	sch.debug(longurls);

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
	
	function onShortURLSuccess(e, data) {
		Spaz.UI.statusBar('URLs shortened');
		Spaz.UI.hideLoading();		
		
		var newtext = sc.helpers.replaceMultiple(thisPP.getMessageText(), data);
		thisPP.setMessageText(newtext); 
		thisPP.updateTextMetadata();
		sch.unlisten(event_target, sc.events.newShortURLSuccess, onShortURLSuccess);
		sch.unlisten(event_target, sc.events.newShortURLFailure, onShortURLFailure);
	}
	function onShortURLFailure(e) {
		Spaz.UI.statusBar('URL shortening failed');
		Spaz.UI.hideLoading();

		thisPP.updateTextMetadata();
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
			'login':Spaz.Prefs.get('services-bitly-login') || 'spazcore',
			'apiKey':Spaz.Prefs.get('services-bitly-apikey') || 'R_f3b86681a63a6bbefc7d8949fd915f1d'
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
	this.updateTextMetadata();
};
