/*
	EXAMPLE:
	var uc = new usernameCompleter( {
		'usernames':usernames,
		'displayDiv':'#matches',
		'textarea':'#messagebox',
		'maxMatches':50,
		'timeout': 500
	});
*/

function usernameCompleter(opts) {
	this.usernames		= opts.usernames  || [];
	this.hashtags		= opts.hashtags   || [];
	this.displayDiv		= opts.displayDiv;
	this.textarea 		= opts.textarea;
	this.maxMatches		= opts.maxMatches;
	this.timeout        = opts.timeout || 250; // the delay, in ms, before firing the autocomplete lookup
	
	this.timeoutID      = null; // holds the timeout function ID, so we can clear it
	this.topMatch		= null;
	this.currentStub	= null;
	this.matches    	= null;
	this.curpos			= 0;
	this.before_cursor	= null;


	this.setUsernames = function(usernames) {
		this.usernames = usernames || [];
	};

	this.setHashtags = function(hashtags) {
		this.hashtags = hashtags || [];
	};


	this.init = function() {
		var that = this;
		
		$(this.displayDiv).hide();
	
		$(this.textarea).bind('keyup', function(e) {
			clearTimeout(that.timeoutID);
			that.timeoutID = setTimeout(function() {
				sch.debug('Firing autocomplete lookup');
				var $target  = $(e.target);
				var curpos   = $target[0].selectionStart;
				var contents = $target.val();

				/*
					Init matches
				*/
				$(that.displayDiv).empty().hide();
				that.curpos	   = curpos;
				that.before_cursor = contents.substr(0,that.curpos);


				if ( !that.matchAgainst("((@)([a-z0-9_]+))$", 'username') // replies
					 && !that.matchAgainst("^((d )([a-z0-9_]+))$", 'username') // dms
					 && !that.matchAgainst("((#)([a-z0-9_]+))$", 'hashtag') ) { // hashtags
					that.topMatch = null;
				}
			}, that.timeout);
			
		});
		
		/*
			capture tab
		*/
		$(this.textarea).bind('keydown', function(e) {
			
			var key = e.charCode || e.keyCode || 0;
			// sch.dump(that);
			
			if (key == 9) { // TAB 
				if (that.topMatch) {
					// sch.dump('topmatch! is '+that.topMatch);
					that.insertMatch(that.topMatch);
					return false;	
				}
			}
			return true;
		});
	};
	
	this.init();
	
	
	/**
	 * @param {string} regstr a regular expression to match against
	 * @param {string} [mode] 'username' or 'hashtag' 
	 */
	this.matchAgainst = function(regstr, mode) {
		var possibilities = [], match;
		
		
		if (mode !== 'hashtag') { mode = 'username'; };
		
		sch.debug("mode:"+mode);
		sch.debug("regstr:"+regstr);
		
		switch (mode) {
			case 'username':
				possibilities = this.usernames;
				break;
			case 'hashtag' :
				possibilities = this.hashtags;
				break;
			default:
				possibilities = this.usernames;
		}
		
		sch.debug('possibilities:');
		sch.debug(possibilities);
		
		sch.debug(this.before_cursor);
		
		
		
		if (possibilities.length < 1) {
			return false;
		}
		
		var dmrgx = new RegExp(regstr, "gim");
		var reg_matches = dmrgx.exec(this.before_cursor);
		if ( reg_matches ) {
			match = reg_matches[3];
			this.currentStub = match;
			sch.dump('Looks like message to '+match);
			
			var matching_results = possibilities.filter( function(val) {
				return ( val.toLowerCase().indexOf(match.toLowerCase()) == 0 && match.length != val.length );
			} );
			if (matching_results.length > 0 && matching_results.length < this.maxMatches) {
				sch.dump('matching_results '+matching_results.toString());
				
				this.topMatch = matching_results[0];
				
				var that = this; // help with scoping
				$.each(matching_results, function() {
					$(that.displayDiv).append('<div title="'+this+'" class="autocomplete-match">'+this+'</div>');
				});
				$(this.displayDiv+' .autocomplete-match').one('click', function() {
					var thismatch = $(this).attr('title');
					that.insertMatch(thismatch);
				});
				
				var bottom = $('BODY').outerHeight() - $(this.textarea).offset().top;
				
				$(this.displayDiv).css('bottom', bottom);
				$(this.displayDiv).show();
				return true;
			}
		} else {
			return false;
		}
	};
	
	/**
	 * @param {string} match the match to insert 
	 */
	this.insertMatch = function(match) {
		// remove stub from match
		var stubRE = new RegExp(this.currentStub, 'i');
		match = match.replace(stubRE, '') + ' ';
		var oldtext = $(this.textarea).val();
		newtext = oldtext.substr(0,this.curpos) + match + oldtext.substr(this.curpos);
		$(this.textarea).val(newtext);
		$(this.displayDiv).empty().hide();
		$(this.textarea).focus();
	};
}