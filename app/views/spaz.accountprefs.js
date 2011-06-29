Spaz.AccountPrefs = {};


Spaz.AccountPrefs.init = function(){

	this.spaz_acc = Spaz.Prefs._accounts;
	
	
	this.metavals = ['twitter-api-accesskey', 'twitter-api-base-url', 'twitter-disable-direct-posting', 'services-pingfm-userappkey', 'services-pingfm-enabled', 'services-pingfm-sendreplies', 'services-shortie-email', 'services-shortie-secretkey', 'services-twitpic-sharepassword'];
	
	this.checkboxes = ['twitter-disable-direct-posting', 'twitter-enable-userstream', 'services-pingfm-enabled', 'services-pingfm-sendreplies', 'services-twitpic-sharepassword'];
	
	var that = this,
	    $accountList          = $('#account-list'),
	    $accountDetails       = $('#account-details'),
	    $idEdit               = $('#id_edit'),
	    $username             = $('#username'),
	    $password             = $('#password'),
	    $accountType          = $('#account-type'),
	    $saveAccountButton    = $('#account-save'),
	    $cancelAccountButton  = $('#account-cancel');
	
	$(document).ready(function(){

		/*
		 bind click on list to deselect
		 */
		$accountList.click(function(){
			Spaz.AccountPrefs.deselectAccounts();
		});

		/*
		 bind click on account
		 */
		$accountList.delegate('li[data-account-id]', 'click', function(e){
			// Clicking an account should only update the view to show it as
			// *selected*, but should not update the model to make it *current*
			// (i.e., active).
			var acctID = $(this).attr('data-account-id');
			Spaz.AccountPrefs.selectAccount(acctID);
		});

		/*
		 bind double-click on account
		 */
		$accountList.delegate('li[data-account-id]', 'dblclick', function(){
			// Double-clicking an account should make it the current account.
			var acctID = Spaz.AccountPrefs.getSelectedAccountId();
			if(acctID){
				Spaz.AccountPrefs.setAccount(acctID);
			}
		});

		/*
		 bind [+] button to popup
		 */
		$('.add-account').click(function(){
		
			sch.debug('ADD BUTTON CLICKED');
			
			$saveAccountButton.unbind('click');
			$cancelAccountButton.unbind('click');
			
			sch.debug('SHOW #account-details');
			Spaz.UI.openPopboxInline('#account-details');
			
			sch.debug($accountDetails.get(0).outerHTML);
			
			
			$('#twitter-pin-row').hide();
			sch.error($('#twitter-pin-row')[0].outerHTML);
			$('#twitter-reauthorize').html('Authorize').unbind('click').click(function() {
				$('#twitter-pin-row').show();
				Spaz.AccountPrefs.authorizeTwitterAccount(null, function(acc_id){
					Spaz.UI.closePopbox();
					$('#twitter-pin-row').hide();
					if (acc_id) {
						Spaz.AccountPrefs.setAccount(acc_id);
					}
				});
			});
			
			/*
			 populate form
			 */
			$idEdit.val('');
			$username.val('').focus();
			$password.val('').hide();
			if($password.is(':hidden')){
				$password.add($password.siblings()).show();
			}
			$('#twitter-username').hide();
			$('#twitter-pin-row').hide();
			$accountType.change((function(){
				// Run `fn` immediately, then bind it as a callback
				function fn(){
					var isTwitter = ($accountType.val() === SPAZCORE_ACCOUNT_TWITTER);
					$('div.reauthorize-twitter-controls').toggle(isTwitter);
					$('div.username-password-controls').toggle(!isTwitter);
				}
				fn();
				return fn;
			})());
			$accountType.val(SPAZCORE_ACCOUNT_TWITTER);
			
			/*
			 populate meta
			 */
			for (var i = 0; i < that.metavals.length; i++) {
				if (that.checkboxes.indexOf(that.metavals[i]) !== -1) { // is a checkbox
					$('#' + that.metavals[i]).attr('checked', false);
				} else {
					$('#' + that.metavals[i]).val('');
				}
				
			};
			
			/*
			 bind save button
			 */
			$saveAccountButton.click(function(){
				Spaz.UI.closePopbox();
				$('#twitter-pin-row').hide();
			});
			
			/*
			 bind cancel button
			 */
			$cancelAccountButton.click(function(){
				Spaz.UI.closePopbox();
				$('#twitter-pin-row').hide();
			});
		});
		
		/*
		 bind the [-] button
		 */
		$('#del-account').click(function(){
			var id = Spaz.AccountPrefs.getSelectedAccountId(),
			    firstAccount, removedAccount;
			if (id) {
				removedAccount = Spaz.AccountPrefs.remove(id);

				// Deleted the active account; switch to another one
				if(id === removedAccount.id){
					firstAccount = Spaz.AccountPrefs.spaz_acc._accounts[0];
					if(firstAccount){
						Spaz.AccountPrefs.setAccount(firstAccount.id);
					}
				}
			}
			else {
				sch.error('Nothing selected to delete');
			}
		});
		
		
		/*
		 bind the [edit] button to modal
		 */
		$('#edit-account').click(function(){
			if(!Spaz.AccountPrefs.getSelectedAccountId()){ return; }

			$saveAccountButton.unbind('click');
			$cancelAccountButton.unbind('click');
			
			
			var id = Spaz.AccountPrefs.getSelectedAccountId();
			if (id) {
				$('#twitter-pin-row').hide();
				var editing = that.spaz_acc.get(id);

				$('#twitter-reauthorize').html('Re-authorize').unbind('click').click(function() {
 					$('#twitter-pin-row').show();
					Spaz.AccountPrefs.authorizeTwitterAccount(editing, function(acc_id) {
						Spaz.UI.closePopbox();
						$('#twitter-pin-row').hide();
					});
				});
				
				Spaz.UI.openPopboxInline('#account-details');
				
				/*
				 populate form
				 */
				$idEdit.val(editing.id);
				$username.val(editing.username).focus();
				$password.val(editing.password);
				
				$('#twitter-username').text(editing.username);
				$('#twitter-pin-row').hide();
				$accountType.val(editing.type).change((function(){
					// Run `fn` immediately, then bind it as a callback
					function fn(){
						var isTwitter = ($accountType.val() === SPAZCORE_ACCOUNT_TWITTER);
						$('div.reauthorize-twitter-controls').toggle(isTwitter);
						$('div.username-password-controls').toggle(!isTwitter);
					}
					fn();
					return fn;
				})());
				
				/*
				 populate meta
				 */
				for (var i = 0; i < that.metavals.length; i++) {
					var val = that.spaz_acc.getMeta(editing.id, that.metavals[i]);
					if (that.checkboxes.indexOf(that.metavals[i]) !== -1) { // is a checkbox
						$('#' + that.metavals[i]).attr('checked', !!(val));
					}
					else {
						$('#' + that.metavals[i]).val(that.spaz_acc.getMeta(editing.id, that.metavals[i]));
					}
					
				};
				
				
				/*
				 bind save button
				 */
				$saveAccountButton.click(function(){
					var val;
					for (var i = 0, iMax = that.metavals.length; i < iMax; i++) {
						if (that.checkboxes.indexOf(that.metavals[i]) !== -1) {
							val = !!($('#' + that.metavals[i] + ':checked').length) || false;
						}
						else {
							val = $('#' + that.metavals[i]).val();
						}
						that.spaz_acc.setMeta(editing.id, that.metavals[i], val);
					};
					
					Spaz.UI.closePopbox();
				});
				
				/*
				 bind cancel button
				 */
				$cancelAccountButton.click(function(){
					Spaz.UI.closePopbox();
					$('#twitter-pin-row').hide();
				});

			} else {
				sch.error('Nothing selected to edit');
			}

		});

		/*
		 bind the [switch] button
		 */
		$('#switch-account').click(function(){
			var acctID = Spaz.AccountPrefs.getSelectedAccountId();
			if(acctID){
				Spaz.AccountPrefs.setAccount(acctID);
			}
		});
		
		/*
		 if "custom" is set for type, showthe api-base-url row
		 */
		$accountType.change(function(){
			$('#twitter-api-base-url-row').toggle($accountType.val() === 'custom');
		});

		sch.debug('LOADED USERS:');
		sch.debug(sch.enJSON(Spaz.AccountPrefs.spaz_acc._accounts));

		/*
		 Load data into GUI
		 */
		$accountList.append((function(){
			var accts = Spaz.AccountPrefs.spaz_acc._accounts, acct,
			    listItems = [];
			for(var i = 0, iMax = accts.length; i < iMax; i++){
				acct = accts[i];
				listItems.push(Spaz.AccountPrefs.getAccountListItemHTML(acct));
			}
			return listItems.join('');
		})());
		(function(){
			var currentUserId = Spaz.Prefs.getCurrentUserId();
			if(currentUserId){
				$accountList.
					children('li[data-account-id="' + currentUserId + '"]').
					addClass('current');
				Spaz.AccountPrefs.selectAccount(currentUserId);
			}
		})();

		// Clean up UI
		$accountDetails.hide();
		$('#twitter-api-base-url-row').hide();
		Spaz.AccountPrefs.toggleCTA();

	});

};

Spaz.AccountPrefs.setAccount = function(account_id) {
    
    sch.debug(account_id);
    
	if (account_id != Spaz.Prefs.getCurrentUserId()) {
		sch.trigger('before_account_switched', document, Spaz.Prefs.getCurrentAccount());

		// Update model
		Spaz.Prefs.setCurrentUserId(account_id);

		// Update views
		jQuery('#current-account-id').val(account_id);
		jQuery('#account-list').find('li[data-account-id="' + account_id + '"]').
			addClass('current').siblings().removeClass('current');
		Spaz.AccountPrefs.updateWindowTitleAndToolsMenu(account_id);

		sch.trigger('account_switched', document, Spaz.Prefs.getCurrentAccount());
	}
};

Spaz.AccountPrefs.add = function(username, password, type){
	var newacct = Spaz.AccountPrefs.spaz_acc.add(username, password, type);
	sch.debug(newacct);

	// Update views
	$('#account-list').append(
		Spaz.AccountPrefs.getAccountListItemHTML(newacct));
	Spaz.AccountPrefs.setAccountListImages();
	Spaz.AccountPrefs.toggleCTA();
	Spaz.Timelines.toggleNewUserCTAs();

	sch.debug('Added account:');
	sch.debug(newacct);
	return newacct;
};

Spaz.AccountPrefs.edit = function(id, acctobj){
	var savedacct = Spaz.AccountPrefs.spaz_acc.update(id, acctobj);
	sch.debug(savedacct);

	// Update views
	$('#account-list').find('li[data-account-id="' + savedacct.id + '"] span').
		html(savedacct.username + "@" + savedacct.type);

	sch.debug('Edited account:');
	sch.debug(savedacct);
	return savedacct;
};

Spaz.AccountPrefs.remove = function(id){
	var removedAcct = Spaz.AccountPrefs.spaz_acc.remove(id);

	// Update views
	$('#account-list').children('li[data-account-id="' + id + '"]').remove();
	Spaz.AccountPrefs.toggleCTA();
	Spaz.Timelines.toggleNewUserCTAs();

	sch.debug('Removed account:');
	sch.debug(removedAcct);
	return removedAcct;
};

Spaz.AccountPrefs.count = function(){
	return Spaz.AccountPrefs.spaz_acc.getAll().length;
};

Spaz.AccountPrefs.getAccountListItemHTML = function(account){
	// `account`: SpazAccounts instance

	return (
		'<li data-account-id="' + account.id + '">' +
			'<span class="clickable">' +
				'<span class="image">' + account.username + '</span>' +
					// `span.image` receives a background image later, after user data
					// is available; see `Spaz.AccountPrefs.setAccountListImages`. Until
					// then, it can be used to reserve space and align account names.
				account.username + '@' + account.type +
			'</span>' +
		'</li>'
	);
};

Spaz.AccountPrefs.setAccountListImages = function(){
	var i, acct, user,
	    $accountList = $('#account-list'),
	    accts = Spaz.AccountPrefs.spaz_acc._accounts;

	// Abort if any list item has already been given its background image
	if(!!$accountList.find('li span.image[style*="background-image"]')[0]){
		return;
	}

	i = accts.length; while(i--){
		acct = accts[i];
		user = Spaz.TweetsModel.getUser('@'+acct.username, (function(acct){
			// Return a new callback for each value of `acct` in the parent scope.
			// Otherwise, the callback will always have the first value of `acct`.
			return function(user){
				$accountList.
					find('li[data-account-id="' + acct.id + '"] span.image').css({
						backgroundImage: 'url(' + user.profile_image_url + ')'
					});
			};
		})(acct));
	}
};

Spaz.AccountPrefs.toggleCTA = function(){
	// Show the special CTA if this is a new Spaz user

	var anyAccts  = Spaz.AccountPrefs.count() > 0,
	    $fieldset = $('#account-list-fieldset');
	$fieldset.find('div.formrow.cta').toggle(!anyAccts);
	$fieldset.find('div.formrow:not(.cta)').toggle(anyAccts);
		// `.siblings()` didn't chain properly here for some reason. Possibly
		// broken by old jquery.moreSelectors.js plugin?
};

Spaz.AccountPrefs.selectAccount = function(acctID){
	// Updates the view to reflect the selected account. Does *not* change the
	// current (i.e., active) account.

	var $li = $('#account-list li[data-account-id="' + acctID + '"]');
	if(!$li.is('.selected')){
		$li.addClass('selected').siblings().removeClass('selected');
	}
	$('#edit-account, #del-account, #switch-account').removeAttr('disabled');
};

Spaz.AccountPrefs.deselectAccounts = function(){
	$('#account-list li.selected').removeClass('selected');
	$('#edit-account, #del-account, #switch-account').
		attr('disabled', 'disabled');
};

Spaz.AccountPrefs.getSelectedAccountId = function(){
	return $('#account-list li.selected').attr('data-account-id');
};

Spaz.AccountPrefs.updateWindowTitleAndToolsMenu = function(accountId){
	var account = Spaz.Prefs.getUserAccount(accountId),
	    $menu = jQuery('#tools-menu'),
	    $currentAccountAvatar = jQuery('#header-label').children('.current');

	Spaz.TweetsModel.getUser('@'+account.username, function(user){
		if(!user){ return; }

		if(!$currentAccountAvatar[0]){
			$currentAccountAvatar =
				jQuery('<span class="current"></span>').prependTo('#header-label');
		}
		$currentAccountAvatar.html(account.username).css({
			backgroundImage: 'url(' + user.profile_image_url + ')'
		});
		var account_class = 'account_'+account.id;
		sch.debug(account_class);
		$menu.find('li.' + account_class).
			addClass('selected').siblings().removeClass('selected');
	});

};



Spaz.AccountPrefs.getTwOAuth = function() {
	return OAuth({
		'consumerKey':SPAZCORE_CONSUMERKEY_TWITTER,
		'consumerSecret':SPAZCORE_CONSUMERSECRET_TWITTER,
		'requestTokenUrl':'https://twitter.com/oauth/request_token',
		'authorizationUrl':'https://twitter.com/oauth/authenticate',
		'accessTokenUrl':'https://twitter.com/oauth/access_token'
	});
};


/**
 * check to find twitter accounts that need upgrading 
 */
Spaz.AccountPrefs.getOldTwitterAccounts = function() {
	var twitter_accts = Spaz.Prefs._accounts.getByType(SPAZCORE_SERVICE_TWITTER);
	var matches = [];
	for (var i=0; i < twitter_accts.length; i++) {
		if (!(Spaz.Prefs._accounts.getMeta(twitter_accts[i].id, 'twitter_dm_access'))) {
			matches.push(twitter_accts[i]);
		}
	}
	return matches;
};




Spaz.AccountPrefs.reauthTwitterAccounts = function() {

	var matches = Spaz.AccountPrefs.getOldTwitterAccounts();

	if (matches.length > 0) {
		var go = confirm([
			"Twitter has chosen to change how 3rd party applications connect to their service.\n\n ",
			"As a consequence, you need to re-authorize your Twitter accounts to have continued access",
			" to direct messages on the system.\n\n",
			"Click OK to re-authorize now."
			].join('')
		);
		if (go) {
			
			// loop through accounts, authorizing each one
			(function reauth(new_matches, acc_id) {
				sch.error(acc_id);
				
				if (new_matches) {
					matches = new_matches;
				}
				
				if (matches.length < 1) {
					if (acc_id) {
						Spaz.AccountPrefs.setAccount(acc_id);
					}
					return;
				} 
				
				alert("Let's try to re-authorize "+matches[0].username+"@twitter");
				
				Spaz.UI.showPrefs();
				Spaz.UI.openAccountsPrefs();
				
				$('#account-list li[data-account-id="'+matches[0].id+'"]').trigger('click');
				setTimeout(function() {
					$('#edit-account').trigger('click');
					setTimeout(function() {				
						Spaz.AccountPrefs.authorizeTwitterAccount(matches[0], function(last_acc_id) {
							matches.splice(0,1);
							Spaz.UI.closePopbox();
							reauth(matches, last_acc_id);
						});
					}, 100);
				}, 100);
			})();
			
			return true;
			
		}
		
		return false;
		

	} else {
		return false;
	}
};



Spaz.AccountPrefs.authorizeTwitterAccount = function(acc_obj, success) {

	var oauth = Spaz.AccountPrefs.getTwOAuth();
	
	oauth.fetchRequestToken(function(url) {
			if (acc_obj && acc_obj.username) {
				url += '&force_login=true&screen_name='+acc_obj.username;
			} else {
				url += '&force_login=true';
			}
			var auth_window = window.open(url, 'authorize', 'height=500,width=500');
			
			$('#twitter-pin-row').show();
			$('#twitter-pin').val(''); // clear
			$('#twitter-pin-ok').unbind('click').click(function() {
				if ($('#twitter-pin').val()) {
					oauth.setVerifier($('#twitter-pin').val());
					if (auth_window) {
						auth_window.close();
					}
					oauth.fetchAccessToken(function(data) {
							var acc_id;
							var qvars = Spaz.getQueryVars(data.text);
							var auth_pickle = qvars.screen_name+':'+qvars.oauth_token+':'+qvars.oauth_token_secret;
							if (acc_obj && acc_obj.id) { // edit existing
								acc_id = acc_obj.id;
								Spaz.Prefs._accounts.setAuthKey(acc_id, auth_pickle);
								Spaz.Prefs._accounts.setMeta(acc_id, 'twitter_dm_access', true);
								Spaz.Prefs._accounts.save();
								alert($L('Account re-authorized'));
							} else { // add new
								acc_id = Spaz.Prefs._accounts.add(qvars.screen_name.toLowerCase(), auth_pickle, SPAZCORE_ACCOUNT_TWITTER);
								Spaz.Prefs._accounts.setMeta(acc_id, 'twitter-api-base-url', SPAZCORE_SERVICEURL_TWITTER);
								Spaz.Prefs._accounts.setMeta(acc_id, 'twitter_dm_access', true);
								Spaz.Prefs._accounts.save();
								alert($L('Account authorized'));
							}
							$('#twitter-pin-row').hide();
							
							if (success) {
								success(acc_id);
							}
						},
						function(data) {
							alert($L('Problem getting access token from Twitter'));
						}
					);
				} else {
					alert($L('You need to enter a PIN'));
				}
			});
		},
		function(data) {
			alert($L('Problem getting Request Token from Twitter'));
		}
	);
	
};
