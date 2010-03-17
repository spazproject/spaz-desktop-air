
PurrJS = {};

 /*
	 modal
 */
PurrJS.modal = function(title, msg, icon, duration, position) {
	
	var width  = 400;
	var height = 300;
	
	var padding = 0;
	
	var farRight = air.Screen.mainScreen.bounds.right;
	var farTop   = air.Screen.mainScreen.bounds.top;
	
	var winX = farRight - width - padding;
	var winY = 0 + padding + 20;
	
	var opts = new air.NativeWindowInitOptions();
	opts.transparent = true;
	opts.type = air.NativeWindowType.UTILITY;
	opts.systemChrome = air.NativeWindowSystemChrome.NONE;
	opts.resizable = false;
	opts.minimizable = false;
	opts.maximizable = false;
	
	var winBounds = new air.Rectangle(winX, winY, width, height);
	var notifyLoader = air.HTMLLoader.createRootWindow(true, opts, false, winBounds);
	notifyLoader.load(new air.URLRequest("app:/html/modal.html"));
	notifyLoader.alpha = 0.6;


	 // air.Introspector.Console.info(notifyLoader);

	 // notifyLoader.window.document.getElementById('container').innerHTML = msg;
	

	fadeIn();
	var fadeOutTimeout = setTimeout(fadeOut, 8000);
	
	
	
	function fadeIn() {
		
		notifyLoader.alpha = 0;
		
		// start
		opacityUp();
		
		function opacityUp() {
			notifyLoader.alpha += 0.1;
			if (notifyLoader.alpha < 1) {
				setTimeout(opacityUp, 30); // do again
			}
		}
		
		
	}
	
	function fadeOut() {
		notifyLoader.alpha = 1;
		
		clearTimeout(fadeOutTimeout);
		
		// start
		opacityDown();
		
		function opacityDown() {
			notifyLoader.alpha -= 0.1;
			if (notifyLoader.alpha > 0 && opacityDown) {
				setTimeout(opacityDown, 30); // do again
			} else {
				notifyLoader.window.nativeWindow.close();
				notifyLoader = null;
			}
		}
		
	}
	
	
};







/*
   notify
*/
PurrJS.notify = function(opts) {
	opts = sch.defaults({
		'title':   'opts.title',
		'message': 'opts.message',
		'icon':    'opts.icon',
		'duration':6000, // in ms
		'position':'topRight',
		'height':  160,
		'width':   300,
		'padding': 0,
		'data':    null,
		'template':null,
		'onClick' :null,
		'onHover' :null
	}, opts);
	
	
	/*
	  Size of window
	*/
	var width  = opts.width;
	var height = opts.height;
	
	/*
	  padding from screen edges
	*/
	var padding = opts.padding;
	
	/*
	  get dimensions
	*/
	var farRight  = air.Screen.mainScreen.visibleBounds.right;
	var farTop    = air.Screen.mainScreen.visibleBounds.top;
	var farLeft   = air.Screen.mainScreen.visibleBounds.left;
	var farBottom = air.Screen.mainScreen.visibleBounds.bottom;
	
	/*
	  Calculate position
	*/
	var winX, winY;
	switch (opts.position) {
		case 'topLeft':
			winX = farLeft + padding;
			winY = farTop + padding + 0;
			break;

		case 'bottomLeft':
			winX = farLeft + padding;
			winY = farBottom - height - padding - 0;
			break;
		
		case 'bottomRight':
			winX = farRight - width - padding;
			winY = farBottom - height - padding - 0;
			break;
		
		default:
			winX = farRight - width - padding;
			winY = farTop + padding + 0;
			break;
	}
	sch.dump(winX+"x"+winY);
	/*
	  Create window
	*/
	var winopts = new air.NativeWindowInitOptions();
	winopts.transparent = true;
	winopts.type = air.NativeWindowType.LIGHTWEIGHT;
	winopts.systemChrome = air.NativeWindowSystemChrome.NONE;
	winopts.resizable = false;
	winopts.minimizable = false;
	winopts.maximizable = false;
	
	var winBounds = new air.Rectangle(winX, winY, width, height);
	
	// window is initially not visible to keep it from stealing focus
	var notifyLoader = air.HTMLLoader.createRootWindow(false, winopts, false, winBounds);
	
	notifyLoader.paintsDefaultBackground = false;
	notifyLoader.alpha = 1; // make the loader object transparent
	notifyLoader.stage.nativeWindow.alwaysInFront = true; // make the notify window a non-blocking modal
	
	/*
		bind notifyLoader.window.opener to this window
	*/
	notifyLoader.addEventListener(air.Event.HTML_DOM_INITIALIZE, function(){
		notifyLoader.window.opener = window;
	});
	
	var notify_url = "html/notify.html?json="+encodeURIComponent(sch.enJSON(opts));

	notifyLoader.load(new air.URLRequest(notify_url));
		
};