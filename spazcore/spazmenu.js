/*
 * Source:
 * http://github.com/funkatron/spazcore/blob/0e9fec769b3f9f3edd7f217bf8085bea67b51b6c/incubator/libs/spazmenu.js
 *
 * Added a conditional to avoid overwriting the function if it exists.
 */

/**
 * A class for dynamically generating menus.
 * 
 * hash structure:
 * var hash = [
 * 	{
 * 		'label':"Menu label",
 * 		'id':"a_unique_id", // optional, not used if not present
 * 		'class':"menu_label", // optional, generated if not present
 * 		'handler':function(e, data) {}, // a handler. will be listening via delegation
 * 		'data':{} // some data, passed as second param to onClick handler
 * 		}
 * 
 * ];
 * 
 * 
 * @param {object} trigger_event the event that is triggering the creation of this menu. needed for positioning
 * 
 * @param {object} opts options	
 * 
 * @param {array}  opts.items_func a function that generates a hash of item objects. takes one parameter "data"
 * @param {string} [opts.base_id] the id attribute for the menu's base element. default is 'spaz_menu'
 * @param {string} [opts.base_class] the class attribute for the menu's base element. default is 'spaz_menu'
 * @param {string} [opts.li_class] the class attribute for the menu's base element. default is 'spaz_menu_li'
 * @param {string} [opts.show_immediately] whether or not to immediately show the menu on creation. Default is TRUE
 * @param {string} [opts.close_on_any_click] whether or not to close the menu when anything is clicked. Default is FALSE
 */

if(typeof SpazMenu === 'undefined' || !SpazMenu){

SpazMenu = function(opts) {
	this.opts = sch.defaults({
		'items_func':function(data){ return null; },
		'base_id'   :'spaz_menu',
		'base_class':'spaz_menu',
		'li_class'  :'spaz_menu_li',
		'show_immediately':  true,
		'close_on_any_click':false
	}, opts);
	
	// close on ANY clicks
	if(this.opts.close_on_any_click){
		jQuery(document).bind('click', {'spazmenu':this}, this.hide);
	}
	
	/**
	 * dismiss with escape 
	 */
	jQuery(document).bind('keydown', {'spazmenu':this}, this.keypressHide);
	
	
	
	// just in case, we need to destroy any existing menus before creating new ones
	// with the same settings
	jQuery('div.'+this.opts.base_class).remove();
};



/**
 * Creates and shows the menu
 * @param {object} trigger_event the event that triggered the show
 * @param {object} itemsdata a data structure that will be passed to the items_func 
 * @param {object} [showOpts.position] {left: <number>, top: <number>} position at which to show the menu. Defaults to trigger_event coordinates.
 * @param {object} [showOpts.rebuild] whether to rebuild the menu contents if the menu already exists. Defaults to false.
 */
SpazMenu.prototype.show = function(trigger_event, itemsdata, showOpts) {
	
	var that = this;

	showOpts = sch.defaults({
		rebuild: false
	}, showOpts);

	// map the triggering event
	this.trigger_event = trigger_event;

	// create items with items_func
	this.items = this.opts.items_func(itemsdata);

 	// create base DOM elements
	if (jQuery('#'+this.opts.base_id).length < 1) {
		jQuery('body').append(this._tplBase());
	} else if(showOpts.rebuild) { // if exists, empty it
		jQuery('#'+this.opts.base_id + ' ul').empty();
	}
	
	// iterate over items
	var item, itemhtml = '',
	    jqList = jQuery('#' + this.opts.base_id).children('ul');
	if(showOpts.rebuild || !jqList.find('li')[0]){
		for (var i=0; i < this.items.length; i++) {
			item = this.items[i];

			if(item){
				if (!item['class']) {
					item['class'] = this._generateItemClass(item);
				}

				// create the item HTML
				itemhtml = this._tplItem(item);

				// -- add item DOM element
				jqList.append(itemhtml);

				// -- remove any existing handlers (in case this menu was shown before)
				jqList.undelegate('.'+item['class'], 'click');

				// -- add delegated handler
				jqList.delegate('.'+item['class'], 'click', {'item':item, 'spazmenu':this}, function(e, data) {
					if (e.data.item.handler) {
						e.data.item.handler.call(this, e, e.data.item.data||itemsdata);
					} else {
						sch.debug('SpazMenu: No handler defined for menu item');
					}
					that.hide();
				});
			}else{
				jqList.append('<li class="separator"></li>');
			}
		}
	}

	showOpts.position = sch.defaults({
		left: trigger_event.clientX,
		top:  trigger_event.clientY
	}, showOpts.position);

	this._positionBeforeShow({
		// Filter out any stray properties aside from these:
		left: showOpts.position.left,
		top:  showOpts.position.top
	});
	jQuery('#' + this.opts.base_id).show();
	this._reposition(trigger_event);

	if(Spaz && Spaz.UI){
		Spaz.UI.hideTooltips();
	}
};

/**
 * hides a created menu 
 */
SpazMenu.prototype.hide = function(e) {
	
	var that; 
	
	if (e && e.data && e.data.spazmenu) {
		that = e.data.spazmenu;
	} else {
		that = this;
	}
		
	jQuery('#'+that.opts.base_id).hide();
};

/**
 * handler if esc is hit 
 */
SpazMenu.prototype.keypressHide = function(e) {
	if (e.keyCode == 27) {
		e.data.spazmenu.hide();
	} // escape
};

/**
 * destroys a menu completely (DOM and JS object) 
 */
SpazMenu.prototype.destroy = function() {
	sch.debug('SpazMenu: destroy');

	var jqDoc = jQuery(document);
	
	// Unbind handlers
	if(this.opts.close_on_any_click){
		jqDoc.unbind('click', this.hide);
	}
	jqDoc.unbind('keydown', this.keypressHide);
	this.unbindToggle();
	
	// remove base DOM element
	jQuery('#'+this.opts.base_id).remove();
};

/**
 * hides AND destroys 
 */
SpazMenu.prototype.hideAndDestroy = function(e) {
	if (this.hide && this.destroy) {
		this.hide();
		this.destroy();
	} else if (e && e.data && e.data.spazmenu) {
		e.data.spazmenu.hide();
		e.data.spazmenu.destroy();	
	} else {
		sch.error('couldn\'t hide and destroy');
	}
};



/**
 * Bind to another element for toggling the menu. `close_on_any_click` should
 * be false, or else it will interfere.
 * @param {function} [opts.showMenu] the function responsible for showing the menu
 * @param {object}   [opts.showData] data (object) to pass to opts.showMenu
 * @param {object}   [opts.showOpts] options to use when showing the menu
 * @param {function} [opts.afterShow] optional callback after showing the menu
 * @param {function} [opts.hideMenu] the function responsible for hiding the menu
 * @param {function} [opts.afterHide] optional callback after hiding the menu
 */
SpazMenu.prototype.bindToggle = function(toggleSelector, opts){
	var _this = this;

	opts = sch.defaults({
		showMenu: function(e){
			var jqToggle  = jQuery(toggleSelector),
			    togglePos = jqToggle.offset();
			_this.show(e, opts.showData, sch.defaults({
				position: {
					// Position below toggle:
					left: togglePos.left,
					top:  togglePos.top + jqToggle.height()
				}
			}, opts.showOpts));
			if(opts.afterShow){ opts.afterShow.call(_this, e); }
		},
		hideMenu: function(e){
			_this.hide(e);
			if(opts.afterHide){ opts.afterHide.call(_this, e); }
		}
	}, opts);

	this.toggleSelector = toggleSelector;

	this.onToggleClick = function(e){
		if(jQuery('#' + _this.opts.base_id).is(':visible')){
			opts.hideMenu(e);
			jQuery(document).unbind('click', _this.onDocumentClick);
		}else{
			opts.showMenu(e);
			jQuery(document).click(_this.onDocumentClick);
		}
	};

	this.onDocumentClick = function(e){
		// Bind this handler to run it only once. Use this, rather than `.one()`,
		// so it can be unbound before execution if needed.
		opts.hideMenu(e);
		jQuery(this).unbind(e);
	};

	jQuery(toggleSelector).live('click', this.onToggleClick);

	// SpryTabbedPanels' `onTabClick` ends with `return false`, so the event
	// reaches no other handlers. Fantastic. To work around this and hide this
	// menu when switching tabs, bind more handlers directly to the tabs, rather
	// than to the document. Bloat.
	jQuery('.TabbedPanelsTab').click(function(e){
		opts.hideMenu(e);
	});
};

SpazMenu.prototype.unbindToggle = function(){
	if(this.onToggleClick){
		jQuery(this.toggleSelector).die('click', this.onToggleClick);
	}
	if(this.onDocumentClick){
		jQuery(document).unbind('click', this.onDocumentClick);
	}
};



/**
 * sets the position of the menu right before we show it 
 * @param {object} position {left: <number>, top: <number>}
 */
SpazMenu.prototype._positionBeforeShow = function(position) {
	jQuery('#' + this.opts.base_id).css(position);
};

/**
 * Repositions the menu after showing in case we're outside the viewport boundaries
 */
SpazMenu.prototype._reposition = function(e, data) {

	var jqMenu          = jQuery('#' + this.opts.base_id),
	    viewportWidth   = jQuery(window).width(),
	    menuWidth       = jqMenu.width(),
	    menuMarginRight = parseInt(jqMenu.css('margin-right'), 10),
	    menuOffset      = jqMenu.offset();

	if(menuOffset.left + menuWidth + menuMarginRight > viewportWidth){
		jqMenu.offset(function(i, offset){
			return {
				left: viewportWidth - menuWidth - menuMarginRight,
				top:  offset.top
			};
		});
	}
};

/**
 * this generates the item class if one has not been provided 
 */
SpazMenu.prototype._generateItemClass = function(item) {
	return item.label.replace(/[^a-z]/gi, '_').toLowerCase();
};

/**
 * generates the html for the base DOM elements 
 */
SpazMenu.prototype._tplBase = function() {
	
	var html = '';
	
	html += '<div id="'+(this.opts.base_id||'')+'" class="'+this.opts.base_class+'">';
	html += '	<ul>';
	html += '	</ul>';
	html += '</div>';
	
	sch.debug(html);
	
	return html;	
};

/**
 * generates the HTML for a menu item
 * @param {object} i the item object 
 */
SpazMenu.prototype._tplItem = function(i) {
	var html = '',
	    attr,
	    attrs = i.attrs || {};
	      // The `attrs` hook allows for specifying attributes other than `id`
	      // and `class`, such as `data-silverfish` and `data-monocle`.

	attrs.id = i.id || '';
	attrs['class'] = [this.opts.li_class, i['class']].join(' ');

	html += '<li';
	for(attr in attrs){
		if(attrs.hasOwnProperty(attr)){
			html += ' ' + attr + '="' + attrs[attr] + '"';
		}
	}
	html += '><span>' + i.label + '</span></li>';

	sch.debug(html);
	
	return html;
};

}
