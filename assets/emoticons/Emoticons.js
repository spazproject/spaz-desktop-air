var Emoticons; if (!Emoticons) Emoticons = {};

// Might be going completely over the top with this char set...
// const CHARS_TO_ESCAPE = /[\\=!^$*+?.:|(){}[\]]/g;
const CHARS_TO_ESCAPE = /[\\=!^$*+?.:|(){}[\]]/g;
//const CHARS_TO_ESCAPE = /[\\?|()]/g;

// Create a regular expression to match all emoticons
// defined for a particular emoticons set.
//
// Some characters must be escaped with a backslash "\"; many of
// these may be present in emoticon character sequences. This function
// adds the escape where necessary. Chars to be replaced are defined by
// CHARS_TO_ESCAPE.
Emoticons.buildRegexp = function(mappings) {
    var result = "";
    for (smiley in mappings) {
        if (result > "") {
            result += "|";
        }
        result += smiley.replace(CHARS_TO_ESCAPE, "\\$&");
    }

	result = "(^|\\s)("+result+")(\\s|$)";

    return new RegExp(result, "g");
}

// Replace emoticon char sequences with an <img/> tag.
Emoticons.convertEmoticons = function(msg, regexp, mappings, className) {
    return msg.replace(
        regexp,
        function(matched, p1, p2, p3) {
            var imgHTML = p1+'<img ';
            imgHTML += 'class="' + className + ' emoticon" ';
            imgHTML += 'alt="'   + matched + '" ';
            imgHTML += 'title="' + matched + '" ';
            imgHTML += 'src="'   + mappings[p2] + '" ';
            imgHTML += '/>'+p3;
            return imgHTML;
        }
    );
}