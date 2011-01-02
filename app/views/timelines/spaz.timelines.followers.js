/**
 * Followers/following timeline def 
 */
var FollowersTimeline = function() {
	
	sch.debug('Firing FollowersTimeline constructor');

	var thisFLT			 = this,
		$timeline		 = $('#timeline-followerslist'),
		$timelineWrapper = $timeline.parent();
	this.twit = new SpazTwit();
	
	this.mode = 'friends';
	
	this.followers_more_cursor = -1;
	
	/*
		redefine this to work with different selector
	*/	
	this.getTimelineSelector = function() {
		return $timeline.selector;
	};
	
	/*
		redefine this to work with different selector
	*/
	this.getEntrySelector = function() {
		return this.getTimelineSelector()+' div.followers-row';
	};
	
	/**
	 * build the view menu 
	 */
	this.buildViewMenu = function() {
		
		sch.debug('Firing buildViewMenu');
		
		var i, iMax, menu,
		    menuId  = 'view-followers-menu',
		    $toggle = $('#view-followerslist');

		// Build menu
		function menuItemId(id){
			return menuId + '-' + id;
		}
		function onMenuItemClick(e, itemData){
			thisULT.setlist(itemData.slug, itemData.username);
			jQuery('#' + menuItemId(itemData.id)).addClass('selected').
				siblings('.selected').removeClass('selected');
		}
		menu = thisFLT.viewmenu = new SpazMenu({
			base_id:    menuId,
			base_class: 'spaz-menu',
			li_class:   'spaz-menu-item',
			items_func: function(itemsData){
				var i, iMax, itemData, items = [];
				
				items = [
					{
						id:'view-followerslist-friends',
						label:$L('Following'),
						handler:function(){thisFLT.setMode('friends');}
					},
					{
						id:'view-followerslist-followers',
						label:$L('Followers'),
						handler:function(){thisFLT.setMode('followers');}
					}
				];
				
				sch.debug('items:' + sch.enJSON(items));
				
				return items;
			}
		});
		// binds the trigger element
		menu.bindToggle($toggle.selector, {
			afterShow: function(e){
				sch.debug('thisFLT.mode:'+thisFLT.mode);
				jQuery('#view-followerslist-' + thisFLT.mode).addClass('selected').
					siblings('.selected').removeClass('selected');
			}
		});
	};

	this.bindListeners = function() {
		/*
			bind load more button
		*/
		jQuery('#load-more-followers').live('click', function(e) {
			thisFLT.loadMore(e);
		});

	};
		

	
	
	/**
	 * sets/changes the mode 
	 */
	this.setMode = function(mode) {
		sch.debug('thisFLT.mode:'+thisFLT.mode);
		sch.debug('mode:'+mode);

		$('#timeline-followerslist-full-name').
			text(mode == 'friends' ? 'following' : mode).show();

		// no change
		if (thisFLT.mode == mode) {
			return;
		}
		
		thisFLT.resetState();
		
		// change!
		thisFLT.mode = mode;
		thisFLT.refresh();
	};
	
	
	/**
	 * this does the real work of loading stuff
	 */
	this.refresh = function(event) {
		var thisA = this;

		var method_name = 'getFriendsList';

		var cursor = -1;
		if (event !== null && (sch.isNumber(event) || sch.isString(event))) {
			cursor = event;
		}

		sch.debug('CURSOR:'+ cursor);

		if (this.mode === 'friends') {
		    method_name = 'getFriendsList';
		} else if (this.mode === 'followers') {
		    method_name = 'getFollowersList';
		} else {
		    sch.debug('Invalid mode:%s', this.mode);
		    return;
		}


		this.twit[method_name](
			'@'+Spaz.Prefs.getUsername(),
			cursor,
			function(data, cursor_obj) {
				
				Spaz.Hooks.trigger('followers_timeline_data_success_start');
				
				/*
					if mode is wrong, don't add
				*/
				if ( (thisA.mode === 'friends' && method_name === 'getFollowersList') ) {
					return;
				} else if ( (thisA.mode === 'followers' && method_name === 'getFriendsList') ) {
					return;
				}

				if (sch.isArray(data)) {

	                // data = data.reverse();
					var no_dupes = [];

					for (var i=0; i < data.length; i++) {
						/*
							only add if it doesn't already exist
						*/
						if (!thisFLT.itemExists(data[i].id)) {
							no_dupes.push(data[i]);
						}

					};

				    sch.debug('no_dupes.length:', no_dupes.length);
					$timelineWrapper.children('.loading, .new-user').hide();
					
					thisA.addItems(no_dupes);
					
					/*
						reapply filtering
					*/
					$('#filter-followers').trigger('keyup');

				}
				
				
				sch.debug('cursor_obj:'+sch.enJSON(cursor_obj));
				
				if (cursor_obj && cursor_obj.next) {
				    thisFLT.followers_more_cursor = cursor_obj.next;
				}
				
				Spaz.UI.hideLoading();
				Spaz.UI.statusBar("Ready");

				Spaz.Hooks.trigger('followers_timeline_data_success_finish');
			},
			function(xhr, msg, exc) {
				sch.debug('EROROR in getFriends');

				var err_msg = "There was an error retrieving the user timeline";
				Spaz.UI.statusBar(err_msg);
				$timelineWrapper.children('.loading').hide();

				Spaz.UI.hideLoading();
			}
		);
		


	};

	/**
	 * triggered by the "load mode" button
	 */
	this.loadMore = function(event) {

	    sch.debug('this.followers_more_cursor:'+this.followers_more_cursor);

		this.refresh(this.followers_more_cursor);
	};
	
	/**
	 * add items to timeline 
	 */
	this.addItems = function(items) {
		var html_items = this.renderItems(items);
		$timeline.append(html_items);
	};
	
	/**
	 * check if this item already exists 
	 */
	this.itemExists = function(id) {
		sch.debug('Looking for:'+id );
		if (jQuery('div.followers-row[data-user-id="'+id+'"]', $timeline).length > 0) {
			sch.debug('found:'+id );
			return true;
		}
		sch.debug('Did not find:'+id );
		return false;
	};
	
	/**
	 * render the items for the timeline 
	 */
	this.renderItems = function(items) {
		return Spaz.Tpl.parseArray('followerslist_row', items);
	};
	
	/**
	 * Reset the state 
	 */
	this.resetState = function() {
	    this.followers_more_cursor = -1;
		this.mode = 'friends';
		$timeline.empty();
	};
	
	
	this.buildViewMenu();
	
	this.bindListeners();
	
	/*
		listen for account switches
	*/
	jQuery(document).bind('before_account_switched', function(e, account){
		thisFLT.viewmenu.hideAndDestroy();
		thisFLT.resetState();
	});
	
	/*
		after all these definitions, set the mode
	*/
	this.setMode('friends');
	
};

FollowersTimeline.prototype = new AppTimeline();
