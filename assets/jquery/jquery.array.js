/*
 * jQuery Array - A collection of jQuery plugins to make jQuery objects behave
 * more like a Javascript Array
 *
 * Based on work by the jQuery Community (http://www.nabble.com/.each-backwards---tf2399145.html#a6690114)
 * and Kenton Simpson (http://www.brainknot.com/code/jQarray.js)
 *
 * Copyright (c) 2007 Paul McLanahan, Kenton Simpson
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id$
 *
 * Version: 0.1
 */
 
/**
 * Reverse the order elements appear in the jQuery element collection
 *
 * @example $("li").reverse().each(function(i) {
 *   $(this).prepend(i+": ");
 * });
 * @before <li>First Item</li>
 * <li>Second Item</li>
 * <li>Third Item</li>
 * @result <li>2: First Item</li>
 * <li>1: Second Item</li>
 * <li>0: Third Item</li>
 *
 * @name reverse
 * @type jQuery
 * @param Boolean destruct If true this function will act distructively on a cached jQuery object.
 * @cat Plugins/Array
 */
jQuery.fn.reverse = function(destruct) {
	return this[destruct?'setArray':'pushStack'](this.get().reverse());
};

/**
 * Sort the order elements appear in the jQuery element collection
 *
 * @example $("li").sort(function( a, b ){
 *   return( parseInt( a.innerHTML ) - parseInt( b.innerHTML ) );
 * });
 *
 * @name sort
 * @type jQuery
 * @param Function fn Sort function to act on jQuery element collection.
 * @param Boolean destruct If true this function will act distructively on a cached jQuery object.
 * @cat Plugins/Array
 */
jQuery.fn.sort = function(fn,destruct) {
	return this[destruct?'setArray':'pushStack'](this.get().sort(fn));
};

/**
 * Randomize the order of the elements in the current jQuery element collection.
 * Note: Does not affect the order of elements in the DOM.
 *
 * @example $("li").randomize();
 *
 * @name randomize
 * @type jQuery
 * @param Boolean destruct If true, this function will act distructively on a cached jQuery object.
 * @cat Plugins/Array
 */
jQuery.fn.randomize = function(destruct){
	return this.sort( function(){return(Math.round(Math.random())-0.5)}, destruct );
};

/**
 * Take a slice out of the current jQuery element collection
 *
 * @example $li = $("li").slice(2, 6).hide();
 * @result $li.length == 4
 *
 * @name slice
 * @type jQuery
 * @param Int Start of slice
 * @param Int End of slice
 * @param Boolean destruct If true, this function will act distructively on a cached jQuery object
 * @cat Plugins/Array
 */
// Check for jQuery 1.2 and backup default slice function
if(jQuery.fn.slice) jQuery.fn._slice = jQuery.fn.slice;
jQuery.fn.slice = function(start,end,destruct) {
	return this[destruct?'setArray':'pushStack']( Array.prototype.slice.call( this, start, end ) );
};

/**
 * Remove the last element in the jQuery element collection and disregard
 * Note: This does not return the popped element, which is unlike the native Array.pop
 * Javascript function. It returns a jQuery object to maintain chainability. See
 * returnObject parameter for a workaround.
 *
 * @example $('li').pop().length == $('li').length - 1
 *
 * @name shift
 * @type jQuery
 * @param Boolean destruct If true, this function will act distructively on a cached jQuery object
 * @param Object returnObject If supplied the object will be extended with a "pop" property containing the popped element
 * @cat Plugins/Array
 */
jQuery.fn.pop = function(destruct,returnObject){
	if(returnObject)jQuery.extend(returnObject,{pop:this[this.length-1]});
	return this.slice( 0, -1, destruct );
};

/**
 * Remove the first element in the jQuery element collection and disregard
 * Note: This does not return the shifted element, which is unlike the native Array.shift
 * Javascript function. It returns a jQuery object to maintain chainability. See
 * returnObject parameter for a workaround.
 *
 * @example $('li').shift()[0] == 2nd <li> found
 *
 * @name shift
 * @type jQuery
 * @param Boolean destruct If true, this function will act distructively on a cached jQuery object
 * @param Object returnObject If supplied the object will be extended with a "shift" property containing the shifted element
 * @cat Plugins/Array
 */
jQuery.fn.shift = function(destruct,returnObject){
	if(returnObject)jQuery.extend(returnObject,{shift:this[0]});
	return this.slice( 1, this.length, destruct );
};

/**
 * Move the first jQuery element to the last
 *
 * @example $('li').rotate()[0] == 2nd <li> found
 *
 * @name rotate
 * @type jQuery
 * @param Boolean destruct If true, this function will act distructively on a cached jQuery object
 * @cat Plugins/Array
 */
jQuery.fn.rotate = function(destruct){
	var a = this.get();
	a.push(a.shift());
	return this[destruct?'setArray':'pushStack']( a );
};

/**
 * Move the last jQuery element to the first
 *
 * @example $('li').rrotate()[0] == last <li> found
 *
 * @name rrotate
 * @type jQuery
 * @param Boolean destruct If true, this function will act distructively on a cached jQuery object
 * @cat Plugins/Array
 */
jQuery.fn.rrotate = function(destruct){
  var a = this.get();
  a.unshift(a.pop());
  return this[destruct?'setArray':'pushStack']( a );
};
