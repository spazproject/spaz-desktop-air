// Make #entryform resizable
(function(){
  var $body             = $('body'),
      $timeline         = $('#timeline-tabs-content, .TabbedPanelsContentGroup'),
      $entryForm        = $('#entryform'),
      entryFormBottom   = parseInt($entryForm.css('bottom'), 10),
      $entryBoxPopup    = $('#entrybox-popup'),
      $resize           = $('<div id="leopaz-entryform-resize"></div>'),
      maxEntryFormHeight = function(){
        return nativeWindow.height - 96;
      },
      setEntryFormHeight = function(newHeight){
        $timeline.css('bottom', newHeight + 28);
        $entryForm.height(newHeight);
        $entryBoxPopup.css('bottom', newHeight - 11);
      },
      onMouseMove = function(ev){
        var newHeight = nativeWindow.height - ev.pageY - entryFormBottom;

        // Set max height: don't overlap header
        newHeight = Math.min(maxEntryFormHeight(), newHeight);

        // Set min height: fit at least one line of text
        newHeight = Math.max(34, newHeight);

        setEntryFormHeight(newHeight);
      },
      onMouseEnter  = function(ev){ stopResizing(); },
      onMouseUp     = function(ev){ stopResizing(); },
      onMouseOut    = function(ev){
        if($(ev.target).is('body')){ stopResizing(); }
      },
      startResizing = function(){
        $body
          .mouseout(onMouseOut)     // Must bind this first so it runs first
          .mouseenter(onMouseEnter) // Backup for when body mouseout isn't caught
          .mouseup(onMouseUp)
          .mousemove(onMouseMove);
      },
      stopResizing = function(){
        $body
          .unbind('mouseout',   onMouseOut)
          .unbind('mouseenter', onMouseEnter)
          .unbind('mouseup',    onMouseUp)
          .unbind('mousemove',  onMouseMove);
      };

  $resize.prependTo($entryForm)
    .mousedown(function(ev){ startResizing(); })
    .mouseup(onMouseUp);

  window.nativeWindow.addEventListener(air.NativeWindowBoundsEvent.RESIZE, function(){
    var max = maxEntryFormHeight();
    if($entryForm.height() > max){ setEntryFormHeight(max); }
  });
})();



// Add the following to your user.js file to customize the interface:

// Single scrollbar arrows at both the start and the end
// $('body').addClass('scrollbar-single-both');

// Double scrollbar arrows at both the start and the end
// $('body').addClass('scrollbar-double-both');
