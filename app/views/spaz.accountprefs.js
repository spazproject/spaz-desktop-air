Spaz.AccountPrefs = {};


Spaz.AccountPrefs.init = function(){

	this.spaz_acc = Spaz.Prefs._accounts;
	
	
	this.metavals = ['twitter-api-accesskey', 'twitter-api-base-url', 'twitter-disable-direct-posting', 'services-pingfm-userappkey', 'services-pingfm-enabled', 'services-pingfm-sendreplies', 'services-shortie-email', 'services-shortie-secretkey', 'services-twitpic-sharepassword'];
	
	this.checkboxes = ['twitter-disable-direct-posting', 'services-pingfm-enabled', 'services-pingfm-sendreplies', 'services-twitpic-sharepassword'];
	
	
	var that = this;
	
	
	
	$().ready(function(){
	
	
		/*
		 bind click on account
		 */
		$('#account-list').change(function(e){
			var account_id = $(this).val();
			if (account_id != Spaz.Prefs.getCurrentUserId()) {
				Spaz.Prefs.setCurrentUserId(account_id);
				var account = Spaz.Prefs.getCurrentAccount();
				sch.trigger('account_switched', document, account);
			}
			sch.debug(Spaz.Prefs.getUsername());
		});
		
		
		/*
		 bind [+] button to popup
		 */
		$('#add_button').click(function(){
		
			sch.debug('ADD BUTTON CLICKED');
			
			$('#save_account_button').unbind('click');
			$('#cancel_account_button').unbind('click');
			
			sch.debug('SHOW #account-details');
			Spaz.UI.openPopboxInline('#account-details');
			
			sch.debug($('#account-details').get(0).outerHTML);
			
			/*
			 populate form
			 */
			$('#id_edit').val('');
			$('#username').val('');
			$('#password').val('');
			$('#account-type').val(SPAZCORE_ACCOUNT_TWITTER);
			
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
			$('#save_account_button').bind('click', function(){
				var newaccid = Spaz.AccountPrefs.add($('#username').val(), $('#password').val(), $('#account-type').val()).id;
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
			$('#cancel_account_button').bind('click', function(){
				Spaz.UI.closePopbox();
			});
		});
		
		/*
		 bind the [-] button
		 */
		$('#del_button').click(function(){
			var id = Spaz.AccountPrefs.getSelectedId();
			if (id) {
				var deleted = that.spaz_acc.remove(id);
				$('option[value="' + id + '"]').remove();
			}
			else {
				sch.error('Nothing selected to delete');
			}
		});
		
		
		/*
		 bind the [edit] button to modal
		 */
		$('#edit_button').click(function(){
		
			$('#save_account_button').unbind('click');
			$('#cancel_account_button').unbind('click');
			
			
			var id = Spaz.AccountPrefs.getSelectedId();
			if (id) {
				var editing = that.spaz_acc.get(id);
				
				Spaz.UI.openPopboxInline('#account-details');
				
				
				/*
				 populate form
				 */
				$('#id_edit').val(editing.id);
				$('#username').val(editing.username);
				$('#password').val(editing.password);
				$('#account-type').val(editing.type);
				
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
				$('#save_account_button').click(function(){
					var editedaccid = Spaz.AccountPrefs.edit($('#id_edit').val(), {
						'username': $('#username').val(),
						'password': $('#password').val(),
						'type': $('#account-type').val()
					}).id;
					
					var val;
					for (var i = 0; i < that.metavals.length; i++) {
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
				$('#cancel_account_button').click(function(){
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
		$('#account-type').change(function(){
			if ($('#account-type').val() === 'custom') {
				$("#twitter-api-base-url-row").show();
			}
			else {
				$('#twitter-api-base-url-row').hide();
			}
		});
		
		
		sch.debug('LOADED USERS:');
		sch.debug(sch.enJSON(Spaz.AccountPrefs.spaz_acc._accounts));
		
		
		/*
		 Load data into GUI
		 */
		for (var i = 0; i < Spaz.AccountPrefs.spaz_acc._accounts.length; i++) {
			var thisacc = Spaz.AccountPrefs.spaz_acc._accounts[i];
			var html = "<option value='" + thisacc.id + "'>" + thisacc.username + "@" + thisacc.type + "</option>";
			$('#account-list').append(html);
		};
		
		
		
		
		/*
		 hide some junk
		 */
		$('#account-details').hide();
		$('#twitter-api-base-url-row').hide();
		
		
	});
	
	
	
};




Spaz.AccountPrefs.add = function(username, password, type){
	var newacct = Spaz.AccountPrefs.spaz_acc.add(username, password, type);
	sch.debug(newacct);
	var html = "<option value='" + newacct.id + "'>" + newacct.username + "@" + newacct.type + "</option>";
	$('#account-list').append(html);
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



Spaz.AccountPrefs.getSelectedId = function(){
	var val = $("#account-list").val();
	if (val) {
		return val;
	}
	else {
		return null;
	}
};
