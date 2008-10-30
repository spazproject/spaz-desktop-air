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
	this.usernames		= opts.usernames;
	this.displayDiv		= opts.displayDiv;
	this.textarea 		= opts.textarea;
	this.maxMatches		= opts.maxMatches;

	this.topMatch		= null;
	this.currentStub	= null;
	this.matches    	= null;
	this.curpos			= 0;
	this.before_cursor	= null;

	this.init = function() {
		// air.trace(this.displayDiv);
		
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
			
			
			if ( !thisuc.matchAgainst("((@)([a-z0-9_]+))$") // replies
				 && !thisuc.matchAgainst("^((d )([a-z0-9_]+))$") ) { // dms
				// air.trace('Resetting topMatch to null');
				thisuc.topMatch = null;
			}
			
		});
		
		/*
			capture tab
		*/
		$(this.textarea).bind('keydown', {'thisuc':this}, function(e) {
			
			var thisuc = e.data.thisuc;	
			
			var key = e.charCode || e.keyCode || 0;
			// air.trace(thisuc);
			
			if (key == 9) { // TAB 
				if (thisuc.topMatch) {
					// air.trace('topmatch! is '+thisuc.topMatch);
					thisuc.insertUsername(thisuc.topMatch);
					return false;	
				}
			}
			return true;
		});
	}
	
	this.init();
	
	this.matchAgainst = function(regstr) {
		var dmrgx = new RegExp(regstr, "gim");
		var reg_matches = dmrgx.exec(this.before_cursor);
		if ( reg_matches ) {
			var username = reg_matches[3];
			this.currentStub = username;
			// air.trace('Looks like message to '+username);
			
			var matching_users = this.usernames.filter( function(val) {
				return ( val.toLowerCase().indexOf(username.toLowerCase()) == 0 && username.length != val.length )
			} );
			if (matching_users.length > 0 && matching_users.length < this.maxMatches) {
				air.trace('matching_users '+matching_users.toString());
				
				this.topMatch = matching_users[0];
				
				var thisuc = this; // help with scoping
				$.each(matching_users, function() {
					// // air.trace('appending div title="'+this+'" class="username-match"'+this+'/div to');
					$(thisuc.displayDiv).append('<div title="'+this+'" class="username-match">'+this+'</div>');
				});
				$(this.displayDiv+' .username-match').one('click', function() {
					var username = $(this).attr('title');
					thisuc.insertUsername(username);
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
	
	this.insertUsername = function(username) {
		// air.trace('inserting '+username);
		// remove stub from username
		var stubRE = new RegExp(this.currentStub, 'i')
		username = username.replace(stubRE, '');
		// air.trace('username is now '+username);
		var oldtext = $(this.textarea).val();
		newtext = oldtext.substr(0,this.curpos) + username + oldtext.substr(this.curpos);
		$(this.textarea).val(newtext);
		$(this.displayDiv).empty().hide();
		$(this.textarea).focus();
	}
}