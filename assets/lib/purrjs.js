
PurrJS = {}

 /*
     modal
 */
PurrJS.modal = function(title, msg, icon, duration, position) {
	
	var width  = 400;
	var height = 300;
	
	var padding = 5;
	
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
	notifyLoader.alpha = .6;


     // air.Introspector.Console.info(notifyLoader);

     // notifyLoader.window.document.getElementById('container').innerHTML = msg;
	

	fadeIn();
	var fadeOutTimeout = setTimeout(fadeOut, 8000);
	
	
	
	function fadeIn() {
		
		notifyLoader.alpha = 0;
		
		// start
		opacityUp();
		
		function opacityUp() {
			notifyLoader.alpha += .1;
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
			notifyLoader.alpha -= .1;
			if (notifyLoader.alpha > 0 && opacityDown) {
				setTimeout(opacityDown, 30); // do again
			} else {
				notifyLoader.window.nativeWindow.close();
				notifyLoader = null;
			}
		}
		
	}
	
	
}







/*
   notify
*/
PurrJS.notify = function(title, msg, img, duration, position) {
	
	/*
	  Size of window
	*/
	var width  = 300;
	var height = 75;
	
	/*
	  padding from screen edges
	*/
	var padding = 5;
	
	/*
	  get dimensions
	*/
	var farRight = air.Screen.mainScreen.bounds.right;
	var farTop   = air.Screen.mainScreen.bounds.top;
	var farLeft = air.Screen.mainScreen.bounds.left;
	var farBottom   = air.Screen.mainScreen.bounds.bottom;
	
	/*
	  Calculate position
	*/
	switch (position) {
      case 'topLeft':
         var winX = farLeft + padding;
      	var winY = farTop + padding + 20;
      	break;
      
      case 'bottomLeft':
         var winX = farLeft + padding;
      	var winY = farBottom - padding - 20;
   	   break;
      
      case 'bottomRight':
         var winX = farRight - width - padding;
      	var winY = farBottom - padding - 20;
      	break;
	      
	   default:
	      var winX = farRight - width - padding;
      	var winY = farTop + padding + 20;
      	break;
	}
	air.trace(winX+"x"+winY);
	/*
	  Create window
	*/
	var opts = new air.NativeWindowInitOptions();
	opts.transparent = true;
	opts.type = air.NativeWindowType.UTILITY;
	opts.systemChrome = air.NativeWindowSystemChrome.NONE;
	opts.resizable = false;
	opts.minimizable = false;
	opts.maximizable = false;
	
	var winBounds = new air.Rectangle(winX, winY, width, height);
	var notifyLoader = air.HTMLLoader.createRootWindow(true, opts, false, winBounds);
	// "notify.html?msg="+msg+"&title="+title+"&img="+img
	var notify_url = "app:/html/notify.html?msg="+encodeURIComponent(msg)+"&title="+encodeURIComponent(title)+"&img="+encodeURIComponent(img);
	notifyLoader.load(new air.URLRequest(notify_url));
	notifyLoader.alpha = .6; // make the loader object transparent
	notifyLoader.stage.nativeWindow.visible = false; // use this to avoid stealing focus
	notifyLoader.stage.nativeWindow.alwaysInFront = true; // make the notify window a modal

	
	
	// air.Introspector.Console.info(notifyLoader);

   // notifyLoader.window.document.getElementById('msg').innerHTML = msg;
	
	notifyLoader.addEventListener('click', function(event) {
	      fadeOut();
	   }
	);
	

	fadeIn();
	var fadeOutTimeout = setTimeout(fadeOut, 6000);
	
	
	
	function fadeIn() {
		
		notifyLoader.alpha = 0;
		
		// start
		opacityUp();
		notifyLoader.stage.nativeWindow.visible = true; // doing this avoids stealing focus
		
		function opacityUp() {
			air.trace('opacityUp');
			if (notifyLoader) {
				notifyLoader.alpha += .1;
				if (notifyLoader.alpha < 1) {
					setTimeout(opacityUp, 30); // do again
				}
			} else {
				return false;
			}
		}
		
		
	}
	
	function fadeOut(event) {
		
		clearTimeout(fadeOutTimeout);
		
		notifyLoader.alpha = 1;
		
		// start
		opacityDown();
		
		function opacityDown() {
			air.trace('opacityDown');
			notifyLoader.alpha -= .1;
			if (notifyLoader.alpha > 0 && opacityDown) {
				setTimeout(opacityDown, 30); // do again
			} else {
				notifyLoader.window.nativeWindow.close();
				notifyLoader = null;
			}
		}
		
	}
	
	
}
