// Add the following to your user.js file to customize the interface:



/*** Scrollbars ***/

// Single arrows at both the start and the end
// $('body').addClass('scrollbar-single-both');

// Doubled arrows at both the start and the end
// $('body').addClass('scrollbar-double-both');



// Make entrybox resizable
(function(){
  var $body             = $('body'),
      $timeline         = $('#timeline-tabs-content, .TabbedPanelsContentGroup'),
      $entryform        = $('#entryform'),
      entryformBottom   = parseInt($entryform.css('bottom'), 10),
      $entryboxPopup    = $('#entrybox-popup'),
      $resize           = $('<div id="leopaz-entryform-resize"></div>');
      onMouseMove = function(ev){
        var entryformHeight = nativeWindow.height - ev.pageY - entryformBottom;
        entryformHeight = Math.min(300, entryformHeight); // Set max height
        entryformHeight = Math.max(33, entryformHeight);  // Set min height

        $timeline.css('bottom', entryformHeight + 28);
        $entryform.height(entryformHeight);
        $entryboxPopup.css('bottom', entryformHeight - 11);
      },
      bindMouseMove = function(){
        sch.note('- bind mousemove'); // FIXME: Testing; remove
        $body.mousemove(onMouseMove);
      },
      unbindMouseMove = function(){
        sch.note('- unbind mousemove'); // FIXME: Testing; remove
        $body.unbind('mousemove', onMouseMove);
      };

  $resize.prependTo($entryform).mousedown(function(ev){
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

})();
