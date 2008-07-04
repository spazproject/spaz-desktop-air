/***********
Spaz_Tooltip
***********/

var Spaz_Tooltip_Timeout = {};
var Spaz_Tooltip_hideTimeout = {};


function Spaz_Tooltip(opts) {
	this.event		= opts.e;
	this.el			= opts.el;
	this.str		= opts.str;
	this.previewurl = opts.previewurl;
}


Spaz_Tooltip.prototype.show = function() {

	/*
		Hide any open tooltips
	*/
	$('#tooltip').stop().hide().css('width', '').css('height', '');

	/* 
		clear any running tooltip timeouts
	*/
	clearTimeout(Spaz_Tooltip_Timeout);
	clearTimeout(Spaz_Tooltip_hideTimeout);



	/*
		We have to make a closure here to solve the scoping problems 
		with accessing object properties in the setTimeout callback
	*/
	var thisTT = this;
	
	//air.trace('delaying tooltip "'+this.str+'" for 500 mseconds');
	
	Spaz_Tooltip_Timeout = setTimeout(delayedShow, Spaz.Prefs.get('window-tooltipdelay'));
	
	function delayedShow() {
		Spaz.dump('showing tooltip "'+thisTT.str+'"');

		if (!thisTT.event) {
			Spaz.dump('No event found in Spaz_Tooltip.show; returning');
			return;
		}

		// Spaz.dump(thisTT.el);

		// air.trace("message: "+thisTT.str);


		// var minwidth = 100;
		
		// air.trace('EVENT')
		// Spaz.dump(thisTT.event)
		// air.trace('EL')
		// Spaz.dump(thisTT.el)
		// air.trace('STR')
		// Spaz.dump(thisTT.str)
		// air.trace('PREVIEWURL')
		// Spaz.dump(thisTT.previewurl)
		// air.trace('ARGUMENTS')
		// Spaz.dump(arguments)



		// show the tooltip
		$('#tooltip').css('left', thisTT.event.pageX+10)
			.css('top',  thisTT.event.pageY+20)
			.show()
			.css('opacity', 0)
			.animate({'opacity':'0.85'}, {speed:'fast'});
			// .animate({'opacity':'0.85'}, {speed:200, queue:false});

		$('#tooltip').children('.tooltip-msg').html(thisTT.str);
		$('#tooltip').children('.preview').empty();

		// Spaz.dump(tt[0].outerHTML);


		// Reset the .preview div ID so we don't display the wrong preview
		$('#tooltip').children('.preview').attr('id', '')


		if ($(thisTT.el).attr('user-screen_name')) {

			Spaz.dump('This is a user profile tooltip')

			//var username = $(thisTT.el).text().replace(/@/, '');
			var username = $(thisTT.el).attr('user-screen_name');



			Spaz.dump('username is '+username)

			var url = 'http://twitter.com/statuses/user_timeline.json'
			var data = {
				'id':username,
				'count':1
			}


			var previewid = "preview-username-"+username;

			Spaz.dump('previewid = '+previewid);

			$('#tooltip').children('.preview').attr('id', previewid)



			$.get(url, data, function(data, textStatus) {
				// air.trace('textStatus:'+textStatus);
				// air.trace('DATA:'+data);
				try {
					var tweets = JSON.parse(data);

					Spaz.dump(tweets);

					if (tweets.error) {
						Spaz.dump('Error when getting preview data for tooltip');
						$('#tooltip').children('.preview').empty();
						$('#tooltip').children('.preview').append("<div class='error-description'>Could not retrieve user. Probably protected.</div>");
						$('#tooltip').children('.preview').append("<div class='error-message'>Error message from Twitter:\""+tweets.error+"\"</div>");
						Spaz.dump($('#tooltip')[0].outerHTML);
					} else {

						// air.trace('No errors when getting preview data for tooltip');
						if (tweets[0].text) {

							$('#'+previewid).empty();
							$('#'+previewid).append("<img style='float:right' src='"+tweets[0].user.profile_image_url+"' />");
							$('#'+previewid).append("<div><strong>"+tweets[0].user.name+" ("+tweets[0].user.screen_name+")</strong></div>");
							if (tweets[0].user.location) {
								$('#'+previewid).append("<div><em>"+tweets[0].user.location+"</em></div>");
							}
							if (tweets[0].user.followers_count) {
								$('#'+previewid).append("<div><strong>"+tweets[0].user.followers_count+"</strong> followers</div>");
							}
							if (tweets[0].user.description) {
								$('#'+previewid).append("<div>"+tweets[0].user.description+"</div>");
							}
							$('#'+previewid).append('<div class="latest"><strong>Latest:</strong> '+tweets[0].text+'</div>');
							Spaz.dump($('#tooltip')[0].outerHTML);
						}

						$('#'+previewid).fadeIn(500);
						thisTT.resetTooltipPosition();

					}
					Spaz.dump($('#tooltip')[0].outerHTML);
				} catch(e) {
					Spaz.dump("An exception occurred when eval'ing the returned data. Error name: " + e.name 
					+ ". Error message: " + e.message)
				}
			})


		} else if (thisTT.previewurl) {

			Spaz.dump('This is an URL preview tooltip')

			var previewid = "preview-link-"+getTimeAsInt();

			Spaz.dump('previewid = '+previewid);

			$('#tooltip').children('.preview').attr('id', previewid)

			if (thisTT.previewurl.search(/^http:\/\//i) > -1) {

				$.get(thisTT.previewurl, function(rtext, status, xhr) {
					// air.trace('rtext:'+rtext);
					var rtext_matches = rtext.match(/<title>([^<]*)<\/title>/mi);

					// alert(rtext_matches);

					if (rtext_matches && rtext_matches[1]) {			
						var title = rtext_matches[1];
						// air.trace('jqpreview.innerText:'+jqpreview[0].innerText);
						$('#tooltip').children('.preview').empty();
						$('#'+previewid).html('<strong>Title:</strong> '+title);
						$('#'+previewid).fadeIn(500);
						thisTT.resetPosition()
					}
				});
			}


		}


		var vp  = Spaz.UI.getViewport();
		var off = $('#tooltip').offset();

		// air.trace('Viewport:')
		// Spaz.dump(vp);
		// air.trace('Offset:')
		// Spaz.dump(off);

		// check horizontal position
		if (vp.x + vp.cx < off.left + $('#tooltip').width()) {
			// air.trace('horz over')
			$('#tooltip').css('left', parseInt($('#tooltip').css('left')) - ($('#tooltip').width() + 20));
			if ($('#tooltip').offset().left < 5) {
				$('#tooltip').css('left', 5);
			}
		}


		// check vertical position
		if(vp.y + vp.cy < off.top + $('#tooltip').height()) {
			// air.trace('vert over');
			$('#tooltip').css('top', parseInt($('#tooltip').css('top')) - ($('#tooltip').height() + 20));
			if ($('#tooltip').offset().top < 5) {
				$('#tooltip').css('top', 5);
			}
		}

		// air.trace('setting tooltip hide timeout');

		// air.trace('Tooltip hide delay:'+Spaz.Prefs.get('window-tooltiphidedelay'));

		Spaz_Tooltip_hideTimeout = setTimeout(Spaz.UI.hideTooltips, Spaz.Prefs.get('window-tooltiphidedelay'));
		$('#tooltip').bind('mouseout', Spaz.UI.hideTooltips);
	}
	
}






/*
	I kinda stole this from the excellent jquery.tooltip
*/
Spaz_Tooltip.prototype.resetPosition = function() {
	var vp  = Spaz.UI.getViewport();
	var off = $('#tooltip').offset();

	// Spaz.dump(vp);
	// Spaz.dump(off);

	// Spaz.dump('reset width');
	// Spaz.dump("old width: "+$('#tooltip').width());

	var newWidth = vp.cx - off.left - 10;
	$('#tooltip').width( newWidth );

	// Spaz.dump("old width: "+newWidth);
};

