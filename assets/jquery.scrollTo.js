/**
 * jQuery.ScrollTo
 * Copyright (c) 2007 Ariel Flesler - aflesler(at)gmail(dot)com
 * Licensed under GPL license (http://www.opensource.org/licenses/gpl-license.php).
 * Date: 11/16/2007
 *
 * @projectDescription Easy element scrolling using jQuery.
 * Compatible with jQuery 1.2.1, tested on Firefox 2.0.0.7, and IE 6, both on Windows.
 *
 * @author Ariel Flesler
 * @version 1.2.4
 *
 * @id jQuery.fn.scrollTo
 * @param {String|Number|DOMElement|jQuery} target Where to scroll the matched elements.
 *	  The different options for target are:
 *		- A number position (will be applied to all axes).
 *		- A string position ('44', '100px', '+=90', etc ) will be applied to all axes
 *		- A jQuery/DOM element ( logically, child of the element to scroll )
 *		- A string selector, that will be relative to the element to scroll ( 'li:eq(2)', etc )
 *		- A hash { top:x, left:y }, x and y can be any kind of number/string like above.
 * @param {Object} settings Hash of settings, optional.
 *	 @option {String} axis Which axis must be scrolled, use 'x', 'y', 'xy' or 'yx'.
 *	 @option {Number} speed The OVERALL length of the animation.
 *	 @option {String} easing The easing method for the animation.
 *	 @option {Boolean} margin If true, the margin of the target element will be deducted from the final position.
 *	 @option {Object|Number} offset Add/deduct from the end position. One number for both axis or { top:x, left:y }
 *	 @option {Boolean} queue If true, and both axis are given, the 2nd axis will only be animated after the first one ends.
 *	 @option {Function} onAfter Function to be called after the scrolling ends. 
 *	 @option {Function} onAfterFirst If queuing is activated, this function will be called after the first scrolling ends.
 * @return {jQuery} Returns the same jQuery object, for chaining.
 *
 * @example $('div').scrollTo( 340 );
 *
 * @example $('div').scrollTo( '+=340px', { axis:'y' } );
 *
 * @example $('div').scrollTo( 'p.paragraph:eq(2)', { speed:500, easing:'swing', queue:true, axis:'xy' } );
 *
 * @example var second_child = document.getElementById('container').firstChild.nextSibling;
 *			$('#container').scrollTo( second_child, { speed:500, axis:'x', onAfter:function(){
 *				alert('scrolled!!');																   
 *			}});
 *
 * @example $('div').scrollTo( { top: 300, left:'+=200' }, { offset:-20 } );
 *
 * Notes:
 *  - jQuery.scrollTo will make the whole window scroll, it accepts the same parameters as jQuery.fn.scrollTo.
 *  - The plugin no longer requires Dimensions.
 *	- If you are interested in animated "same-page-scrolling" using anchors, check http://jquery.com/plugins/project/LocalScroll.
 *	- The option 'margin' won't be valid, if the target is an absolute position.
 *	- The option 'queue' won't be taken into account, if only 1 axis is given.
 **/
(function( $ ){
		  
	$.scrollTo = function( target, settings ){
		return $('html,body').scrollTo( target, settings );
	};
	
	$.scrollTo.defaults = {
		axis:'y',
		speed:1
	};
	
	$.fn.scrollTo = function( target, settings ){
		settings = $.extend( {}, $.scrollTo.defaults, settings );
		settings.queue = settings.queue && settings.axis.length == 2;//make sure the settings are given right
		if( settings.queue )
			settings.speed = Math.ceil( settings.speed / 2 );//let's keep the overall speed, the same.
		if( typeof settings.offset == 'number' )
			settings.offset = { left: settings.offset, top: settings.offset };
		
		return this.each(function(){
			var $elem = $(this), t = target, toff, attr = {};
			switch( typeof t ){
				case 'number'://will pass the regex
				case 'string':
					if( /^([+-]=)?\d+(px)?$/.test(t) ){
						t = { top:t, left:t };
						break;//we are done
					}
					t = $(t,this);// relative selector, no break!
				case 'object':
					if( t.is || t.style )//DOM/jQuery
						toff = (t = $(t)).offset();//get the real position of the target 
			}
			$.each( settings.axis.split(''), parse );			
			animate( settings.onAfter );			
			
			function parse( i, axis ){
				var Pos	= axis == 'x' ? 'Left' : 'Top',
					pos = Pos.toLowerCase(),
					key = 'scroll' + Pos,
					act = $elem[0][key];
					
				attr[key] = toff ? toff[pos] + ( $elem.is('html,body') ? 0 : act - $elem.offset()[pos] ) : t[pos];
				
				if( settings.margin && t.css )//if it's a dom element,reduce the margin
					attr[key] -= parseInt( t.css('margin'+Pos) ) || 0;
				
				if( settings.offset && settings.offset[pos] )
					attr[key] += settings.offset[pos];
				
				if( !i && settings.queue ){//queueing each axis is required					
					if( act != attr[key] )//don't waste time animating, if there's no need.
						animate( settings.onAfterFirst );//intermediate animation
					delete attr[key];//don't animate this axis again in the next iteration.
				}
			};
			function animate( callback ){
				$elem.animate( attr, settings.speed, settings.easing, function(){
					if( callback )
						callback.call(this, $elem, attr, t );
				});
			};
		});
	};

})( jQuery );