Spaz.AccountPrefs = {};


Spaz.AccountPrefs.init = function(){

	this.spaz_acc = Spaz.Prefs._accounts;
	
	
	this.metavals = ['twitter-api-accesskey', 'twitter-api-base-url', 'twitter-disable-direct-posting', 'services-pingfm-userappkey', 'services-pingfm-enabled', 'services-pingfm-sendreplies', 'services-shortie-email', 'services-shortie-secretkey', 'services-twitpic-sharepassword'];
	
	this.checkboxes = ['twitter-disable-direct-posting', 'services-pingfm-enabled', 'services-pingfm-sendreplies', 'services-twitpic-sharepassword'];
	
	var that = this,
	    $accountList    = $('#account-list'),
	    $accountDetails = $('#account-details'),
	    $idEdit         = $('#id_edit'),
	    $username       = $('#username'),
	    $password       = $('#password'),
	    $accountType    = $('#account-type'),
	    $saveAccountButton    = $('#save_account_button'),
	    $cancelAccountButton  = $('#cancel_account_button');
	
	$().ready(function(){
	
		/*
		 bind click on account
		 */
		$accountList.change(function(e){
			var account_id = $(this).val();
			Spaz.AccountPrefs.setAccount(account_id);
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
			
			/*
			 populate form
			 */
			$idEdit.val('');
			$username.val('');
			$password.val('');
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
				var newaccid = Spaz.AccountPrefs.add($username.val(), $password.val(), $accountType.val()).id;
				var val;
				for (var i = 0; i < that.metavals.length; i++) {
					if (that.checkboxes.indexOf(that.metavals[i]) !== -1) { // is a checkbox
						val = !!($('#' + that.metavals[i] + ':checked').length) || false;
					}
					else {
						val = $('#' + that.metavals[i]).val();
					}
					that.spaz_acc.setMeta(newaccid, that.metavals[i], val);
				};
				
				
				Spaz.UI.closePopbox();
			});
			
			/*
			 bind cancel button
			 */
			$cancelAccountButton.click(function(){
				Spaz.UI.closePopbox();
			});
		});
		
		/*
		 bind the [-] button
		 */
		$('#del-account').click(function(){
			var id = Spaz.AccountPrefs.getSelectedId();
			if (id) {
				var deleted = that.spaz_acc.remove(id);
				$('option[value="' + id + '"]').remove();
				Spaz.AccountPrefs.toggleCTA();
			}
			else {
				sch.error('Nothing selected to delete');
			}
		});
		
		
		/*
		 bind the [edit] button to modal
		 */
		$('#edit-account').click(function(){
		
			$saveAccountButton.unbind('click');
			$cancelAccountButton.unbind('click');
			
			
			var id = Spaz.AccountPrefs.getSelectedId();
			if (id) {
				var editing = that.spaz_acc.get(id);
				
				Spaz.UI.openPopboxInline('#account-details');
				
				
				/*
				 populate form
				 */
				$idEdit.val(editing.id);
				$username.val(editing.username);
				$password.val(editing.password);
				$accountType.val(editing.type);
				
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
					var editedaccid = Spaz.AccountPrefs.edit($idEdit.val(), {
						'username': $username.val(),
						'password': $password.val(),
						'type': $accountType.val()
					}).id;
					
					var val;
					for (var i = 0, iMax = that.metavals.length; i < iMax; i++) {
						if (that.checkboxes.indexOf(that.metavals[i]) !== -1) {
							val = !!($('#' + that.metavals[i] + ':checked').length) || false;
						}
						else {
							val = $('#' + that.metavals[i]).val();
						}
						that.spaz_acc.setMeta(editedaccid, that.metavals[i], val);
					};
					
					Spaz.UI.closePopbox();
				});
				
				/*
				 bind cancel button
				 */
				$cancelAccountButton.click(function(){
					Spaz.UI.closePopbox();
					
				});
				
				
			}
			else {
				sch.error('Nothing selected to edit');
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
			    options = [];
			for(var i = 0, iMax = accts.length; i < iMax; i++){
				acct = accts[i];
				options.push(
					'<option' +
						((acct.username === Spaz.Prefs.getUsername() &&
							acct.type === Spaz.Prefs.getAccountType()) ?
							' selected' : '') +
					    ' value="' + acct.id + '">' +
						acct.username + '@' + acct.type +
					'</option>'
				);
			}
			return options.join('');
		})());

		// Clean up UI
		$accountDetails.hide();
		$('#twitter-api-base-url-row').hide();
		Spaz.AccountPrefs.toggleCTA();
		
	});
	
	
	
};


Spaz.AccountPrefs.setAccount = function(account_id) {

	if (account_id != Spaz.Prefs.getCurrentUserId()) {
		sch.trigger('before_account_switched', document, Spaz.Prefs.getCurrentAccount());
		
		Spaz.Prefs.setCurrentUserId(account_id);
						
		sch.trigger('account_switched', document, Spaz.Prefs.getCurrentAccount());
	}
};

Spaz.AccountPrefs.add = function(username, password, type){
	var newacct = Spaz.AccountPrefs.spaz_acc.add(username, password, type);
	sch.debug(newacct);
	var html = "<option value='" + newacct.id + "'>" + newacct.username + "@" + newacct.type + "</option>";
	$('#account-list').append(html);
	Spaz.AccountPrefs.toggleCTA();
	sch.debug("Added:");
	sch.debug(newacct);
	return newacct;
};

Spaz.AccountPrefs.edit = function(id, acctobj){
	var savedacct = Spaz.AccountPrefs.spaz_acc.update(id, acctobj);
	sch.debug(savedacct);
	$('#account-list option[value="' + savedacct.id + '"]').html(savedacct.username + "@" + savedacct.type);
	sch.debug("Edited:");
	sch.debug(savedacct);
	return savedacct;
};

Spaz.AccountPrefs.toggleCTA = function(){
	// Show the special CTA if this is a new Spaz user

	// var anyAccts = Spaz.DB.getUserCount() <= 0,
	var anyAccts  = Spaz.AccountPrefs.spaz_acc.getAll().length > 0,
	    $fieldset = $('#account-list-fieldset');
	$fieldset.find('div.formrow.cta').toggle(!anyAccts);
	$fieldset.find('div.formrow:not(.cta)').toggle(anyAccts);
		// `.siblings()` didn't chain properly here for some reason.
};



Spaz.AccountPrefs.getSelectedId = function(){
	return $('#account-list').val() || null;
};
