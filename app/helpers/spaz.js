/**
 *  
 */
function openPopboxURL(url) {
	var cont_width = jQuery('#container').outerWidth();
	jQuery.openDOMWindow({ 
		windowSource:  'iframe',
        windowSourceURL:url,
		windowPadding: 0,
		positionType:  'centered',
		width:         cont_width-30,

		// height:'300',
		overlay:1,
		overlayOpacity:60,
		overlayColor:'#000'
    });

	
	jQuery('#DOMWindow').outerWidth( cont_width-30 );
}


/**
 *  
 */
function openPopboxInline(content_id) {
	var cont_width = jQuery('#container').outerWidth();
	jQuery.openDOMWindow({ 
		windowSource:  'inline',
        windowSourceID: content_id,
		windowPadding: 0,
		positionType:  'centered',
		width:         cont_width-30,
		// height:'300',
		overlay:1,
		overlayOpacity:60,
		overlayColor:'#000'
    });
}