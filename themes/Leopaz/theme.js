// Add the following to your user.js file to customize the interface:



/*** Scrollbars ***/

// Single arrows at both the start and the end
// $('body').addClass('scrollbar-single-both');

// Doubled arrows at both the start and the end
// $('body').addClass('scrollbar-double-both');



// Make #entryform resizable
(function(){
  var $body             = $('body'),
      $timeline         = $('#timeline-tabs-content, .TabbedPanelsContentGroup'),
      $entryForm        = $('#entryform'),
      entryFormBottom   = parseInt($entryForm.css('bottom'), 10),
      $entryBoxPopup    = $('#entrybox-popup'),
      $resize           = $('<div id="leopaz-entryform-resize"></div>');
      setEntryFormHeight = function(newHeight){
        $timeline.css('bottom', newHeight + 28);
        $entryForm.height(newHeight);
        $entryBoxPopup.css('bottom', newHeight - 11);
      },
      onMouseMove = function(ev){
        var newHeight = nativeWindow.height - ev.pageY - entryFormBottom;

        // Set max height: don't overlap header
        newHeight = Math.min(nativeWindow.height - 96, newHeight);

        // Set min height: fit at least one line of text
        newHeight = Math.max(34, newHeight);

        setEntryFormHeight(newHeight);
      },
      bindMouseMove = function(){
        sch.note('- bind mousemove'); // FIXME: Testing; remove
        $body.mousemove(onMouseMove);
      },
      unbindMouseMove = function(){
        sch.note('- unbind mousemove'); // FIXME: Testing; remove
        $body.unbind('mousemove', onMouseMove);
      };

  $resize.prependTo($entryForm).mousedown(function(ev){
    sch.note('resize-'+ev.type); // FIXME: Testing; remove
    bindMouseMove();
  }).bind('mouseup', function(ev){
    sch.note('resize-'+ev.type); // FIXME: Testing; remove
    unbindMouseMove();
  });

  $body.mouseout(function(ev){
    if($(ev.target).is('body')){
      unbindMouseMove();
    }
  }).mouseup(function(ev){
    unbindMouseMove();
  });

  window.nativeWindow.addEventListener(air.NativeWindowBoundsEvent.RESIZE, function(){
    var max = nativeWindow.height - 96;
    if($entryForm.height() > max){
      setEntryFormHeight(max);
    }
  });
})();
