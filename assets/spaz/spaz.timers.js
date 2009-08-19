/*
	Code almost entirely stolen from http://jsninja.com/. Great book.
*/
Spaz.Timers = {
	timerID: -1,
	timers: [],
	start: function() {
		// sch.dump('called start');
		if (Spaz.Timers.timerID > -1) {
			// sch.dump('nothing queued');
			return;
		}

		// sch.dump(Spaz.Timers.timers);
		sch.dump(Spaz.Timers.timerID);
		(function() {
			for (var i = 0; i < Spaz.Timers.timers.length; i++) {
				if (Spaz.Timers.timers[i]() === false) {
					// sch.dump('timer finished: dropping');
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
