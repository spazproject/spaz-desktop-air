Spaz.Accounts = {};


Spaz.Accounts.init = function() {
	
	/*
		this means we have to init after the prefs have been set up
	*/
	this.spaz_acc = new SpazAccounts(Spaz.Prefs._prefs);

	this.metavals = [
		'twitter-api-base-url',
		'twitter-disable-direct-posting',
		'services-pingfm-userappkey',
		'services-pingfm-enabled',
		'services-pingfm-sendreplies',
		'services-shortie-email',
		'services-shortie-secretkey',
		'services-twitpic-sharepassword'
	];

	this.checkboxes = [
		'twitter-disable-direct-posting',
		'services-pingfm-enabled',
		'services-pingfm-sendreplies',
		'services-twitpic-sharepassword'			
	];
	
	var that = this;
	
	/*
		initialize bindings on DOMReady
	*/
	$().ready( function() {
			
		/*
			bind [+] button to popup
		*/
		$('#add_button').click(function() {
			$.openDOMWindow({ 
		        windowSourceID:'#account-details' 
		    }); 
		
			/*
				bind add button
			*/
			$('#ok').one('click', function() {
				var newaccid = Spaz.Accounts.add(
					$('#username').val(),
					$('#password').val(),
					$('#type').val()
				).id;
				for (var i=0; i < that.metavals.length; i++) {
					that.spaz_acc.setMeta(editedaccid, that.metavals[i], $('#'+that.metavals[i]).val());
				};

				
				$.closeDOMWindow({
					windowSourceID:'#account-details'
				});
			});
		
			/*
				bind cancel button
			*/
			$('#cancel_new').one('click', function() {
				$.closeDOMWindow({
					windowSourceID:'#account-details'
				});
			});
		});
		
		/*
			bind the [-] button
		*/
		$('#del_button').click(function() {
			var id = Spaz.Accounts.getSelectedId();
			if (id) {
				var deleted = that.spaz_acc.remove(id);
				$('option[value="'+id+'"]').remove();
			} else {
				sch.error('Nothing selected to delete');
			}
		});
		
		
		/*
			bind the [edit] button to modal
		*/
		$('#edit_button').click(function() {
			
			var id = Spaz.Accounts.getSelectedId();
			if (id) {
				var editing = that.spaz_acc.get(id);

				$.openDOMWindow({ 
			        windowSourceID:'#account-details' 
			    }); 				

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
				for (var i=0; i < that.metavals.length; i++) {
					$('#'+that.metavals[i]).val(that.spaz_acc.getMeta(editing.id, that.metavals[i]))
				};
				

				/*
					bind save button
				*/
				$('#ok').click(function() {
					var editedaccid = Spaz.Accounts.edit(
						$('#id_edit').val(),
						{
							'username':$('#username').val(),
							'password':$('#password').val(),
							'type':$('#account-type').val()
						}
					).id;

					for (var i=0; i < that.metavals.length; i++) {
						if (that.checkboxes.indexOf(that.metavals[i]) !== -1) {
							var val = !!($('#'+that.metavals[i]+':checked').length) || false;
						} else {
							var val = $('#'+that.metavals[i]).val();
						}
						
						
						that.spaz_acc.setMeta(editedaccid, that.metavals[i], val);
					};
					
					$.closeDOMWindow({
						windowSourceID:'#editForm'
					});
				});

				/*
					bind cancel button
				*/
				$('#cancel').click(function() {
					$.closeDOMWindow({
						windowSourceID:'#account-details'
					});
				});
				

			} else {
				sch.error('Nothing selected to edit');
			}
			
			
		});

		/*
			if "custom" is set for type, showthe api-base-url row
		*/
		$('#account-type').change(function(){
			if ($('#account-type').val() === 'custom') {
				$("#twitter-api-base-url-row").show();
			} else {
				$('#twitter-api-base-url-row').hide();
			}
		})
					
		
		/*
			hide some junk
		*/
		$('#account-details').hide();
		$('#twitter-api-base-url-row').hide();
		
		
	});
	
		
	
};



Spaz.Accounts.getSelectedId = function() {
	var jqel = $("#accounts option:selected");
	if (jqel && jqel.length > 0) {
		return jqel.attr('value');
	} else {
		return false;
	}
};



Spaz.Accounts.add = function(username, password, type) {
	var newacct = Spaz.Accounts.spaz_acc.add(username, password, type);
	sch.debug(newacct);
	var html = "<option value='"+newacct.id+"'>"+newacct.username+"@"+newacct.type+"</option>";
	$('#accounts').append(html);
	sch.debug("Added:");
	sch.debug(newacct);
	return newacct;
};

Spaz.Accounts.edit = function(id, acctobj) {
	var savedacct = Spaz.Accounts.spaz_acc.update(id, acctobj);
	sch.debug(savedacct);
	$('option[value="'+savedacct.id+'"]').html(savedacct.username+"@"+savedacct.type);
	sch.debug("Edited:");
	sch.debug(savedacct);
	return savedacct;
};
