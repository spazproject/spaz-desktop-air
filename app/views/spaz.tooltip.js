/***********
Spaz_Tooltip
***********/

var Spaz_Tooltip_Timeout = {};
var Spaz_Tooltip_hideTimeout = {};


function Spaz_Tooltip(content, opts) {

	sch.dump('OPTS:');
	sch.dump(opts);
	
	this.opts = opts || {};
	
	this.content = content           || this.opts.content || '';
	this.trigger = this.opts.trigger || null;
	this.event   = this.opts.e       || null;
	this.jqtt    = $('#tooltip');
	
	sch.dump('CONTENT:"'+content+'"');
	sch.dump('OPTS:');
	sch.dump(this.opts);
	
	/*
	   append code if missing
	*/
    if (this.jqtt.length < 1) {
        jQuery('#container').append(this.basetpl);
    }

}

Spaz_Tooltip.prototype.basetpl = '<div id="tooltip"> \
	<div class="tooltip-msg"></div> \
	<div class="preview" style="display:none; overflow:hidden; margin-top:.7em"></div> \
</div>';

/**
 * @param {object} [opts] options for showing
 * @param {number} [opts.delay] override the default show delay (default is window-tooltip pref)
 * @param {function} [opts.onShow] a function to call when the tooltip shows
 */
Spaz_Tooltip.prototype.show = function(opts) {

	opts = sch.defaults({
		'delay':Spaz.Prefs.get('window-tooltipdelay'),
		'onShow':null,
		'uuid':sch.UUID
	}, opts);
	
	if (!this.uuid) {
		sch.debug('UUID was not set');
	    this.setUUID(opts.uuid);
	}
	
	
	
	sch.dump('SHOW!!!');
	
	this.hide();
	

	/*
		We have to make a closure here to solve the scoping problems 
		with accessing object properties in the setTimeout callback
	*/
	var thisTT = this;

	Spaz_Tooltip_Timeout = setTimeout(delayedShow, opts.delay);

	/**
	 * a wrapped function to show the tooltip after a timeout 
	 */
	function delayedShow() {
		sch.dump('showing tooltip "' + thisTT.content + '"');

		if (!thisTT.event) {
			sch.debug('No event found in Spaz_Tooltip.show; returning');
			return;
		}

		// show the tooltip
		thisTT.jqtt
			.attr('title', thisTT.uuid) // assign uuid
			.css({ left: thisTT.event.pageX, top: thisTT.event.pageY + 10 })
			.show()
			.css('opacity', 0)
			.animate({ opacity: 1 }, { speed: 'fast' });
		thisTT.jqtt.children('.tooltip-msg').html(thisTT.content);

		var vp  = Spaz.UI.getViewport(),
		    off = thisTT.jqtt.offset();

		(function(){
			var w, h;

			// Keep horizontal position in bounds
			w = thisTT.jqtt.width();
			if (vp.x + vp.cx < off.left + w) {
				thisTT.jqtt.css('left', parseInt(thisTT.jqtt.css('left'), 10) - (w + 20));
				if (thisTT.jqtt.offset().left < 5) {
					thisTT.jqtt.css('left', 5);
				}
			}

			// Keep vertical position in bounds
			h = thisTT.jqtt.height(); // May have changed in the last block
			if (vp.y + vp.cy < off.top + h) {
				thisTT.jqtt.css('top', parseInt(thisTT.jqtt.css('top'), 10) - (h + 20));
				if (thisTT.jqtt.offset().top < 5) {
					thisTT.jqtt.css('top', 5);
				}
			}
		})();

		if (opts.onShow) {
			opts.onShow.call();
		}
		
		Spaz_Tooltip_hideTimeout = setTimeout(Spaz.UI.hideTooltips, Spaz.Prefs.get('window-tooltiphidedelay'));
	}

};


Spaz_Tooltip.prototype.hide    = function() {
	/*
		Hide any open tooltips
	*/
	this.jqtt.stop().hide().css('width', '').css('height', '');
	clearTimeout(Spaz_Tooltip_Timeout);
	clearTimeout(Spaz_Tooltip_hideTimeout);	
};


Spaz_Tooltip.prototype.showIRT = function(irt_id) {
	var thisTT = this;

	var uuid = sch.UUID();
	this.setUUID(uuid);
	
	var content = '';
    content += "<div class='irt-preview-container' id='"+uuid+"'>";
	content += "  <img class='tooltip-user-image' />";
	content += "  <div><strong class='user-name'>In reply to…</strong></div>";
	content += '  <div class="irt"></div>';
	content += "</div>";
	this.setContent(content, uuid);
	this.show();

	sch.listen(this.trigger, 'get_one_status_succeeded', function(e, d) {
		    sch.debug('resetting content');
		    content = '';
		    content += "<div class='irt-preview-container' id='"+uuid+"'>";
        	content += "  <img class='tooltip-user-image' src='"+d.user.profile_image_url+"' />";
        	content += "  <div><strong class='user-name'>"+d.user.name + " (" + d.user.screen_name + ")"+"</strong></div>";
        	content += '  <div class="irt">'+sch.stripTags(d.text)+'</div>';
        	content += "</div>";
		    thisTT.setContent(content, uuid);
		}
	);	
	Spaz.Data.getTweet(irt_id, this.trigger);
};






Spaz_Tooltip.prototype.showUser = function(user_id) {
	var thisTT = this,
	    content = '';
	
	content += "Getting user data…";

	var uuid = sch.UUID();
	this.setUUID(uuid);

	thisTT.setContent(content, uuid);
	thisTT.show();
	
	sch.listen(this.trigger, 'get_user_succeeded', function(e, d){
	    
		var content = '';
		content += "<img class='tooltip-user-image' src='" + d.profile_image_url + "' />";
		content += "<div><strong>" + d.name + " (" + d.screen_name + ")</strong></div>";
		if (d.location) {
			content += "<div><em>" + d.location + "</em></div>";
		}
		if (d.friends_count || d.followers_count) {
			content += '<div>';
			if (d.friends_count) {
				content += '<strong>' + d.friends_count + '</strong> ' +
					'friend' + (d.friends_count === 1 ? '' : 's');
			}
			if (d.followers_count) {
				if (d.friends_count) { content += ' / '; }
				content += '<strong>' + d.followers_count + '</strong> ' +
					'follower' + (d.followers_count === 1 ? '' : 's');
			}
			content += '</div>';
		}
		if (d.description) {
			content += "<div>" + d.description + "</div>";
		}

		thisTT.setContent(content, uuid);
	});
	
	Spaz.Data.getUser(user_id, this.trigger);
};

Spaz_Tooltip.prototype.showURLPreview = function(url) {
	
	var thisTT = this;
	
	var display_url = sch.escape_html(url);
	sch.debug('display_url:'+display_url);
	var uuid = sch.UUID();
	sch.debug('uuid is:'+uuid);
	this.setUUID(uuid);
	
	if (display_url.length > 40) {
		display_url = display_url.substr(0,40)+'…';
	}
	
	var content = '<div class="website-popup" id="'+uuid+'">';
	content += '  <div class="website-title"></div>';
	content += '  <div class="website-url">'+display_url+'</div>';
	content += '</div>';
	this.setContent(content, uuid);
	this.show();
	
	$.get('http://api.getspaz.com/url/title.json', {'url':url}, function(data){
		sch.debug('data:'+data);
		if (sch.isString(data)) {
			data = sch.deJSON(data);
		}
		var content = '<div class="website-popup" id="'+uuid+'">';
		content += '  <div class="website-title">'+data.title+'</div>';
		content += '  <div class="website-url">'+display_url+'</div>';
		content += '</div>';
		thisTT.setContent(content, uuid);
	});
	
	
};

Spaz_Tooltip.prototype.showTitle = function(title) {
    
    var uuid = sch.UUID();
	this.setUUID(uuid);
	
	this.setContent(title, uuid);
	this.show();
};

Spaz_Tooltip.prototype.setTrigger = function(trigger_element) {
	
};

Spaz_Tooltip.prototype.setContent = function(content, uuid) {
    sch.debug('setContent for '+ uuid + " to " + content);
	sch.debug('uuid is '+uuid+'; this.uuid:'+this.uuid);
    sch.debug("this.jqtt.attr('title'):"+this.jqtt.attr('title'));
    if (uuid && this.uuid && (this.uuid != uuid || this.jqtt.attr('title') !== uuid)) {
        sch.debug('UUID did not match, not updating');
        return;
    } else {
        this.content = content;

    	if (this.jqtt) {
    	    this.jqtt.children('.tooltip-msg').html(this.content);
    	}
    }
};

Spaz_Tooltip.prototype.setUUID = function(uuid) {
    this.uuid = uuid;
    if (this.jqtt) {
        this.jqtt.attr('title', uuid);
    }
};

Spaz_Tooltip.prototype.getUUID = function() {
    return this.uuid;
};

/*
	I kinda stole this from the excellent jquery.tooltip
*/
Spaz_Tooltip.prototype.resetPosition = function() {
	var vp = Spaz.UI.getViewport();
	var off = this.jqtt.offset();

	var newWidth = vp.cx - off.left - 10;
	this.jqtt.width(newWidth);
};


