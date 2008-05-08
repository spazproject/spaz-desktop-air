/**
 * jQuery.Intercept - Event Delegation with jQuery 
 * Copyright (c) 2007 Ariel Flesler (flesler AT hotmail DOT com)
 * Licensed under GPL (http://www.opensource.org/licenses/gpl-license.php) license.
 * Date: 09/11/2007
 *
 * @projectDescription Easily make DOM elements, watch for events from it's descendants.
 *
 * @author Ariel Flesler
 * @version 1.0.2
 *
 * @id jQuery.fn.intercept
 * @method
 * @param {String} eventname The name of the event to watch for.
 * @param {Hash} handler Hash of functions, where each key is a simple selector, and the value, a handler.
 * @return {jQuery} Returns the same jQuery object, for chaining.
 *
 * @see http://icant.co.uk/sandbox/eventdelegation/
 *
 * Notes:
 * - The hash can receive a "self" selector that will match the DOM element, intercepting the events,
 * - The hash can also have a "delegate" value, it will change the event.target to it's parentNode.
 *   (it must be done before the selector that matches the parent).
 * - Handlers are checked in the order the are added to the hash, several calls to the plugin
 *   add new handlers, which are added to the bottom, thus they will be checked last.
 **/

(function( $ ){

	var prefix = '$handlers_';//prefix for the handlers, to store them with a more or less unique name.

	function binding( event ){
		var handlers = this.$events[ prefix + event.type ];//retrieve the handlers
			
		for( var selector in handlers ){//iterate through the handlers.
			switch( selector ){//no real need for a switch but will be easier to add more custom selectors
				case 'self': if( event.target == this )//the target is the actual container
						return handlers.self.call( this, event );//if there's a "self" handler, then use it.
				break;
				default: 
					if( $(event.target).is(selector) ){// does the target match this simple selector?
						if( handlers[selector] == 'delegate' )
							event.target = event.target.parentNode;//delegate to it's parent
						else
							return handlers[selector].call( event.target, event );//call the custom handler, make the 'this' refer to the target
					}
				break;
			}
		}
		return true;//no need for this line, but just let it bubble.
	};
	
	function parse( handlers ){//check for comma separated selector, split them and copy inside the hash.
		var parsed = {};
		for( var selector in handlers ){//let's check if a comma-separated selector was sent.
			if( selector.indexOf(',') != -1 ){//is there a comma in the selector?
				$.each( selector.split(','), function( key, value ){//separate the simple selectors to an array
					parsed[value] = handlers[selector];//add each sub-selector with the same handler as the original.
				});
			}else{//just a regular simple selector
				parsed[selector] = handlers[selector];//copy it to the new hash.
			}
		}
		return parsed;
	};

	$.fn.intercept = function(eventname, handlers){		
		handlers = parse( handlers );//parse the handlers hash.
		var key = prefix + eventname;//unique key for the handlers of this type of event.
		return this.each(function(){
			if( !this.$events ) this.$events = {};
			if( !this.$events[ key ] ){
				this.$events[ key ] = handlers;//store the hash of handlers
				$(this).bind( eventname, binding );//bind the generic function
			}else{
				$.extend( this.$events[ key ], handlers );//update the old ones have priority.
			}
		});
	};

})(jQuery);