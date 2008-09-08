/*
	Code almost entirely stolen from http://jsninja.com/. Great book.
*/
Spaz.Timers = {
	timerID: -1,
	timers: [],
	start: function() {
		// air.trace('called start');
		if (Spaz.Timers.timerID > -1) {
			// air.trace('nothing queued');
			return;
		}

		// air.trace(Spaz.Timers.timers);
		air.trace(Spaz.Timers.timerID);
		(function() {
			for (var i = 0; i < Spaz.Timers.timers.length; i++) {
				if (Spaz.Timers.timers[i]() === false) {
					// air.trace('timer finished: dropping');
					Spaz.Timers.timers.splice(i, 1);
					i--;
				}
			}
			
			// alert(arguments.callee);
			Spaz.Timers.timerID = setTimeout(arguments.callee, 0);
		})();
	},
	stop: function() {
		clearTimeout(Spaz.Timers.timerID);
		Spaz.Timers.timerID = -1;
	},
	add: function(fn) {

		Spaz.Timers.timers.push(fn);
		Spaz.Timers.start();
	}
};
