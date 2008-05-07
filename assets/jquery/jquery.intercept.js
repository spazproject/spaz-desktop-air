/**
 * jQuery.Intercept - Event Delegation with jQuery 
 * Copyright (c) 2008 Ariel Flesler aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 3/9/2008
 *
 * @projectDescription Easily make DOM elements, watch for events from its descendants.
 * @author Ariel Flesler
 * @version 1.1.2
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
 * - Handlers are checked in the order the are added to the hash, several calls to the plugin
 *   add new handlers, which are added to the bottom, thus they will be checked last.
 */
;(function( $ ){

	var $intercept = $.intercept = function( e, h, f ){
		$('html').intercept( e, h, f );
	};

	$.fn.intercept = function( event, handlers, fn ){
		var temp, el, stored;

		if( fn ){//3 arguments overload
			temp = {};
			temp[handlers] = fn;
			handlers = temp;
		}

		return this.each(function(){
			el = this;
			$.each( event.split(' '), function( i, name ){//support whitespace separated events
				stored = $.data( el, name + '.intercept' );
				if( !stored ){
					$.data( el, name + '.intercept', $.extend({}, handlers) );
					$.event.add( el, name, $intercept.handle );
				}else
					$.extend( stored, handlers );//update, the old ones have priority.
			});
		});
	};

	$intercept.absolute = /[\s>+~]/;

	$intercept.handle = function( e ){
		var handlers = $.data( this, e.type + '.intercept' ),//retrieve the handlers
			target = e.target,
			$target = $(target),
			selector, ret;

		if( !handlers ) return;

		for( selector in handlers ){
			 if( selector == 'self' && target == this  || $intercept.absolute.test(selector) 
			 ? $(selector).index(target) != -1 : $target.is(selector) )
				ret = handlers[selector].apply(target, arguments) !== false && ret;
		}
		return ret;
	};

})(jQuery);