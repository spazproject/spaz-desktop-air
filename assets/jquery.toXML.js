
jQuery.fn.toXML = function () {
    var out = '';
    if (this.length > 0) {
        if (typeof XMLSerializer == 'function' ||
            typeof XMLSerializer == 'object')
        {
            var xs = new XMLSerializer();
            this.each(function() {
                out += xs.serializeToString(this);
            });
        } else if (this[0].xml !== undefined) {
            this.each(function() {
                out += this.xml;
            });
        } else {
            // TODO: Manually serialize DOM here,
            // for browsers that support neither
            // of two methods above.
        }
    }
    return out;
}