/*
	EXAMPLE:
	var uc = new usernameCompleter( {
		'usernames':usernames,
		'displayDiv':'#matches',
		'textarea':'#messagebox',
		'maxMatches':50
	});
*/

function usernameCompleter(opts) {
	this.usernames		= opts.usernames  || [];
	this.hashtags		= opts.hashtags   || [];
	this.displayDiv		= opts.displayDiv;
	this.textarea 		= opts.textarea;
	this.maxMatches		= opts.maxMatches;

	this.topMatch		= null;
	this.currentStub	= null;
	this.matches    	= null;
	this.curpos			= 0;
	this.before_cursor	= null;


	this.setUsernames = function(usernames) {
		this.usernames = usernames || [];
	}

	this.setHashtags = function(hashtags) {
		this.hashtags = hashtags || [];
	}


	this.init = function() {
		// sch.dump(this.displayDiv);
		
		$(this.displayDiv).hide();
	
		$(this.textarea).bind('keyup', {'thisuc':this }, function(e) {
			var thisuc = e.data.thisuc;	// point back to the caller obj
			
			var $target  = $(e.target);
			var curpos   = $target[0].selectionStart;
			var contents = $target.val();
		
			/*
				Init matches
			*/
			$(thisuc.displayDiv).empty().hide();
			thisuc.curpos	   = curpos;
			thisuc.before_cursor = contents.substr(0,thisuc.curpos);
			
			
			if ( !thisuc.matchAgainst("((@)([a-z0-9_]+))$", 'username') // replies
				 && !thisuc.matchAgainst("^((d )([a-z0-9_]+))$", 'username') // dms
				 && !thisuc.matchAgainst("((#)([a-z0-9_]+))$", 'hashtag') ) { // hashtags
				thisuc.topMatch = null;
			}
			
		});
		
		/*
			capture tab
		*/
		$(this.textarea).bind('keydown', {'thisuc':this}, function(e) {
			
			var thisuc = e.data.thisuc;	
			
			var key = e.charCode || e.keyCode || 0;
			// sch.dump(thisuc);
			
			if (key == 9) { // TAB 
				if (thisuc.topMatch) {
					// sch.dump('topmatch! is '+thisuc.topMatch);
					thisuc.insertMatch(thisuc.topMatch);
					return false;	
				}
			}
			return true;
		});
	}
	
	this.init();
	
	
	/**
	 * @param {string} regstr a regular expression to match against
	 * @param {string} [mode] 'username' or 'hashtag' 
	 */
	this.matchAgainst = function(regstr, mode) {
		var possibilities = [], match;
		
		
		if (mode !== 'hashtag') { mode = 'username' };
		
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
				return ( val.toLowerCase().indexOf(match.toLowerCase()) == 0 && match.length != val.length )
			} );
			if (matching_results.length > 0 && matching_results.length < this.maxMatches) {
				sch.dump('matching_results '+matching_results.toString());
				
				this.topMatch = matching_results[0];
				
				var thisuc = this; // help with scoping
				$.each(matching_results, function() {
					$(thisuc.displayDiv).append('<div title="'+this+'" class="autocomplete-match">'+this+'</div>');
				});
				$(this.displayDiv+' .autocomplete-match').one('click', function() {
					var thismatch = $(this).attr('title');
					thisuc.insertMatch(thismatch);
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
		var stubRE = new RegExp(this.currentStub, 'i')
		match = match.replace(stubRE, '') + ' ';
		var oldtext = $(this.textarea).val();
		newtext = oldtext.substr(0,this.curpos) + match + oldtext.substr(this.curpos);
		$(this.textarea).val(newtext);
		$(this.displayDiv).empty().hide();
		$(this.textarea).focus();
	}
}