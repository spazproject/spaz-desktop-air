/*
	Helper collection of functions to determine data types
*/

// Return a boolean value telling whether // the first argument is a string.
function isString() {
    if (typeof arguments[0] == 'string') return true;
    if (typeof arguments[0] == 'object') {
        var criterion = arguments[0].constructor.toString().match(/string/i);
        return (criterion != null);
    }
    return false;
}