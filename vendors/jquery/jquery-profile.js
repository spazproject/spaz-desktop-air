(function(){
  var log = [];
  var handle = jQuery.event.handle, ready = jQuery.ready;
  var internal = false;
  var eventStack = [];
  var curEvent = log[0] = { event: "inline", methods: [], duration: 0 };

  if ( !jQuery.readyList )
    jQuery.readyList = [];

  jQuery.readyList.unshift(function(){
    if ( curEvent && curEvent.event == "inline" && curEvent.methods.length == 0 ) {
      log.shift();
    }

    if ( curEvent )
      eventStack.push( curEvent );

    var e = curEvent = log[log.length] = { event: "ready", target: formatElem(document), methods: [] };
    var start = (new Date).getTime();
    jQuery(document).bind("ready", function(){
      e.duration = (new Date).getTime() - start;
      curEvent = eventStack.pop();
    });
  });

  jQuery.event.handle = function(event){
    var pos = log.length;

    if ( curEvent )
      eventStack.push( curEvent );

    var e = curEvent = log[pos] = { event: event.type, target: formatElem(event.target), methods: [] };
    var start = (new Date).getTime();
    var ret = handle.apply( this, arguments );
    e.duration = (new Date).getTime() - start;
    curEvent = eventStack.pop();

    if ( e.methods.length == 0 && e.duration <= 1 ) {
      log.splice( pos, 1 );
    }

    return ret;
  };

  for ( var method in jQuery.fn ) (function(method){
    if ( method == "init" ) return;

    var old = jQuery.fn[method];

    jQuery.fn[method] = function(){
      if ( !internal && curEvent ) {
        internal = true;
        var m = curEvent.methods[curEvent.methods.length] = { name: method, inLength: this.length, args: formatArgs(arguments) };
        var start = (new Date).getTime();
        var ret = old.apply( this, arguments );
        m.duration = (new Date).getTime() - start;

        if ( curEvent.event == "inline" )
          curEvent.duration += m.duration;

        if ( ret && ret.jquery )
          m.outLength = ret.length;
        internal = false;
        return ret;
      } else {
        return old.apply( this, arguments );
      }
    };
  })(method);

  var init = jQuery.fn.init;

  jQuery.fn.init = function(){
    var args = Array.prototype.slice.call( arguments );
    if ( typeof args[1] == "undefined" )
      args.pop();

    if ( !internal && curEvent ) {
      internal = true;
      var m = curEvent.methods[curEvent.methods.length] = { name: "jQuery", args: formatArgs(args) };
      var start = (new Date).getTime();
      var ret = init.apply( this, arguments );
      m.duration = (new Date).getTime() - start;
      if ( curEvent.event == "inline" )
        curEvent.duration += m.duration;
      m.outLength = ret.length;
      internal = false;
      return ret;
    } else {
      return init.apply( this, args );
    }
  };

  jQuery.fn.init.prototype = init.prototype;

  jQuery.getProfile = function(){
    return log;
  };


jQuery.displayProfileInPopup = function(){
    var str = "<div style='text-align:left;background:#FFFFCC;color:#000;font-size:10px;padding:8px;margin:10px;z-index:1000'>";

    for ( var i = 0; i < log.length; i++ ) {
      var total = log[i].duration;
      str += "<big><b>Event: " + log[i].event + " (" + log[i].duration + "ms)</b></big><br/>" + 
        "<table><tr><th>%</th><th>(ms)</th><th>Method</th><th>in</th><th>out</th></tr>";

      var methods = log[i].methods;
      for ( var m = 0; m < methods.length; m++ ) {
        var method = methods[m];
        str += "<tr><td>" + ((method.duration / total) * 100).toFixed(1) + "%</td><td>" +
          method.duration + "</td><td>" + (method.name == "jQuery" ? "" : "&nbsp;&nbsp;.") + method.name + "(" + method.args + ")</td>" +
          "<td>" + (method.inLength || "") + "</td><td>" + (method.outLength || "") + "</td></tr>";
      }

      str += "</table>";
    }

    str = str + "</div>";
	
	var opts = new air.NativeWindowInitOptions();
	// opts.transparent = true;
	// opts.type = air.NativeWindowType.LIGHTWEIGHT;
	// opts.systemChrome = air.NativeWindowSystemChrome.NONE;
	opts.resizable = false;
	opts.minimizable = false;
	opts.maximizable = false;
	
	
	var winBounds = new air.Rectangle(10, 10, 500, 500);
	var notifyLoader = air.HTMLLoader.createRootWindow(true, opts, true, winBounds);
	notifyLoader.loadString(str);
	
  };


  jQuery.displayProfile = function(){
    var str = "<div style='text-align:left;background:#FFF;color:#000;font-size:10px;width:400px;height:400px;overflow:auto;padding:8px;margin:10px;'>";

    for ( var i = 0; i < log.length; i++ ) {
      var total = log[i].duration;
      str += "<big><b>Event: " + log[i].event + " (" + log[i].duration + "ms)</b></big><br/>" + 
        "<table><tr><th>%</th><th>(ms)</th><th>Method</th><th>in</th><th>out</th></tr>";

      var methods = log[i].methods;
      for ( var m = 0; m < methods.length; m++ ) {
        var method = methods[m];
        str += "<tr><td>" + ((method.duration / total) * 100).toFixed(1) + "%</td><td>" +
          method.duration + "</td><td>" + (method.name == "jQuery" ? "" : "&nbsp;&nbsp;.") + method.name + "(" + method.args + ")</td>" +
          "<td>" + (method.inLength || "") + "</td><td>" + (method.outLength || "") + "</td></tr>";
      }

      str += "</table>";
    }

    jQuery("body").append( str + "</div>" );
  };

  function formatElem(elem) {
    var str = "";

    if ( elem.tagName ) {
      str = "&lt;" + elem.tagName.toLowerCase();

      if ( elem.id )
        str += "#" + elem.id;

      if ( elem.className )
        str += "." + elem.className.replace(/ /g, ".");

      str += "&gt;";
    } else {
      str = elem.nodeName;
    }

    return str;
  }

  function formatArgs(args) {
    var str = [];

    for ( var i = 0; i < args.length; i++ ) {
      var item = args[i];

      if ( item && item.constructor == Array ) {
        str.push( "Array(" + item.length + ")" );
      } else if ( item && item.jquery ) {
        str.push( "jQuery(" + item.length + ")" );
      } else if ( item && item.nodeName ) {
	str.push( formatElem( item ) );
      } else if ( item && typeof item == "function" ) {
        str.push( "function()" );
      } else if ( item && typeof item == "object" ) {
        str.push( "{...}" );
      } else if ( typeof item == "string" ) {
        str.push( '"' + item.replace(/&/g, "&amp;").replace(/</g, "&lt;") + '"' );
      } else {
        str.push( item + "" );
      }
    }

    return str.join(", ");
  }
})();
