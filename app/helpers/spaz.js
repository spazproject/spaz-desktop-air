/**
 *  opens a popbox that contains an iframe displaying the passed URL
 */
function openPopboxURL(url) {
	var cont_width = jQuery('#container').outerWidth();
	jQuery.openDOMWindow({ 
		windowSource:  'iframe',
        windowSourceURL:url,
		windowPadding: 0,
		positionType:  'centered',
		width:         cont_width-30,
		height:'300',
		overlay:1,
		overlayOpacity:60,
		overlayColor:'#000'
    });

	
	jQuery('#DOMWindow').outerWidth( cont_width-30 );
}


/**
 *  opens a popbox that contains the contents within the element of the passed ID
 */
function openPopboxInline(content_id) {
	var cont_width  = jQuery('body').outerWidth();
	var cont_height = jQuery('body').outerHeight();
	jQuery.openDOMWindow({ 
		// windowSource:  'inline',
        windowSourceID: content_id,
		windowPadding: 0,
		positionType:  'centered',
		// fixedWindowY:  30,
		width:         cont_width-40,
		height:        cont_height-100,
		overlay:1,
		overlayOpacity:60,
		overlayColor:'#000',
		
    });

	jQuery('#DOMWindow').outerWidth( cont_width -30 );
	jQuery('#DOMWindow').outerHeight( cont_height-30 );

	return false;
}

/**
 * closes the open popbox 
 */
function closePopbox() {
	jQuery.closeDOMWindow();
}