/*
* jQuery Advanced Effect Queues
* Copyright 2007 John Resig, Luciano Germán Panaro <contact@decodeuri.com>
* Released under the MIT and GPL licenses.
*/

(function(jQuery){

  var fxQueue = function() {
    return {
      isFxQueue: true,

      paused: false,

      pause: function() {
        if (this[0]) {
          this.paused = true;
          var playing = (this[0].isScope)? this[0] : this[0].elem;
          playing.stop();
        }
      },

      stop: function() {
        if (this[0]) {
          this.paused = false;
          var playing = (this[0].isScope)? this[0] : this[0].elem;
          playing.stop();
          this.length = 0;
        }
      },

      start: function() {
        if (this[0]) {
          this.paused = false;
          this[0]();
        }
      },

      getScope: function( scopeName ) {
          for (var i = 0; i < this.length; i++) {
            if ( this[i].isScope && this[i].called == scopeName )
              return this[i];
          }
          return false;
      }
    }
  };

  var fxScope = function ( scopeName ) {
      var newScope = function() {
          for (var i=0; i < newScope.items.length; i++) {
            newScope.items[i]();
          }
      };
      newScope.called = scopeName;
      newScope.isScope = true;
      newScope.finishedItems = 0;
      newScope.stop = function() {
          for (var i=0; i < newScope.items.length; i++) {
            newScope.items[i].elem.stop();
          }
      };
      newScope.items = [];
      
      return newScope;
  };

  // We need to overload the default animate method
  var animate = jQuery.fn.animate;

  jQuery.fn.animate = function( props, speed, easing, callback ){
    if (this.length < 1)
      return this;
  
    // Let normal animations just pass through
    if ( typeof speed == "object" && speed.queue === false ) {
      return animate.apply( this, arguments );

    // We'll handle everything else
    } else {
        var options = (typeof speed == "object")? speed: jQuery.speed(speed, easing, callback);

        // Load in the default options
        var opts = jQuery.extend({
            queue: "fx",
            position: "end",
            limit: -1,
            preDelay: 0,
            postDelay: 0,
            complete: function() {}
        }, options );
  
        var elem = this;

        // Get the name of the queue
        var queueName = opts.queue;

        // A global queue is centered on 'document'
        var root = opts.queue != "fx" ? document : this;
      
        // Get the effect queue
        var queue = jQuery(root).queue( opts.queue );

        // Extend the queue object if it's new.
        if ( !queue.isFxQueue ) {
          jQuery.extend(queue, fxQueue());
        }

        // Build in the dequeue operation
        var complete = opts.complete;

        opts.complete = function(){
            // Just dequeue once for every selection
            if(elem[0] == this) {
                var isScope = (queue[0] && queue[0].isScope);

                if (isScope) {
                    var queueItems = queue[0].items;
                    // Find the actual element in scope's items
                    for ( var i=0; i < queueItems.length; i++) {
                        if ( this == queueItems[i].elem[0] && !queueItems[i].finished ) {
                            queueItems[i].finished = true;
                            queue[0].finishedItems++;
                        }
                    }
                }

                // Dequeue
                setTimeout(function(){
                    // If it's not a scope, or if all scope items are finished
                    if ( !isScope || (queue[0] && queue[0].finishedItems == queueItems.length) ) {
                        jQuery(root).dequeue( queueName );
                    }
                }, opts.postDelay);
            }

            // Now let's apply the original callback function
            if (jQuery.isFunction(complete))
              return complete.apply( this, arguments );
        };

        // We're overriding the default queueing behavior
        opts.queue = false;

        // The animation to queue
        var fn = function(){
          setTimeout(function(){
              jQuery(fn.elem).animate( props, opts );
        	}, opts.preDelay);
        };
        fn.elem = this;

        // If scope exists, just add the animation and return
        var scope = queue.getScope( opts.scope );
        if ( scope ) {
            scope.items.push( fn );
            
            // Start the animation if the scope is already being played
            if ( queue[0].isScope && queue[0].called == opts.scope)
              fn();

            return this;
        }

        // Restrict the animation to a specifically sized queue
        if ( opts.limit < 0 || queue.length < opts.limit) {

            var add = null; //What we are going to add into the queue
            if ( opts.scope ) {
                add = fxScope( opts.scope );
                add.items.push(fn);
            } else {
                add = fn;
            }

            if ( opts.position == "end" ) {
              // Put the animation or scope in the right place on the queue
              queue.push( add );
            } else if ( opts.position == "front" ) {
              // Front is actually or scope just after the current animation
              queue.splice( 1, 0, add );
            }
            
            // If this is the first item in the queue, run immediately
            if ( queue.length == 1 )
              queue[0]();
            }

            return this;
      }
  };


	jQuery.fn.stop = function(clearQueue, gotoEnd, playNext){
		var timers = jQuery.timers;

		if (clearQueue)
			this.queue([]);

		this.each(function(){
			// go in reverse order so anything added to the queue during the loop is ignored
			for ( var i = timers.length - 1; i >= 0; i-- )
				if ( timers[i].elem == this ) {
 					if (gotoEnd)
						// force the next step to be the last
						timers[i](true);
					timers.splice(i, 1);
				}
		});

		// start the next in the queue if the last step wasn't forced
		if (playNext)
			this.dequeue();

		return this;
	};

  // Remove from Speed the complete override, which we now do in Animate
	jQuery.speed = function(speed, easing, fn) {
		var opt = speed && speed.constructor == Object ? speed : {
			complete: fn || function() {} && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && easing.constructor != Function && easing
		};

		opt.duration = (opt.duration && opt.duration.constructor == Number ? 
			opt.duration : 
			{ slow: 600, fast: 200 }[opt.duration]) || 400;

		return opt;
	};

  // A simple global fx queue getter
  jQuery.fxqueue = function(queueName) {
    return jQuery(document).queue( queueName );
  };

})(jQuery);
