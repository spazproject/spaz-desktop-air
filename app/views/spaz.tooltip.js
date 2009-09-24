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
	


}


Spaz_Tooltip.prototype.show = function() {
	
	sch.dump('SHOW!!!');
	
	this.hide();

	/*
		We have to make a closure here to solve the scoping problems 
		with accessing object properties in the setTimeout callback
	*/
	var thisTT = this;

	Spaz_Tooltip_Timeout = setTimeout(delayedShow, Spaz.Prefs.get('window-tooltipdelay'));

	/**
	 * a wrapped function to show the tooltip after a timeout 
	 */
	function delayedShow() {
		sch.dump('showing tooltip "' + thisTT.content + '"');

		if (!thisTT.event) {
			sch.error('No event found in Spaz_Tooltip.show; returning');
			return;
		}


		// show the tooltip
		thisTT.jqtt.css('left', thisTT.event.pageX + 10)
			.css('top', thisTT.event.pageY + 20)
			.show()
			.css('opacity', 0)
			.animate({
						'opacity': '1.0'
					},
					{
						speed: 'fast'
					});
		thisTT.jqtt.children('.tooltip-msg').html(thisTT.content);


		var vp  = Spaz.UI.getViewport();
		var off = thisTT.jqtt.offset();

		// check horizontal position
		if (vp.x + vp.cx < off.left + thisTT.jqtt.width()) {
			thisTT.jqtt.css('left', parseInt(thisTT.jqtt.css('left')) - (thisTT.jqtt.width() + 20));
			if (thisTT.jqtt.offset().left < 5) {
				thisTT.jqtt.css('left', 5);
			}
		}


		// check vertical position
		if (vp.y + vp.cy < off.top + thisTT.jqtt.height()) {
			thisTT.jqtt.css('top', parseInt(thisTT.jqtt.css('top')) - (thisTT.jqtt.height() + 20));
			if (thisTT.jqtt.offset().top < 5) {
				thisTT.jqtt.css('top', 5);
			}
		}
		
		
		Spaz_Tooltip_hideTimeout = setTimeout(Spaz.UI.hideTooltips, Spaz.Prefs.get('window-tooltiphidedelay'));
	}

}


Spaz_Tooltip.prototype.hide    = function() {
	/*
		Hide any open tooltips
	*/
	this.jqtt.stop().hide().css('width', '').css('height', '');
	clearTimeout(Spaz_Tooltip_Timeout);
	clearTimeout(Spaz_Tooltip_hideTimeout);

	
}

Spaz_Tooltip.prototype.showIRT = function(irt_id) {
	var thisTT = this;
	
	sch.listen(this.trigger, 'get_one_status_succeeded', show);
	
	sch.dump('IRT_ID:'+irt_id);
	
	Spaz.Data.getTweet(irt_id, this.trigger);
	
	function show(e) {
		
		var d = sch.getEventData(e);
		var content = '';

		content += "<img style='float:right' src='" + d.user.profile_image_url + "' />";
		content += "<div><strong>" + d.user.name + " (" + d.user.screen_name + ")</strong></div>";
		content += '<div class="irt">' + sch.stripTags(d.text) + '</div>';
		
		thisTT.setContent(content);
		thisTT.show();
	}
};


Spaz_Tooltip.prototype.showUser = function(user_id) {
	var thisTT = this;
	
	sch.listen(this.trigger, 'get_user_succeeded', show);
	
	Spaz.Data.getUser(user_id, this.trigger);
	
	function show(e) {
		
		var d = sch.getEventData(e);
		
		var content = '';
		content += "<img style='float:right' src='" + d.profile_image_url + "' />";
		content += "<div><strong>" + d.name + " (" + d.screen_name + ")</strong></div>";
		if (d.location) {
			content += "<div><em>" + d.location + "</em></div>";
		}
		if (d.followers_count) {
			content += "<div><strong>" + d.followers_count + "</strong> followers</div>";
		}
		if (d.description) {
			content += "<div>" + d.description + "</div>";
		}
		// content += '<div class="latest"><strong>Latest:</strong> ' + d.text + '</div>';
		
		thisTT.setContent(content);
		thisTT.show();
	}
	
}

Spaz_Tooltip.prototype.showURLPreview = function(url) {
	var display_url = sch.escape_html(url);
	// if (display_url.length > 40) {
	// 	display_url = display_url.substr(0,40)+'…';
	// }
	
	sch.dump('showing URL preview');
	sch.dump(url);
	sch.dump(display_url);
	
	
	var content  = '<div>'+display_url+'</div>';
	// content += '<img src="http://images.websnapr.com/?url=';
	// content += encodeURIComponent(url);
	// content += '" alt="Loading thumbnail…" height="152" width="202" />';
	this.setContent(content);
	this.show();
}

Spaz_Tooltip.prototype.showTitle = function(title) {
	this.setContent(title);
	this.show();
}

Spaz_Tooltip.prototype.setTrigger = function(trigger_element) {
	
};

Spaz_Tooltip.prototype.setContent = function(content) {
	this.content = content;
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


