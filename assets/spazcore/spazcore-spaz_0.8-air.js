/*********** Built 2010-06-22 11:14:11 EDT ***********/
/*jslint 
browser: true,
nomen: false,
debug: true,
forin: true,
regexp: false,
undef: true,
white: false,
onevar: false 
 */

/**
 * SPAZCORE
 * version 0.1.1
 * 2009-08-06
 * 
 * License
 * 
 * Copyright (c) 2008-2009, Edward Finkler, Funkatron Productions
 * 
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 *         Redistributions of source code must retain the above copyright
 *         notice, this list of conditions and the following disclaimer.
 * 
 *         Redistributions in binary form must reproduce the above
 *         copyright notice, this list of conditions and the following
 *         disclaimer in the documentation and/or other materials provided
 *         with the distribution.
 * 
 *         Neither the name of Edward Finkler, Funkatron Productions nor
 *         the names of its contributors may be used to endorse or promote
 *         products derived from this software without specific prior written
 *         permission.
 * 
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 * 
 * SpazCore includes code from other software projects. Their licenses follow:
 * 
 * date.js
 * @copyright: Copyright (c) 2006-2008, Coolite Inc. (http://www.coolite.com/). All rights reserved.
 * @license: Licensed under The MIT License. See license.txt and http://www.datejs.com/license/.
 * 
 * webtoolkit.info (hash libs, trim funcs, utf8 encoder/decoder)
 * http://www.webtoolkit.info/
 * As long as you leave the copyright notice of the original script, or link
 * back to this website, you can use any of the content published on this
 * website free of charge for any use: commercial or noncommercial.
 */
 
/**
 * 
 * @namespace root namespace for SpazCore
 */
var sc = {};

/**
 * @namespace namespace for app-specific stuff
 */
sc.app = {};

/**
 * @namespace namespace for helper methods
 */
sc.helpers = {};

/**
 * dump level for limiting what gets dumped to console 
 */
sc.dumplevel = 1;

/**
 * method to set dump level 
 */
sc.setDumpLevel = function(level) {
	sc.dumplevel = parseInt(level, 10);
};

/**
 * @namespace helper shortcuts 
 * this lets us write "sch.method" instead of "sc.helpers.method"
 * 
 */
var sch = sc.helpers;


sc.events = {};





/**
 * Build the helpers
 * @depends ../helpers/datetime.js 
 * @depends ../helpers/event.js 
 * @depends ../helpers/javascript.js 
 * @depends ../helpers/json.js 
 * @depends ../helpers/location.js 
 * @depends ../helpers/string.js 
 * @depends ../helpers/sys.js 
 * @depends ../helpers/view.js 
 * @depends ../helpers/xml.js 
 * 
 * Build the libs
 * @depends spazcron.js
 * @depends spazlocker.js
 * @depends spazphotomailer.js
 * @depends spazpingfm.js
 * @depends spazprefs.js
 * @depends spazshorttext.js
 * @depends spazshorturl.js
 * @depends spaztemplate.js
 * @depends spaztimeline.js
 * @depends spaztwit.js
 */
/*
    http://www.JSON.org/json2.js
    2008-11-19

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html

    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the object holding the key.

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/

/*jslint evil: true */

/*global JSON */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/

// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    JSON = {};
}
(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z';
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
})();
/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS 180-1
 * Version 2.2 Copyright Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_sha1(s)    { return rstr2hex(rstr_sha1(str2rstr_utf8(s))); }
function b64_sha1(s)    { return rstr2b64(rstr_sha1(str2rstr_utf8(s))); }
function any_sha1(s, e) { return rstr2any(rstr_sha1(str2rstr_utf8(s)), e); }
function hex_hmac_sha1(k, d)
  { return rstr2hex(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d))); }
function b64_hmac_sha1(k, d)
  { return rstr2b64(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d))); }
function any_hmac_sha1(k, d, e)
  { return rstr2any(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)), e); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function sha1_vm_test()
{
  return hex_sha1("abc").toLowerCase() == "a9993e364706816aba3e25717850c26c9cd0d89d";
}

/*
 * Calculate the SHA1 of a raw string
 */
function rstr_sha1(s)
{
  return binb2rstr(binb_sha1(rstr2binb(s), s.length * 8));
}

/*
 * Calculate the HMAC-SHA1 of a key and some data (raw strings)
 */
function rstr_hmac_sha1(key, data)
{
  var bkey = rstr2binb(key);
  if(bkey.length > 16) bkey = binb_sha1(bkey, key.length * 8);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = binb_sha1(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
  return binb2rstr(binb_sha1(opad.concat(hash), 512 + 160));
}

/*
 * Convert a raw string to a hex string
 */
function rstr2hex(input)
{
  try { hexcase } catch(e) { hexcase=0; }
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var output = "";
  var x;
  for(var i = 0; i < input.length; i++)
  {
    x = input.charCodeAt(i);
    output += hex_tab.charAt((x >>> 4) & 0x0F)
           +  hex_tab.charAt( x        & 0x0F);
  }
  return output;
}

/*
 * Convert a raw string to a base-64 string
 */
function rstr2b64(input)
{
  try { b64pad } catch(e) { b64pad=''; }
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var output = "";
  var len = input.length;
  for(var i = 0; i < len; i += 3)
  {
    var triplet = (input.charCodeAt(i) << 16)
                | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
                | (i + 2 < len ? input.charCodeAt(i+2)      : 0);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > input.length * 8) output += b64pad;
      else output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
    }
  }
  return output;
}

/*
 * Convert a raw string to an arbitrary string encoding
 */
function rstr2any(input, encoding)
{
  var divisor = encoding.length;
  var remainders = Array();
  var i, q, x, quotient;

  /* Convert to an array of 16-bit big-endian values, forming the dividend */
  var dividend = Array(Math.ceil(input.length / 2));
  for(i = 0; i < dividend.length; i++)
  {
    dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
  }

  /*
   * Repeatedly perform a long division. The binary array forms the dividend,
   * the length of the encoding is the divisor. Once computed, the quotient
   * forms the dividend for the next step. We stop when the dividend is zero.
   * All remainders are stored for later use.
   */
  while(dividend.length > 0)
  {
    quotient = Array();
    x = 0;
    for(i = 0; i < dividend.length; i++)
    {
      x = (x << 16) + dividend[i];
      q = Math.floor(x / divisor);
      x -= q * divisor;
      if(quotient.length > 0 || q > 0)
        quotient[quotient.length] = q;
    }
    remainders[remainders.length] = x;
    dividend = quotient;
  }

  /* Convert the remainders to the output string */
  var output = "";
  for(i = remainders.length - 1; i >= 0; i--)
    output += encoding.charAt(remainders[i]);

  /* Append leading zero equivalents */
  var full_length = Math.ceil(input.length * 8 /
                                    (Math.log(encoding.length) / Math.log(2)))
  for(i = output.length; i < full_length; i++)
    output = encoding[0] + output;

  return output;
}

/*
 * Encode a string as utf-8.
 * For efficiency, this assumes the input is valid utf-16.
 */
function str2rstr_utf8(input)
{
  var output = "";
  var i = -1;
  var x, y;

  while(++i < input.length)
  {
    /* Decode utf-16 surrogate pairs */
    x = input.charCodeAt(i);
    y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
    if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF)
    {
      x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
      i++;
    }

    /* Encode output as utf-8 */
    if(x <= 0x7F)
      output += String.fromCharCode(x);
    else if(x <= 0x7FF)
      output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0xFFFF)
      output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
    else if(x <= 0x1FFFFF)
      output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                                    0x80 | ((x >>> 12) & 0x3F),
                                    0x80 | ((x >>> 6 ) & 0x3F),
                                    0x80 | ( x         & 0x3F));
  }
  return output;
}

/*
 * Encode a string as utf-16
 */
function str2rstr_utf16le(input)
{
  var output = "";
  for(var i = 0; i < input.length; i++)
    output += String.fromCharCode( input.charCodeAt(i)        & 0xFF,
                                  (input.charCodeAt(i) >>> 8) & 0xFF);
  return output;
}

function str2rstr_utf16be(input)
{
  var output = "";
  for(var i = 0; i < input.length; i++)
    output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                                   input.charCodeAt(i)        & 0xFF);
  return output;
}

/*
 * Convert a raw string to an array of big-endian words
 * Characters >255 have their high-byte silently ignored.
 */
function rstr2binb(input)
{
  var output = Array(input.length >> 2);
  for(var i = 0; i < output.length; i++)
    output[i] = 0;
  for(var i = 0; i < input.length * 8; i += 8)
    output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
  return output;
}

/*
 * Convert an array of big-endian words to a string
 */
function binb2rstr(input)
{
  var output = "";
  for(var i = 0; i < input.length * 32; i += 8)
    output += String.fromCharCode((input[i>>5] >>> (24 - i % 32)) & 0xFF);
  return output;
}

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function binb_sha1(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  var w = Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;

    for(var j = 0; j < 80; j++)
    {
      if(j < 16) w[j] = x[i + j];
      else w[j] = bit_rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
      var t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)),
                       safe_add(safe_add(e, w[j]), sha1_kt(j)));
      e = d;
      d = c;
      c = bit_rol(b, 30);
      b = a;
      a = t;
    }

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return Array(a, b, c, d, e);

}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d)
{
  if(t < 20) return (b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
         (t < 60) ? -1894007588 : -899497514;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}
/**
 * OAuth JavaScript library
 * Taken from http://oauth.googlecode.com/
 *
 * Copyright 2008 Netflix, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* Here's some JavaScript software for implementing OAuth.

   This isn't as useful as you might hope.  OAuth is based around
   allowing tools and websites to talk to each other.  However,
   JavaScript running in web browsers is hampered by security
   restrictions that prevent code running on one website from
   accessing data stored or served on another.

   Before you start hacking, make sure you understand the limitations
   posed by cross-domain XMLHttpRequest.

   On the bright side, some platforms use JavaScript as their
   language, but enable the programmer to access other web sites.
   Examples include Google Gadgets, and Microsoft Vista Sidebar.
   For those platforms, this library should come in handy.
*/

// The HMAC-SHA1 signature method calls b64_hmac_sha1, defined by
// http://pajhome.org.uk/crypt/md5/sha1.js

/* An OAuth message is represented as an object like this:
   {method: "GET", action: "http://server.com/path", parameters: ...}

   The parameters may be either a map {name: value, name2: value2}
   or an Array of name-value pairs [[name, value], [name2, value2]].
   The latter representation is more powerful: it supports parameters
   in a specific sequence, or several parameters with the same name;
   for example [["a", 1], ["b", 2], ["a", 3]].

   Parameter names and values are NOT percent-encoded in an object.
   They must be encoded before transmission and decoded after reception.
   For example, this message object:
   {method: "GET", action: "http://server/path", parameters: {p: "x y"}}
   ... can be transmitted as an HTTP request that begins:
   GET /path?p=x%20y HTTP/1.0
   (This isn't a valid OAuth request, since it lacks a signature etc.)
   Note that the object "x y" is transmitted as x%20y.  To encode
   parameters, you can call OAuth.addToURL, OAuth.formEncode or
   OAuth.getAuthorization.

   This message object model harmonizes with the browser object model for
   input elements of an form, whose value property isn't percent encoded.
   The browser encodes each value before transmitting it. For example,
   see consumer.setInputs in example/consumer.js.
 */

/* This script needs to know what time it is. By default, it uses the local
   clock (new Date), which is apt to be inaccurate in browsers. To do
   better, you can load this script from a URL whose query string contains
   an oauth_timestamp parameter, whose value is a current Unix timestamp.
   For example, when generating the enclosing document using PHP:

   <script src="oauth.js?oauth_timestamp=<?=time()?>" ...

   Another option is to call OAuth.correctTimestamp with a Unix timestamp.
 */

var OAuth; if (OAuth == null) OAuth = {};

OAuth.setProperties = function setProperties(into, from) {
    if (into != null && from != null) {
        for (var key in from) {
            into[key] = from[key];
        }
    }
    return into;
}

OAuth.setProperties(OAuth, // utility functions
{
    percentEncode: function percentEncode(s) {
        if (s == null) {
            return "";
        }
        if (s instanceof Array) {
            var e = "";
            for (var i = 0; i < s.length; ++s) {
                if (e != "") e += '&';
                e += OAuth.percentEncode(s[i]);
            }
            return e;
        }
        s = encodeURIComponent(s);
        // Now replace the values which encodeURIComponent doesn't do
        // encodeURIComponent ignores: - _ . ! ~ * ' ( )
        // OAuth dictates the only ones you can ignore are: - _ . ~
        // Source: http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Functions:encodeURIComponent
        s = s.replace(/\!/g, "%21");
        s = s.replace(/\*/g, "%2A");
        s = s.replace(/\'/g, "%27");
        s = s.replace(/\(/g, "%28");
        s = s.replace(/\)/g, "%29");
        return s;
    }
,
    decodePercent: function decodePercent(s) {
        if (s != null) {
            // Handle application/x-www-form-urlencoded, which is defined by
            // http://www.w3.org/TR/html4/interact/forms.html#h-17.13.4.1
            s = s.replace(/\+/g, " ");
        }
        return decodeURIComponent(s);
    }
,
    /** Convert the given parameters to an Array of name-value pairs. */
    getParameterList: function getParameterList(parameters) {
        if (parameters == null) {
            return [];
        }
        if (typeof parameters != "object") {
            return OAuth.decodeForm(parameters + "");
        }
        if (parameters instanceof Array) {
            return parameters;
        }
        var list = [];
        for (var p in parameters) {
            list.push([p, parameters[p]]);
        }
        return list;
    }
,
    /** Convert the given parameters to a map from name to value. */
    getParameterMap: function getParameterMap(parameters) {
        if (parameters == null) {
            return {};
        }
        if (typeof parameters != "object") {
            return OAuth.getParameterMap(OAuth.decodeForm(parameters + ""));
        }
        if (parameters instanceof Array) {
            var map = {};
            for (var p = 0; p < parameters.length; ++p) {
                var key = parameters[p][0];
                if (map[key] === undefined) { // first value wins
                    map[key] = parameters[p][1];
                }
            }
            return map;
        }
        return parameters;
    }
,
    getParameter: function getParameter(parameters, name) {
        if (parameters instanceof Array) {
            for (var p = 0; p < parameters.length; ++p) {
                if (parameters[p][0] == name) {
                    return parameters[p][1]; // first value wins
                }
            }
        } else {
            return OAuth.getParameterMap(parameters)[name];
        }
        return null;
    }
,
    formEncode: function formEncode(parameters) {
        var form = "";
        var list = OAuth.getParameterList(parameters);
        for (var p = 0; p < list.length; ++p) {
            var value = list[p][1];
            if (value == null) value = "";
            if (form != "") form += '&';
            form += OAuth.percentEncode(list[p][0])
              +'='+ OAuth.percentEncode(value);
        }
        return form;
    }
,
    decodeForm: function decodeForm(form) {
        var list = [];
        var nvps = form.split('&');
        for (var n = 0; n < nvps.length; ++n) {
            var nvp = nvps[n];
            if (nvp == "") {
                continue;
            }
            var equals = nvp.indexOf('=');
            var name;
            var value;
            if (equals < 0) {
                name = OAuth.decodePercent(nvp);
                value = null;
            } else {
                name = OAuth.decodePercent(nvp.substring(0, equals));
                value = OAuth.decodePercent(nvp.substring(equals + 1));
            }
            list.push([name, value]);
        }
        return list;
    }
,
    setParameter: function setParameter(message, name, value) {
        var parameters = message.parameters;
        if (parameters instanceof Array) {
            for (var p = 0; p < parameters.length; ++p) {
                if (parameters[p][0] == name) {
                    if (value === undefined) {
                        parameters.splice(p, 1);
                    } else {
                        parameters[p][1] = value;
                        value = undefined;
                    }
                }
            }
            if (value !== undefined) {
                parameters.push([name, value]);
            }
        } else {
            parameters = OAuth.getParameterMap(parameters);
            parameters[name] = value;
            message.parameters = parameters;
        }
    }
,
    setParameters: function setParameters(message, parameters) {
        var list = OAuth.getParameterList(parameters);
        for (var i = 0; i < list.length; ++i) {
            OAuth.setParameter(message, list[i][0], list[i][1]);
        }
    }
,
    /** Fill in parameters to help construct a request message.
        This function doesn't fill in every parameter.
        The accessor object should be like:
        {consumerKey:'foo', consumerSecret:'bar', accessorSecret:'nurn', token:'krelm', tokenSecret:'blah'}
        The accessorSecret property is optional.
     */
    completeRequest: function completeRequest(message, accessor) {
        if (message.method == null) {
            message.method = "GET";
        }
        var map = OAuth.getParameterMap(message.parameters);
        if (map.oauth_consumer_key == null) {
            OAuth.setParameter(message, "oauth_consumer_key", accessor.consumerKey || "");
        }
        if (map.oauth_token == null && accessor.token != null) {
            OAuth.setParameter(message, "oauth_token", accessor.token);
        }
        if (map.oauth_version == null) {
            OAuth.setParameter(message, "oauth_version", "1.0");
        }
        if (map.oauth_timestamp == null) {
            OAuth.setParameter(message, "oauth_timestamp", OAuth.timestamp());
        }
        if (map.oauth_nonce == null) {
            OAuth.setParameter(message, "oauth_nonce", OAuth.nonce(6));
        }
        OAuth.SignatureMethod.sign(message, accessor);
    }
,
    setTimestampAndNonce: function setTimestampAndNonce(message) {
        OAuth.setParameter(message, "oauth_timestamp", OAuth.timestamp());
        OAuth.setParameter(message, "oauth_nonce", OAuth.nonce(6));
    }
,
    addToURL: function addToURL(url, parameters) {
        newURL = url;
        if (parameters != null) {
            var toAdd = OAuth.formEncode(parameters);
            if (toAdd.length > 0) {
                var q = url.indexOf('?');
                if (q < 0) newURL += '?';
                else       newURL += '&';
                newURL += toAdd;
            }
        }
        return newURL;
    }
,
    /** Construct the value of the Authorization header for an HTTP request. */
    getAuthorizationHeader: function getAuthorizationHeader(realm, parameters) {
        var header = 'OAuth realm="' + OAuth.percentEncode(realm) + '"';
        var list = OAuth.getParameterList(parameters);
        for (var p = 0; p < list.length; ++p) {
            var parameter = list[p];
            var name = parameter[0];
            if (name.indexOf("oauth_") == 0) {
                header += ',' + OAuth.percentEncode(name) + '="' + OAuth.percentEncode(parameter[1]) + '"';
            }
        }
        return header;
    }
,
    /** Correct the time using a parameter from the URL from which the last script was loaded. */
    correctTimestampFromSrc: function correctTimestampFromSrc(parameterName) {
        parameterName = parameterName || "oauth_timestamp";
        var scripts = document.getElementsByTagName('script');
        if (scripts == null || !scripts.length) return;
        var src = scripts[scripts.length-1].src;
        if (!src) return;
        var q = src.indexOf("?");
        if (q < 0) return;
        parameters = OAuth.getParameterMap(OAuth.decodeForm(src.substring(q+1)));
        var t = parameters[parameterName];
        if (t == null) return;
        OAuth.correctTimestamp(t);
    }
,
    /** Generate timestamps starting with the given value. */
    correctTimestamp: function correctTimestamp(timestamp) {
        OAuth.timeCorrectionMsec = (timestamp * 1000) - (new Date()).getTime();
    }
,
    /** The difference between the correct time and my clock. */
    timeCorrectionMsec: 0
,
    timestamp: function timestamp() {
        var t = (new Date()).getTime() + OAuth.timeCorrectionMsec;
        return Math.floor(t / 1000);
    }
,
    nonce: function nonce(length) {
        var chars = OAuth.nonce.CHARS;
        var result = "";
        for (var i = 0; i < length; ++i) {
            var rnum = Math.floor(Math.random() * chars.length);
            result += chars.substring(rnum, rnum+1);
        }
        return result;
    }
});

OAuth.nonce.CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";

/** Define a constructor function,
    without causing trouble to anyone who was using it as a namespace.
    That is, if parent[name] already existed and had properties,
    copy those properties into the new constructor.
 */
OAuth.declareClass = function declareClass(parent, name, newConstructor) {
    var previous = parent[name];
    parent[name] = newConstructor;
    if (newConstructor != null && previous != null) {
        for (var key in previous) {
            if (key != "prototype") {
                newConstructor[key] = previous[key];
            }
        }
    }
    return newConstructor;
}

/** An abstract algorithm for signing messages. */
OAuth.declareClass(OAuth, "SignatureMethod", function OAuthSignatureMethod(){});

OAuth.setProperties(OAuth.SignatureMethod.prototype, // instance members
{
    /** Add a signature to the message. */
    sign: function sign(message) {
        var baseString = OAuth.SignatureMethod.getBaseString(message);
        var signature = this.getSignature(baseString);
        OAuth.setParameter(message, "oauth_signature", signature);
        return signature; // just in case someone's interested
    }
,
    /** Set the key string for signing. */
    initialize: function initialize(name, accessor) {
        var consumerSecret;
        if (accessor.accessorSecret != null
            && name.length > 9
            && name.substring(name.length-9) == "-Accessor")
        {
            consumerSecret = accessor.accessorSecret;
        } else {
            consumerSecret = accessor.consumerSecret;
        }
        this.key = OAuth.percentEncode(consumerSecret)
             +"&"+ OAuth.percentEncode(accessor.tokenSecret);
    }
});

/* SignatureMethod expects an accessor object to be like this:
   {tokenSecret: "lakjsdflkj...", consumerSecret: "QOUEWRI..", accessorSecret: "xcmvzc..."}
   The accessorSecret property is optional.
 */
// Class members:
OAuth.setProperties(OAuth.SignatureMethod, // class members
{
    sign: function sign(message, accessor) {
        var name = OAuth.getParameterMap(message.parameters).oauth_signature_method;
        if (name == null || name == "") {
            name = "HMAC-SHA1";
            OAuth.setParameter(message, "oauth_signature_method", name);
        }
        OAuth.SignatureMethod.newMethod(name, accessor).sign(message);
    }
,
    /** Instantiate a SignatureMethod for the given method name. */
    newMethod: function newMethod(name, accessor) {
        var impl = OAuth.SignatureMethod.REGISTERED[name];
        if (impl != null) {
            var method = new impl();
            method.initialize(name, accessor);
            return method;
        }
        var err = new Error("signature_method_rejected");
        var acceptable = "";
        for (var r in OAuth.SignatureMethod.REGISTERED) {
            if (acceptable != "") acceptable += '&';
            acceptable += OAuth.percentEncode(r);
        }
        err.oauth_acceptable_signature_methods = acceptable;
        throw err;
    }
,
    /** A map from signature method name to constructor. */
    REGISTERED : {}
,
    /** Subsequently, the given constructor will be used for the named methods.
        The constructor will be called with no parameters.
        The resulting object should usually implement getSignature(baseString).
        You can easily define such a constructor by calling makeSubclass, below.
     */
    registerMethodClass: function registerMethodClass(names, classConstructor) {
        for (var n = 0; n < names.length; ++n) {
            OAuth.SignatureMethod.REGISTERED[names[n]] = classConstructor;
        }
    }
,
    /** Create a subclass of OAuth.SignatureMethod, with the given getSignature function. */
    makeSubclass: function makeSubclass(getSignatureFunction) {
        var superClass = OAuth.SignatureMethod;
        var subClass = function() {
            superClass.call(this);
        };
        subClass.prototype = new superClass();
        // Delete instance variables from prototype:
        // delete subclass.prototype... There aren't any.
        subClass.prototype.getSignature = getSignatureFunction;
        subClass.prototype.constructor = subClass;
        return subClass;
    }
,
    getBaseString: function getBaseString(message) {
        var URL = message.action;
        var q = URL.indexOf('?');
        var parameters;
        if (q < 0) {
            parameters = message.parameters;
        } else {
            // Combine the URL query string with the other parameters:
            parameters = OAuth.decodeForm(URL.substring(q + 1));
            var toAdd = OAuth.getParameterList(message.parameters);
            for (var a = 0; a < toAdd.length; ++a) {
                parameters.push(toAdd[a]);
            }
        }
        return OAuth.percentEncode(message.method.toUpperCase())
         +'&'+ OAuth.percentEncode(OAuth.SignatureMethod.normalizeUrl(URL))
         +'&'+ OAuth.percentEncode(OAuth.SignatureMethod.normalizeParameters(parameters));
    }
,
    normalizeUrl: function normalizeUrl(url) {
        var uri = OAuth.SignatureMethod.parseUri(url);
        var scheme = uri.protocol.toLowerCase();
        var authority = uri.authority.toLowerCase();
        var dropPort = (scheme == "http" && uri.port == 80)
                    || (scheme == "https" && uri.port == 443);
        if (dropPort) {
            // find the last : in the authority
            var index = authority.lastIndexOf(":");
            if (index >= 0) {
                authority = authority.substring(0, index);
            }
        }
        var path = uri.path;
        if (!path) {
            path = "/"; // conforms to RFC 2616 section 3.2.2
        }
        // we know that there is no query and no fragment here.
        return scheme + "://" + authority + path;
    }
,
    parseUri: function parseUri (str) {
        /* This function was adapted from parseUri 1.2.1
           http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
         */
        var o = {key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
                 parser: {strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/ }};
        var m = o.parser.strict.exec(str);
        var uri = {};
        var i = 14;
        while (i--) uri[o.key[i]] = m[i] || "";
        return uri;
    }
,
    normalizeParameters: function normalizeParameters(parameters) {
        if (parameters == null) {
            return "";
        }
        var list = OAuth.getParameterList(parameters);
        var sortable = [];
        for (var p = 0; p < list.length; ++p) {
            var nvp = list[p];
            if (nvp[0] != "oauth_signature") {
                sortable.push([ OAuth.percentEncode(nvp[0])
                              + " " // because it comes before any character that can appear in a percentEncoded string.
                              + OAuth.percentEncode(nvp[1])
                              , nvp]);
            }
        }
        sortable.sort(function(a,b) {
                          if (a[0] < b[0]) return  -1;
                          if (a[0] > b[0]) return 1;
                          return 0;
                      });
        var sorted = [];
        for (var s = 0; s < sortable.length; ++s) {
            sorted.push(sortable[s][1]);
        }
        return OAuth.formEncode(sorted);
    }
});

OAuth.SignatureMethod.registerMethodClass(["PLAINTEXT", "PLAINTEXT-Accessor"],
    OAuth.SignatureMethod.makeSubclass(
        function getSignature(baseString) {
            return this.key;
        }
    ));

OAuth.SignatureMethod.registerMethodClass(["HMAC-SHA1", "HMAC-SHA1-Accessor"],
    OAuth.SignatureMethod.makeSubclass(
        function getSignature(baseString) {
            b64pad = '=';
            var signature = b64_hmac_sha1(this.key, baseString);
            return signature;
        }
    ));

OAuth.correctTimestampFromSrc();
/*jslint 
bitwise: false,
browser: true,
nomen: false,
debug: true,
eqeqeq: false,
forin: true,
laxbreak: true,
plusplus: false,
newcap: false,
undef: false,
white: false,
onevar: false 
 */
var sc;
 
/*
	We're more lax with JSLint here because this is almost all not our code
*/

/**
 * Licence
 * As long as you leave the copyright notice of the original script, or link
 * back to this website, you can use any of the content published on this
 * website free of charge for any use: commercial or noncommercial.
 * http://www.webtoolkit.info/licence.html
 */


/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/

sc.helpers.Base64 = {

	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = sc.helpers.Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = sc.helpers.Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = 0, c1 = 0, c2 = 0, c3 = 0;

		while ( i < utftext.length ) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}

};



/**
*
*  Javascript crc32
*  http://www.webtoolkit.info/
*
**/
 
sc.helpers.crc32 = function (str) {
 
	function Utf8Encode(string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	}
 
	str = Utf8Encode(str);
 
	var table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";
 
	if (typeof(crc) == "undefined") { crc = 0; }
	var x = 0;
	var y = 0;
 
	crc = crc ^ (-1);
	for( var i = 0, iTop = str.length; i < iTop; i++ ) {
		y = ( crc ^ str.charCodeAt( i ) ) & 0xFF;
		x = "0x" + table.substr( y * 9, 8 );
		crc = ( crc >>> 8 ) ^ x;
	}
 
	return crc ^ (-1);
 
};


/**
*
*  MD5 (Message-Digest Algorithm)
*  http://www.webtoolkit.info/
*
**/
 
sc.helpers.MD5 = function (string) {
 
	function RotateLeft(lValue, iShiftBits) {
		return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
	}
 
	function AddUnsigned(lX,lY) {
		var lX4,lY4,lX8,lY8,lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
		if (lX4 & lY4) {
			return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		}
		if (lX4 | lY4) {
			if (lResult & 0x40000000) {
				return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			} else {
				return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
			}
		} else {
			return (lResult ^ lX8 ^ lY8);
		}
 	}
 
 	function F(x,y,z) { return (x & y) | ((~x) & z); }
 	function G(x,y,z) { return (x & z) | (y & (~z)); }
 	function H(x,y,z) { return (x ^ y ^ z); }
	function I(x,y,z) { return (y ^ (x | (~z))); }
 
	function FF(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	}
 
	function GG(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	}
 
	function HH(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	}
 
	function II(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	}
 
	function ConvertToWordArray(string) {
		var lWordCount;
		var lMessageLength = string.length;
		var lNumberOfWords_temp1=lMessageLength + 8;
		var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
		var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
		var lWordArray=Array(lNumberOfWords-1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while ( lByteCount < lMessageLength ) {
			lWordCount = (lByteCount-(lByteCount % 4))/4;
			lBytePosition = (lByteCount % 4)*8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount-(lByteCount % 4))/4;
		lBytePosition = (lByteCount % 4)*8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
		lWordArray[lNumberOfWords-2] = lMessageLength<<3;
		lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
		return lWordArray;
	}
 
	function WordToHex(lValue) {
		var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
		for (lCount = 0;lCount<=3;lCount++) {
			lByte = (lValue>>>(lCount*8)) & 255;
			WordToHexValue_temp = "0" + lByte.toString(16);
			WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
		}
		return WordToHexValue;
	}
 
	function Utf8Encode(string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	}
 
	var x=Array();
	var k,AA,BB,CC,DD,a,b,c,d;
	var S11=7, S12=12, S13=17, S14=22;
	var S21=5, S22=9 , S23=14, S24=20;
	var S31=4, S32=11, S33=16, S34=23;
	var S41=6, S42=10, S43=15, S44=21;
 
	string = Utf8Encode(string);
 
	x = ConvertToWordArray(string);
 
	a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
 
	for (k=0;k<x.length;k+=16) {
		AA=a; BB=b; CC=c; DD=d;
		a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
		d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
		c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
		b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
		a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
		d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
		c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
		b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
		a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
		d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
		c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
		b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
		a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
		d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
		c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
		b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
		a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
		d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
		c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
		b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
		a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
		d=GG(d,a,b,c,x[k+10],S22,0x2441453);
		c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
		b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
		a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
		d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
		c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
		b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
		a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
		d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
		c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
		b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
		a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
		d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
		c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
		b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
		a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
		d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
		c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
		b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
		a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
		d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
		c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
		b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
		a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
		d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
		c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
		b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
		a=II(a,b,c,d,x[k+0], S41,0xF4292244);
		d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
		c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
		b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
		a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
		d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
		c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
		b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
		a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
		d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
		c=II(c,d,a,b,x[k+6], S43,0xA3014314);
		b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
		a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
		d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
		c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
		b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
		a=AddUnsigned(a,AA);
		b=AddUnsigned(b,BB);
		c=AddUnsigned(c,CC);
		d=AddUnsigned(d,DD);
	}
 
	var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
 
	return temp.toLowerCase();
};

/**
*
*  Secure Hash Algorithm (SHA1)
*  http://www.webtoolkit.info/
*
**/
 
sc.helpers.SHA1 = function (msg) {
 
	function rotate_left(n,s) {
		var t4 = ( n<<s ) | (n>>>(32-s));
		return t4;
	}
 
	function lsb_hex(val) {
		var str="";
		var i;
		var vh;
		var vl;
 
		for( i=0; i<=6; i+=2 ) {
			vh = (val>>>(i*4+4))&0x0f;
			vl = (val>>>(i*4))&0x0f;
			str += vh.toString(16) + vl.toString(16);
		}
		return str;
	}
 
	function cvt_hex(val) {
		var str="";
		var i;
		var v;
 
		for( i=7; i>=0; i-- ) {
			v = (val>>>(i*4))&0x0f;
			str += v.toString(16);
		}
		return str;
	}
 
 
	function Utf8Encode(string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	}
 
	var blockstart;
	var i, j;
	var W = new Array(80);
	var H0 = 0x67452301;
	var H1 = 0xEFCDAB89;
	var H2 = 0x98BADCFE;
	var H3 = 0x10325476;
	var H4 = 0xC3D2E1F0;
	var A, B, C, D, E;
	var temp;
 
	msg = Utf8Encode(msg);
 
	var msg_len = msg.length;
 
	var word_array = [];
	for( i=0; i<msg_len-3; i+=4 ) {
		j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
		msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
		word_array.push( j );
	}
 
	switch( msg_len % 4 ) {
		case 0:
			i = 0x080000000;
		break;
		case 1:
			i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
		break;
 
		case 2:
			i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
		break;
 
		case 3:
			i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8	| 0x80;
		break;
	}
 
	word_array.push( i );
 
	while( (word_array.length % 16) != 14 ) {word_array.push( 0 );}
 
	word_array.push( msg_len>>>29 );
	word_array.push( (msg_len<<3)&0x0ffffffff );
 
 
	for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {
 
		for( i=0; i<16; i++ ) {W[i] = word_array[blockstart+i];}
		for( i=16; i<=79; i++ ) {W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);}
 
		A = H0;
		B = H1;
		C = H2;
		D = H3;
		E = H4;
 
		for( i= 0; i<=19; i++ ) {
			temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B,30);
			B = A;
			A = temp;
		}
 
		for( i=20; i<=39; i++ ) {
			temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B,30);
			B = A;
			A = temp;
		}
 
		for( i=40; i<=59; i++ ) {
			temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B,30);
			B = A;
			A = temp;
		}
 
		for( i=60; i<=79; i++ ) {
			temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B,30);
			B = A;
			A = temp;
		}
 
		H0 = (H0 + A) & 0x0ffffffff;
		H1 = (H1 + B) & 0x0ffffffff;
		H2 = (H2 + C) & 0x0ffffffff;
		H3 = (H3 + D) & 0x0ffffffff;
		H4 = (H4 + E) & 0x0ffffffff;
 
	}
 
	temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
 
	return temp.toLowerCase();
 
};



/**
*
*  Secure Hash Algorithm (SHA256)
*  http://www.webtoolkit.info/
*
*  Original code by Angel Marin, Paul Johnston.
*
**/
 
sc.helpers.SHA256 = function (s){
 
	var chrsz   = 8;
	var hexcase = 0;
 
	function safe_add (x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	}
 
	function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
	function R (X, n) { return ( X >>> n ); }
	function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
	function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
	function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
	function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
	function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
	function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
 
	function core_sha256 (m, l) {
		var K = [0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2];
		var HASH = [0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19];
		var W = [64];
		var a, b, c, d, e, f, g, h, i, j;
		var T1, T2;
 
		m[l >> 5] |= 0x80 << (24 - l % 32);
		m[((l + 64 >> 9) << 4) + 15] = l;
 
		for ( i = 0; i<m.length; i+=16 ) {
			a = HASH[0];
			b = HASH[1];
			c = HASH[2];
			d = HASH[3];
			e = HASH[4];
			f = HASH[5];
			g = HASH[6];
			h = HASH[7];
 
			for ( j = 0; j<64; j++) {
				if (j < 16) {W[j] = m[j + i];}
				else {W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);}
 
				T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
				T2 = safe_add(Sigma0256(a), Maj(a, b, c));
 
				h = g;
				g = f;
				f = e;
				e = safe_add(d, T1);
				d = c;
				c = b;
				b = a;
				a = safe_add(T1, T2);
			}
 
			HASH[0] = safe_add(a, HASH[0]);
			HASH[1] = safe_add(b, HASH[1]);
			HASH[2] = safe_add(c, HASH[2]);
			HASH[3] = safe_add(d, HASH[3]);
			HASH[4] = safe_add(e, HASH[4]);
			HASH[5] = safe_add(f, HASH[5]);
			HASH[6] = safe_add(g, HASH[6]);
			HASH[7] = safe_add(h, HASH[7]);
		}
		return HASH;
	}
 
	function str2binb (str) {
		var bin = Array();
		var mask = (1 << chrsz) - 1;
		for(var i = 0; i < str.length * chrsz; i += chrsz) {
			bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
		}
		return bin;
	}
 
	function Utf8Encode(string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	}
 
	function binb2hex (binarray) {
		var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
		var str = "";
		for(var i = 0; i < binarray.length * 4; i++) {
			str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
			hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
		}
		return str;
	}

	s = Utf8Encode(s);
	return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
 
};



/*
File: Math.uuid.js
Version: 1.3
Change History:
  v1.0 - first release
  v1.1 - less code and 2x performance boost (by minimizing calls to Math.random())
  v1.2 - Add support for generating non-standard uuids of arbitrary length
  v1.3 - Fixed IE7 bug (can't use []'s to access string chars.  Thanks, Brian R.)
  v1.4 - Changed method to be "Math.uuid". Added support for radix argument.  Use module pattern for better encapsulation.

Latest version:   http://www.broofa.com/Tools/Math.uuid.js
Information:      http://www.broofa.com/blog/?p=151
Contact:          robert@broofa.com
----
Copyright (c) 2008, Robert Kieffer
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
    * Neither the name of Robert Kieffer nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*
 * Generate a random uuid.
 *
 * USAGE: Math.uuid(length, radix)
 *   length - the desired number of characters
 *   radix  - the number of allowable values for each character.
 *
 * EXAMPLES:
 *   // No arguments  - returns RFC4122, version 4 ID
 *   >>> Math.uuid()
 *   "92329D39-6F5C-4520-ABFC-AAB64544E172"
 * 
 *   // One argument - returns ID of the specified length
 *   >>> Math.uuid(15)     // 15 character ID (default base=62)
 *   "VcydxgltxrVZSTV"
 *
 *   // Two arguments - returns ID of the specified length, and radix. (Radix must be <= 62)
 *   >>> Math.uuid(8, 2)  // 8 character ID (base=2)
 *   "01001010"
 *   >>> Math.uuid(8, 10) // 8 character ID (base=10)
 *   "47473046"
 *   >>> Math.uuid(8, 16) // 8 character ID (base=16)
 *   "098F4D35"
 */
sc.helpers.UUID = (function() {
  // Private array of chars to use
  var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''); 

  return function (len, radix) {
    var chars = CHARS, uuid = [], rnd = Math.random;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (var i = 0; i < len; i++) uuid[i] = chars[0 | rnd()*radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (var i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | rnd()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
        }
      }
    }

    return uuid.join('');
  };
})();

/**
 * Checks if the given value is an RFC 4122 UUID 
 */
sc.helpers.isUUID = function(val) {
	return val.match(/^[0-9A-Z]{8}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{12}$/);
};
/*jslint 
browser: true,
nomen: false,
debug: true,
forin: true,
undef: true,
white: false,
onevar: false 
 */
var sc, jQuery;
 
/*
	Helpers for fundamental javascript stuff
*/

/*
	Return a boolean value telling whether
	the first argument is a string.
*/
sc.helpers.isString = function(thing) {
	if (typeof thing === 'string') {return true;}
    if (typeof thing === 'object' && thing !== null) {
        var criterion = thing.constructor.toString().match(/string/i);
        return (criterion !== null);
    }
    return false;
};


sc.helpers.isNumber = function(chk) {
	return typeof chk === 'number';
};



/*
	http://www.breakingpar.com/bkp/home.nsf/0/87256B280015193F87256C720080D723
*/
sc.helpers.isArray = function(obj) {
	if (obj.constructor.toString().indexOf("Array") === -1) {
		return false;
	} else {
		return true;
	}
};

/*
	Returns a copy of the object using the _.extend() method
*/
sc.helpers.clone = function(oldObj) {
	return _.extend({}/* clone */, oldObj);
};

/**
 * @todo 
 */
sc.helpers.each = function(arr, f) {
	
};

/**
 * We use this to do a form of inheritance, where the child inherits
 * the methods and properties of the supertype
 * 
 * @link https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/Inheritance
 * 
 * @param {object} child the child type
 * @param {object} supertype the parent we inherit from 
 */
sc.helpers.extend = function(child, supertype)
{
   child.prototype.__proto__ = supertype.prototype;
};

/**
 * Designed to fill in default values for an options argument passed to a
 * function. Merges the provided defaults with the passed object, using items
 * from defaults if they don't exist in passed 
 * 
 * @param {object} defaults the default key/val pairs
 * @param {object} passed   the values provided to the calling method
 * @returns {object} a set of key/vals that have defaults filled-in
 */
sc.helpers.defaults = function(defaults, passed) {
	
	var args = defaults;
	
	/* override the defaults if necessary */
	for (var key in passed) {
		args[key] = passed[key];
	}
	
	return args;
};


/*jslint 
browser: true,
nomen: false,
debug: true,
forin: true,
undef: true,
white: false,
onevar: false 
 */
var sc;
 
/* A wrapper for JSON.parse() that correct Twitter issues and perform logging if JSON data could not be parsed
 * which will help to find out what is wrong
 * @param {String} text 
 */
sc.helpers.deJSON = function(json)
 {

	// Fix twitter data bug
	// var re = new RegExp("Couldn\\'t\\ find\\ Status\\ with\\ ID\\=[0-9]+\\,", "g");
	// json = json.replace(re, "");

	var done = false;
	try {
		var obj = JSON.parse(json);
		done = true;
	} finally {
		if (!done) {
			sc.helpers.dump("Could not parse JSON text " + json);
		}
	}

	return obj;
};

/**
 * really just a simple wrapper for JSON.stringify	
 * @param  any js construct
 */
sc.helpers.enJSON = function(jsobj) {
	return JSON.stringify(jsobj);
};


/*
 * Based on jQuery XML to JSON Plugin
 * 
 *	### jQuery XML to JSON Plugin v1.0 - 2008-07-01 ###
 * http://www.fyneworks.com/ - diego@fyneworks.com
 * Dual licensed under the MIT and GPL licenses:
 *	 http://www.opensource.org/licenses/mit-license.php
 *	 http://www.gnu.org/licenses/gpl.html
 ###
 Website: http://www.fyneworks.com/jquery/xml-to-json/
*/
/*
 # INSPIRED BY: http://www.terracoder.com/
		   AND: http://www.thomasfrank.se/xml_to_json.html
											AND: http://www.kawa.net/works/js/xml/objtree-e.html
*/
/*
 This simple script converts XML (document of code) into a JSON object. It is the combination of 2
 'xml to json' great parsers (see below) which allows for both 'simple' and 'extended' parsing modes.
*/
sc.helpers.xml2json = function(xml, extended) {
	if (!xml) return {};
	// quick fail
	//### PARSER LIBRARY
	// Core function
	function parseXML(node, simple) {
		if (!node) return null;
		var txt = '',
		obj = null,
		att = null;
		var nt = node.nodeType,
		nn = jsVar(node.localName || node.nodeName);
		var nv = node.text || node.nodeValue || '';
		/*DBG*/
		//if(window.console) console.log(['x2j',nn,nt,nv.length+' bytes']);
		if (node.childNodes) {
			if (node.childNodes.length > 0) {
				/*DBG*/
				//if(window.console) console.log(['x2j',nn,'CHILDREN',node.childNodes]);
				jQuery.each(node.childNodes,
				function(n, cn) {
					var cnt = cn.nodeType,
					cnn = jsVar(cn.localName || cn.nodeName);
					var cnv = cn.text || cn.nodeValue || '';
					/*DBG*/
					//if(window.console) console.log(['x2j',nn,'node>a',cnn,cnt,cnv]);
					if (cnt == 8) {
						/*DBG*/
						//if(window.console) console.log(['x2j',nn,'node>b',cnn,'COMMENT (ignore)']);
						return;
						// ignore comment node
					}
					else if (cnt == 3 || cnt == 4 || !cnn) {
						// ignore white-space in between tags
						if (cnv.match(/^\s+$/)) {
							/*DBG*/
							//if(window.console) console.log(['x2j',nn,'node>c',cnn,'WHITE-SPACE (ignore)']);
							return;
						};
						/*DBG*/
						//if(window.console) console.log(['x2j',nn,'node>d',cnn,'TEXT']);
						txt += cnv.replace(/^\s+/, '').replace(/\s+$/, '');
						// make sure we ditch trailing spaces from markup
					}
					else {
						/*DBG*/
						//if(window.console) console.log(['x2j',nn,'node>e',cnn,'OBJECT']);
						obj = obj || {};
						if (obj[cnn]) {
							/*DBG*/
							//if(window.console) console.log(['x2j',nn,'node>f',cnn,'ARRAY']);
							if (!obj[cnn].length) obj[cnn] = myArr(obj[cnn]);
							obj[cnn][obj[cnn].length] = parseXML(cn, true
							/* simple */
							);
							obj[cnn].length = obj[cnn].length;
						}
						else {
							/*DBG*/
							//if(window.console) console.log(['x2j',nn,'node>g',cnn,'dig deeper...']);
							obj[cnn] = parseXML(cn);
						};
					};
				});
			};
			//node.childNodes.length>0
		};
		//node.childNodes
		if (node.attributes) {
			if (node.attributes.length > 0) {
				/*DBG*/
				//if(window.console) console.log(['x2j',nn,'ATTRIBUTES',node.attributes])
				att = {};
				obj = obj || {};
				jQuery.each(node.attributes, function(a, at) {
					var atn = jsVar(at.name),
					atv = at.value;
					att[atn] = atv;
					if (obj[atn]) {
						/*DBG*/
						//if(window.console) console.log(['x2j',nn,'attr>',atn,'ARRAY']);
						if (!obj[atn].length) obj[atn] = myArr(obj[atn]);
						//[ obj[ atn ] ];
						obj[atn][obj[atn].length] = atv;
						obj[atn].length = obj[atn].length;
					}
					else {
						/*DBG*/
						//if(window.console) console.log(['x2j',nn,'attr>',atn,'TEXT']);
						obj[atn] = atv;
					};
				});
				//obj['attributes'] = att;
			};
			//node.attributes.length>0
		};
		//node.attributes
		if (obj) {
			obj = jQuery.extend((txt != '' ? new String(txt) : {}),
			/* {text:txt},*/
			obj || {}
			/*, att || {}*/
			);
			txt = (obj.text) ? (typeof(obj.text) == 'object' ? obj.text: [obj.text || '']).concat([txt]) : txt;
			if (txt) obj.text = txt;
			txt = '';
		};
		var out = obj || txt;
		//console.log([extended, simple, out]);
		if (extended) {
			if (txt) out = {};
			//new String(out);
			txt = out.text || txt || '';
			if (txt) out.text = txt;
			if (!simple) out = myArr(out);
		};
		return out;
	};
	// parseXML
	// Core Function End
	// Utility functions
	var jsVar = function(s) {
		return String(s || '').replace(/-/g, "_");
	};
	var isNum = function(s) {
		return (typeof s == "number") || String((s && typeof s == "string") ? s: '').test(/^((-)?([0-9]*)((\.{0,1})([0-9]+))?$)/);
	};
	var myArr = function(o) {
		if (!o.length) o = [o];
		o.length = o.length;
		// here is where you can attach additional functionality, such as searching and sorting...
		return o;
	};
	// Utility functions End
	//### PARSER LIBRARY END
	// Convert plain text to xml
	if (typeof xml == 'string') {xml = sc.helpers.createXMLFromString(xml);}

	// Quick fail if not xml (or if this is a node)
	if (!xml.nodeType) {return;}
	if (xml.nodeType == 3 || xml.nodeType == 4) {return xml.nodeValue;}

	// Find xml root node
	var root = (xml.nodeType == 9) ? xml.documentElement: xml;

	// Convert xml to json
	var out = parseXML(root, true
	/* simple */
	);

	// Clean-up memory
	xml = null;
	root = null;

	// Send output
	return out;
};


/*jslint 
browser: true,
nomen: false,
debug: true,
forin: true,
undef: true,
white: false,
onevar: false 
 */
var sc;
 

/**
 * Stub 
 * @platformstub
 */
sc.helpers.getCurrentLocation = function() {
	
};/*jslint 
bitwise: false,
browser: true,
newcap: false,
nomen: false,
debug: true,
forin: true,
plusplus: false,
undef: true,
white: false,
onevar: false 
 */
var sc;
 
/**
 * determines if a string contains the given screen name prefixed with a @
 * this is mainly used for determining if a message should be considered a 'mention'
 * @param {string} str  the string to check
 * @param {string} sn   the screen name to look for
 * @return {boolean} 
 */
sc.helpers.containsScreenName = function(str, sn) {
	
	var re = new RegExp('(?:\\s|\\b|^[[:alnum:]]|^)@('+sn+')(?:\\s|\\b|$)', 'gi');
	if ( re.test(str) ) {
		return true;
	}
	return false;
	
};

sc.helpers.extractScreenNames = function(str, tpl) {
	var re_uname = /(^|\s|\(\[|,|\.|\()@([a-zA-Z0-9_]+)([^a-zA-Z0-9_]|$)/gi;
	var usernames = [];
	var ms = [];
	while (ms = re_uname.exec(str))
	{
		
		/*
			sometimes we can end up with a null instead of a blank string,
			so we need to force the issue in javascript.
		*/
		for (var x=0; x<ms.length; x++) {
			if (!ms[x]) {
				ms[x] = '';
			}
		}
		
		if(ms[2] != ''){
			usernames.push(ms[2]);
		}
	}
	return usernames;
};

/**
 * find URLs within the given string 
 */
sc.helpers.extractURLs = function(str) {
	// var wwwlinks = /(^|\s)((https?|ftp)\:\/\/)?([a-z0-9+!*(),;?&=\$_.-]+(\:[a-z0-9+!*(),;?&=\$_.-]+)?@)?([✪a-z0-9-.]*)\.([a-z]{2,3})(\:[0-9]{2,5})?(\/([a-z0-9+\$_-]\.?)+)*\/?(\?[a-z+&\$_.-][a-z0-9;:@&%=+\/\$_.-]*)?(#[a-z_.-][a-z0-9+\$_.-]*)?(\s|$)/gi;
	var wwwlinks = /(^|\s|\(|:)(((http(s?):\/\/)|(www\.))([\w✪]+[^\s\)<]+))/gi;
		
	var ms = [];
	var URLs = [];
	while ( (ms = wwwlinks.exec(str)) !== null ) {
		for (var x=0; x<ms.length; x++) {
			if (!ms[x]) {
				ms[x] = '';
			}
		}
		var last = ms[7].charAt(ms[7].length - 1);
		if (last.search(/[\.,;\?]/) !== -1) { // if ends in common punctuation, strip
			ms[7] = ms[7].slice(0,-1);
		}
		URLs.push(ms[3]+ms[7]);
	}
	return URLs;
};

/**
 * given as string and a mapping object, replace multiple values in the string (or vice versa)
 * map should be of format
 * {
 * 	'searchforme':'replacewithme',
 * 	'searchforme2':'replacewithme2',
 * 	'searchforme3':'replacewithme3'
 * }
 * @param {string} str
 * @param {object} map
 * @return {string}
 */
sc.helpers.replaceMultiple = function(str, map) {
	for (var key in map) {
		str = str.replace(key, map[key]);
	}
	return str;
};


/**
 * This is a port of the CodeIgniter helper "autolink" to javascript.
 * It finds and links both web addresses and email addresses. It will ignore
 * links within HTML (as attributes or between tag pairs)
 * 
 * @param {string} str
 * @param {string} type  'email', 'url', or 'both' (default is 'both')
 * @param {boolean} extra_code  a string that will be inserted verbatim into <a> tag
 * @param {integer} maxlen  the maximum length the link description can be (the string inside the <a></a> tag)
 * @return {string}
 */
sc.helpers.autolink = function(str, type, extra_code, maxlen) {
	if (!type) {
		type = 'both';
	}

	var re_nohttpurl = /((^|\s)(www\.)?([a-zA-Z_\-]+\.)(com|net|org|uk)($|\s))/gi;

	var re_noemail = /(^|[\s\(:。])((http(s?):\/\/)|(www\.))([\w✪]+[^\s\)<]+)/gi;
	var re_nourl   = /(^|\s|\()([a-zA-Z0-9_\.\-\+]+)@([a-zA-Z0-9\-]+)\.([a-zA-Z0-9\-\.]*)([^\s\)<]+)/gi;
	
	var x, ms, period = '';

	if (type !== 'email')
	{	
		while ((ms = re_nohttpurl.exec(str))) { // look for URLs without a preceding "http://"
			/*
				sometimes we can end up with a null instead of a blank string,
				so we need to force the issue in javascript.
			*/
			for (x=0; x<ms.length; x++) {
				if (!ms[x]) {
					ms[x] = '';
				}
			}

			if (extra_code) {
				extra_code = ' '+extra_code;
			} else {
				extra_code = '';
			}
			
			var desc = ms[3]+ms[4]+ms[5];

			if (maxlen && maxlen > 0 && desc.length > maxlen) {
				desc = desc.substr(0, maxlen)+'...';
			}

			var newstr = ms[2]+'<a href="http://'+ms[3]+ms[4]+ms[5]+'"'+extra_code+'>'+desc+'</a>'+ms[6];
			sch.error(newstr);
			str = str.replace(ms[0], newstr);
		}
		
		
		while ((ms = re_noemail.exec(str))) {
			
			/*
				sometimes we can end up with a null instead of a blank string,
				so we need to force the issue in javascript.
			*/
			for (x=0; x<ms.length; x++) {
				if (!ms[x]) {
					ms[x] = '';
				}
			}

			if (extra_code) {
				extra_code = ' '+extra_code;
			} else {
				extra_code = '';
			}
			
			/*
				if the last character is one of . , ; ?, we strip it off and
				stick it on the end of newstr below as "period"
			*/
			var last = ms[6].charAt(ms[6].length - 1);
			if (last.search(/[\.,;\?]/) !== -1) {
				ms[6] = ms[6].slice(0,-1);
				period = last;
			}


			var desc = ms[5]+ms[6];

			if (maxlen && maxlen > 0 && desc.length > maxlen) {
				desc = desc.substr(0, maxlen)+'...';
			}
			
			
			var newstr = ms[1]+'<a href="http'+ms[4]+'://'+ms[5]+ms[6]+'"'+extra_code+'>'+desc+'</a>'+period;
			str = str.replace(ms[0], newstr);
		}
	}

	if (type !== 'url')
	{
		while ((ms = re_nourl.exec(str)))
		{
			period = '';
			if ( /\./.test(ms[5]) ) {
				period = '.';
				ms[5] = ms[5].slice(0, -1);
			}
			
			/*
				sometimes we can end up with a null instead of a blank string,
				so we need to force the issue in javascript.
			*/
			for (x=0; x<ms.length; x++) {
				if (!ms[x]) {
					ms[x] = '';
				}
			}
			str = str.replace(ms[0], ms[1]+'<a href="mailto:'+ms[2]+'@'+ms[3]+'.'+ms[4]+ms[5]+'">'+ms[2]+'@'+ms[3]+'.'+ms[4]+ms[5]+'</a>'+period);
		}
	}

	return str;


};

/**
 * turns twitter style username refs ('@username') into links
 * by default, the template used is <a href="http://twitter.com/#username#">@#username#<a/>
 * pass the second param to give it a custom template
 * 
 * @param {string} str
 * @param {string} tpl  default is '<a href="http://twitter.com/#username#">@#username#</a>'
 * @return {string}
 */
sc.helpers.autolinkTwitterScreenname = function(str, tpl) {
	if (!tpl) {
		tpl = '<a href="http://twitter.com/#username#">@#username#</a>';
	}
	
	var re_uname = /(^|\s|\(\[|,|\.|\()@([a-zA-Z0-9_]+)([^a-zA-Z0-9_]|$)/gi;
	
	var ms = [];
	while (ms = re_uname.exec(str))
	{
		
		/*
			sometimes we can end up with a null instead of a blank string,
			so we need to force the issue in javascript.
		*/
		for (var x=0; x<ms.length; x++) {
			if (!ms[x]) {
				ms[x] = '';
			}
		}
		
		var repl_tpl = tpl.replace(/#username#/gi, ms[2]);
		str = str.replace(ms[0], ms[1]+repl_tpl+ms[3]);

	}
	return str;
};



/**
 * turns twitter style hashtags ('#hashtag') into links
 * by default, the template used is <a href="http://search.twitter.com/search?q=#hashtag_enc#">##hashtag#<a/>
 * pass the second param to give it a custom template
 * 
 * @param {string} str
 * @param {string} tpl  default is '<a href="http://search.twitter.com/search?q=#hashtag_enc#">##hashtag#<a/>'
 * @return {string}
 */
sc.helpers.autolinkTwitterHashtag = function(str, tpl) {
	if (!tpl) {
		tpl = '<a href="http://search.twitter.com/search?q=#hashtag_enc#">##hashtag#</a>';
	}
	
	var re_hashtag = /(^|\s|\()#([a-zA-Z0-9\-_\.+:=]{1,}\w)([^a-zA-Z0-9\-_+]|$)/gi;
	
	var ms = [];
	while (ms = re_hashtag.exec(str))
	{
		
		/*
			sometimes we can end up with a null instead of a blank string,
			so we need to force the issue in javascript.
		*/
		for (var x=0; x<ms.length; x++) {
			if (!ms[x]) {
				ms[x] = '';
			}
		}
		
		var repl_tpl = tpl.replace(/#hashtag#/gi, ms[2]);
		repl_tpl = repl_tpl.replace(/#hashtag_enc#/gi, encodeURIComponent(ms[2]));
		str = str.replace(ms[0], ms[1]+repl_tpl+ms[3]);

	}
	return str;
};



/**
 * Applies autolink, autolinkTwitterScreenname, autolinkTwitterHashtag
 * 
 * @param {string} str
 * @param {oobject} opts
 * 
 * Opts structure:
 *  {
 *  	'autolink': {
 *  		'type'      :'both', (email, url, or both)
 *  		'extra_code':'',
 *  		'maxlen'    :20
 *  	},
 *  	'screenname': {
 *  		'tpl':'' // should contain macro '#username#'
 *  	},
 *  	'hashtag': {
 *  		'tpl':'' // should contain macros '#hashtag#' and '#hashtag_enc#'
 *  	}
 *  }
 */
sc.helpers.makeClickable = function(str, opts) {
	var autolink_type, autolink_extra_code, autolink_maxlen, screenname_tpl, hashtag_tpl;
	
	if (!opts) {
		opts = {};
	}
	
	if (opts.autolink) {
		var autolink_type       = opts.autolink.type || null;
		var autolink_extra_code = opts.autolink.extra_code || null;
		var autolink_maxlen     = opts.autolink.maxlen || null;
	}
	
	if (opts.screenname) {
		var screenname_tpl      = opts.screenname.tpl || null;
	}
	
	if (opts.hashtag) {
		var hashtag_tpl         = opts.hashtag.tpl || null;
	}
	
	str = sc.helpers.autolink(str, autolink_type, autolink_extra_code, autolink_maxlen);
	str = sc.helpers.autolinkTwitterScreenname(str, screenname_tpl);
	str = sc.helpers.autolinkTwitterHashtag(str, hashtag_tpl);
	return str;
};



/**
 * Simple html tag remover
 * @param {string} str
 * @return {string}
 */
sc.helpers.stripTags = function(str) {
	var re = /<[^>]*>/gim;
	str = str.replace(re, '');
	return str;
};


/**
 * Converts the following entities into regular chars: &lt; &gt; &quot; &apos;
 */
sc.helpers.fromHTMLSpecialChars = function(str) {
	str = str.replace(/&lt;/gi, '<');
	sc.helpers.dump(str);
	str = str.replace(/&gt;/gi, '>');
	sc.helpers.dump(str);
	str = str.replace(/&quot;/gi, '"');
	sc.helpers.dump(str);
	str = str.replace(/&apos;/gi, '\'');
	sc.helpers.dump(str);
	str = str.replace(/&amp;/gi, '&');
	sc.helpers.dump(str);
	return str;
};


sc.helpers.escape_html = function(string) {
	return sc.helpers.htmlspecialchars(string, 'ENT_QUOTES');
};


sc.helpers.htmlspecialchars = function(string, quote_style) {
    // http://kevin.vanzonneveld.net
    // +   original by: Mirek Slugen
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Nathan
    // +   bugfixed by: Arno
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: get_html_translation_table
    // *     example 1: htmlspecialchars("<a href='test'>Test</a>", 'ENT_QUOTES');
    // *     returns 1: '&lt;a href=&#039;test&#039;&gt;Test&lt;/a&gt;'

    var histogram = {}, symbol = '', tmp_str = '', i = 0;
    tmp_str = string.toString();

    if (false === (histogram = sc.helpers._get_html_translation_table('HTML_SPECIALCHARS', quote_style))) {
        return false;
    }

	// first, do &amp;
	tmp_str = tmp_str.split('&').join(histogram['&']);
	
	// then do the rest
    for (symbol in histogram) {
		if (symbol != '&') {
			entity = histogram[symbol];
	        tmp_str = tmp_str.split(symbol).join(entity);
		}
    }

    return tmp_str;
};



sc.helpers.htmlentities = function(string, quote_style) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: nobbler
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: get_html_translation_table
    // *     example 1: htmlentities('Kevin & van Zonneveld');
    // *     returns 1: 'Kevin &amp; van Zonneveld'
    // *     example 2: htmlentities("foo'bar","ENT_QUOTES");
    // *     returns 2: 'foo&#039;bar'
 
    var histogram = {}, symbol = '', tmp_str = '', entity = '';
    tmp_str = string.toString();
    
    if (false === (histogram = sc.helpers._get_html_translation_table('HTML_ENTITIES', quote_style))) {
        return false;
    }
    
    for (symbol in histogram) {
        entity = histogram[symbol];
        tmp_str = tmp_str.split(symbol).join(entity);
    }
    
    return tmp_str;
};

sc.helpers._get_html_translation_table = function(table, quote_style) {
    // http://kevin.vanzonneveld.net
    // +   original by: Philip Peterson
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: noname
    // +   bugfixed by: Alex
    // +   bugfixed by: Marco
    // +   bugfixed by: madipta
    // %          note: It has been decided that we're not going to add global
    // %          note: dependencies to php.js. Meaning the constants are not
    // %          note: real constants, but strings instead. integers are also supported if someone
    // %          note: chooses to create the constants themselves.
    // %          note: Table from http://www.the-art-of-web.com/html/character-codes/
    // *     example 1: get_html_translation_table('HTML_SPECIALCHARS');
    // *     returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}
    
    var entities = {}, histogram = {}, decimal = 0, symbol = '';
    var constMappingTable = {}, constMappingQuoteStyle = {};
    var useTable = {}, useQuoteStyle = {};
    
    useTable      = (table ? table.toUpperCase() : 'HTML_SPECIALCHARS');
    useQuoteStyle = (quote_style ? quote_style.toUpperCase() : 'ENT_COMPAT');
    
    // Translate arguments
    constMappingTable[0]      = 'HTML_SPECIALCHARS';
    constMappingTable[1]      = 'HTML_ENTITIES';
    constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
    constMappingQuoteStyle[2] = 'ENT_COMPAT';
    constMappingQuoteStyle[3] = 'ENT_QUOTES';
    
    // Map numbers to strings for compatibilty with PHP constants
    if (!isNaN(useTable)) {
        useTable = constMappingTable[useTable];
    }
    if (!isNaN(useQuoteStyle)) {
        useQuoteStyle = constMappingQuoteStyle[useQuoteStyle];
    }
 
    if (useTable === 'HTML_SPECIALCHARS') {
        // ascii decimals for better compatibility
        entities['38'] = '&amp;';
        if (useQuoteStyle !== 'ENT_NOQUOTES') {
            entities['34'] = '&quot;';
        }
        if (useQuoteStyle === 'ENT_QUOTES') {
            entities['39'] = '&#039;';
        }
        entities['60'] = '&lt;';
        entities['62'] = '&gt;';
    } else if (useTable === 'HTML_ENTITIES') {
        // ascii decimals for better compatibility
      entities['38']  = '&amp;';
        if (useQuoteStyle !== 'ENT_NOQUOTES') {
            entities['34'] = '&quot;';
        }
        if (useQuoteStyle === 'ENT_QUOTES') {
            entities['39'] = '&#039;';
        }
      entities['60']  = '&lt;';
      entities['62']  = '&gt;';
      entities['160'] = '&nbsp;';
      entities['161'] = '&iexcl;';
      entities['162'] = '&cent;';
      entities['163'] = '&pound;';
      entities['164'] = '&curren;';
      entities['165'] = '&yen;';
      entities['166'] = '&brvbar;';
      entities['167'] = '&sect;';
      entities['168'] = '&uml;';
      entities['169'] = '&copy;';
      entities['170'] = '&ordf;';
      entities['171'] = '&laquo;';
      entities['172'] = '&not;';
      entities['173'] = '&shy;';
      entities['174'] = '&reg;';
      entities['175'] = '&macr;';
      entities['176'] = '&deg;';
      entities['177'] = '&plusmn;';
      entities['178'] = '&sup2;';
      entities['179'] = '&sup3;';
      entities['180'] = '&acute;';
      entities['181'] = '&micro;';
      entities['182'] = '&para;';
      entities['183'] = '&middot;';
      entities['184'] = '&cedil;';
      entities['185'] = '&sup1;';
      entities['186'] = '&ordm;';
      entities['187'] = '&raquo;';
      entities['188'] = '&frac14;';
      entities['189'] = '&frac12;';
      entities['190'] = '&frac34;';
      entities['191'] = '&iquest;';
      entities['192'] = '&Agrave;';
      entities['193'] = '&Aacute;';
      entities['194'] = '&Acirc;';
      entities['195'] = '&Atilde;';
      entities['196'] = '&Auml;';
      entities['197'] = '&Aring;';
      entities['198'] = '&AElig;';
      entities['199'] = '&Ccedil;';
      entities['200'] = '&Egrave;';
      entities['201'] = '&Eacute;';
      entities['202'] = '&Ecirc;';
      entities['203'] = '&Euml;';
      entities['204'] = '&Igrave;';
      entities['205'] = '&Iacute;';
      entities['206'] = '&Icirc;';
      entities['207'] = '&Iuml;';
      entities['208'] = '&ETH;';
      entities['209'] = '&Ntilde;';
      entities['210'] = '&Ograve;';
      entities['211'] = '&Oacute;';
      entities['212'] = '&Ocirc;';
      entities['213'] = '&Otilde;';
      entities['214'] = '&Ouml;';
      entities['215'] = '&times;';
      entities['216'] = '&Oslash;';
      entities['217'] = '&Ugrave;';
      entities['218'] = '&Uacute;';
      entities['219'] = '&Ucirc;';
      entities['220'] = '&Uuml;';
      entities['221'] = '&Yacute;';
      entities['222'] = '&THORN;';
      entities['223'] = '&szlig;';
      entities['224'] = '&agrave;';
      entities['225'] = '&aacute;';
      entities['226'] = '&acirc;';
      entities['227'] = '&atilde;';
      entities['228'] = '&auml;';
      entities['229'] = '&aring;';
      entities['230'] = '&aelig;';
      entities['231'] = '&ccedil;';
      entities['232'] = '&egrave;';
      entities['233'] = '&eacute;';
      entities['234'] = '&ecirc;';
      entities['235'] = '&euml;';
      entities['236'] = '&igrave;';
      entities['237'] = '&iacute;';
      entities['238'] = '&icirc;';
      entities['239'] = '&iuml;';
      entities['240'] = '&eth;';
      entities['241'] = '&ntilde;';
      entities['242'] = '&ograve;';
      entities['243'] = '&oacute;';
      entities['244'] = '&ocirc;';
      entities['245'] = '&otilde;';
      entities['246'] = '&ouml;';
      entities['247'] = '&divide;';
      entities['248'] = '&oslash;';
      entities['249'] = '&ugrave;';
      entities['250'] = '&uacute;';
      entities['251'] = '&ucirc;';
      entities['252'] = '&uuml;';
      entities['253'] = '&yacute;';
      entities['254'] = '&thorn;';
      entities['255'] = '&yuml;';
    } else {
        throw Error("Table: "+useTable+' not supported');
    }
    
    // ascii decimals to real symbols
    for (decimal in entities) {
        symbol = String.fromCharCode(decimal);
        histogram[symbol] = entities[decimal];
    }
    
    return histogram;
};




/**
*
*  UTF-8 data encode / decode
*  http://www.webtoolkit.info/
*
**/
 
sc.helpers.Utf8 = {
 
	// public method for url encoding
	encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// public method for url decoding
	decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = 0, c1 = 0, c2 = 0, c3 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
 
};





/**
*
*  Javascript trim, ltrim, rtrim
*  http://www.webtoolkit.info/
*
**/
 
sc.helpers.trim = function (str, chars) {
	return sc.helpers.ltrim(sc.helpers.rtrim(str, chars), chars);
};
 
sc.helpers.ltrim = function (str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
};
 
sc.helpers.rtrim = function (str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
};


/**
 * @param {string} str the string in which we're converting linebreaks
 * @param {string} [breaktag] the tag used to break up lines. defaults to <br>
 * @returns {string} the string with linebreaks converted to breaktags
 */
sc.helpers.nl2br = function(str, breaktag) {
	
	breaktag = breaktag || '<br>';
	
	str = str.replace(/(\r\n|\n\r|\r|\n)/g, breaktag+'$1');
	return str;
};/*jslint 
browser: true,
nomen: false,
debug: true,
forin: true,
undef: true,
white: false,
onevar: false 
 */
var sc;
 
/**
 * These are system-oriented functions, mostly utilizing AIR apis
 * to interact with the OS
 * 
 * NOTE: to use all these helpers, you must additionally load a platform-specific definition file!
 */


var SPAZCORE_PLATFORM_AIR			= 'AIR';
var SPAZCORE_PLATFORM_WEBOS		= 'webOS';
var SPAZCORE_PLATFORM_TITANIUM	= 'Titanium';
var SPAZCORE_PLATFORM_UNKNOWN		= '__UNKNOWN';


var SPAZCORE_OS_WINDOWS		= 'Windows';
var SPAZCORE_OS_LINUX		= 'Linux';
var SPAZCORE_OS_MACOS		= 'MacOS';
var SPAZCORE_OS_UNKNOWN		= '__OS_UNKNOWN';


/**
 * error reporting levels 
 */
var SPAZCORE_DUMPLEVEL_DEBUG   = 4;
var SPAZCORE_DUMPLEVEL_NOTICE  = 3;
var SPAZCORE_DUMPLEVEL_WARNING = 2;
var SPAZCORE_DUMPLEVEL_ERROR   = 1;
var SPAZCORE_DUMPLEVEL_NONE    = 0; // this means "never ever dump anything!"





/**
* Returns a string identifier for the platform.
* 
* Right now these checks are really, really basic
* 
* @return {String} an identifier for the platform
*/
sc.helpers.getPlatform = function() {
	if (window.runtime) {
		return SPAZCORE_PLATFORM_AIR;
	}
	if (window.Mojo) {
		return SPAZCORE_PLATFORM_WEBOS;
	}
	if (window.Titanium) {
		return SPAZCORE_PLATFORM_TITANIUM;
	}
	return SPAZCORE_PLATFORM_UNKNOWN;
};

/**
* checks to see if current platform is the one passed in
* 
* use one of the defined constants, like SPAZCORE_PLATFORM_AIR
* 
* @param {String} str the platform you're checking for
* 
*/
sc.helpers.isPlatform = function(str) {
	var pform = sc.helpers.getPlatform();
	if ( pform.toLowerCase() === str.toLowerCase() ) {
		return true;
	} else {
		return false;
	}
};


sc.helpers.isAIR = function() {
	return sc.helpers.isPlatform(SPAZCORE_PLATFORM_AIR);
};

sc.helpers.iswebOS = function() {
	return sc.helpers.isPlatform(SPAZCORE_PLATFORM_WEBOS);
};

sc.helpers.isTitanium = function() {
	return sc.helpers.isPlatform(SPAZCORE_PLATFORM_TITANIUM);
};



/**
 * Helper to send a debug dump 
 */
sc.helpers.debug = function(obj) {
	sc.helpers.dump(obj, SPAZCORE_DUMPLEVEL_DEBUG);
};

/**
 * helper to send a notice dump 
 */
sc.helpers.note = function(obj) {
	sc.helpers.dump(obj, SPAZCORE_DUMPLEVEL_NOTICE);
};

/**
 * helper to send a warn dump 
 */
sc.helpers.warn = function(obj) {
	sc.helpers.dump(obj, SPAZCORE_DUMPLEVEL_WARNING);
};

/**
 * helper to send an error dump 
 */
sc.helpers.error = function(obj) {
	sc.helpers.dump(obj, SPAZCORE_DUMPLEVEL_ERROR);
};


/**
 * A simple logging function
 * @platformstub
 */
sc.helpers.dump = function(obj, level) {
	console.log(obj);
};

/**
 * Open a URL in the default system web browser
 * @platformstub
 */
sc.helpers.openInBrowser = function(url) {
	window.open(url);
};

/**
 * Gets the contents of a file
 * @platformstub
 */
sc.helpers.getFileContents = function(path) {
	// stub
};

/**
 * Saves the contents to a specified path. Serializes a passed object if 
 * serialize == true
 * @platformstub
 */
sc.helpers.setFileContents = function(path, content, serialize) {
	// stub
};


/**
 * Returns the current application version string
 * @platformstub
 */
sc.helpers.getAppVersion = function() {
	// stub
};


/**
 * Returns the user agent string for the app
 * @platformstub
 */
sc.helpers.getUserAgent = function() {
	// stub
};

/**
 * Sets the user agent string for the app
 * @platformstub
 */
sc.helpers.setUserAgent = function(uastring) {
	// stub
};

/**
 * Gets clipboard text
 * @platformstub
 */
sc.helpers.getClipboardText = function() {
	// stub
};

/**
 * Sets clipboard text
 * @platformstub
 */
sc.helpers.setClipboardText = function(text) {
	// stub
};


/**
 * Loads a value for a key from EncryptedLocalStore
 * @platformstub
 */
sc.helpers.getEncryptedValue = function(key) {
	// stub
};

/**
 * Sets a value in the EncryptedLocalStore of AIR
 * @platformstub
 */
sc.helpers.setEncryptedValue = function(key, val) {
	// stub
};


/**
 * Get the app storage directory
 * @TODO is there an equivalent for this on all platforms?
 * @platformstub
 */
sc.helpers.getAppStoreDir = function() {
	// stub
};

/**
 * Get the preferences file
 * @TODO this should be removed and we rely on the preferences lib 
 */
sc.helpers.getPreferencesFile = function(name, create) {
	// stub
};

/**
 * initializes a file at the given location. set overwrite to true
 * to clear out an existing file.
 * returns the air.File object or false
 * @platformstub
*/
sc.helpers.init_file = function(path, overwrite) {
	// stub
};


/**
* Returns a string identifier for the OS.
* 
* @return {String} an identifier for the OS.  See the SPAZCORE_OS_* variables
*/
sc.helpers.getOS = function() {
	// stub
	return SPAZCORE_OS_UNKNOWN;
};

/**
* checks to see if current platform is the one passed in. Use one of the defined constants, like SPAZCORE_OS_WINDOWS
* 
* @param {String} str the platform you're checking for
* 
*/
sc.helpers.isOS = function(str) {
	var type = sc.helpers.getOS();
	if (type === str) {
		return true;
	}
	return false;
};

sc.helpers.isWindows = function() {
	return sc.helpers.isOS(SPAZCORE_OS_WINDOWS);
};

sc.helpers.isLinux = function() {
	return sc.helpers.isOS(SPAZCORE_OS_LINUX);
};

sc.helpers.isMacOS = function() {
	return sc.helpers.isOS(SPAZCORE_OS_MACOS);
};
/*jslint 
browser: true,
nomen: false,
debug: true,
forin: true,
undef: true,
white: false,
onevar: false 
 */
var sc, jQuery;
 
/**
 * View helper methods for Twitter apps
 *  
 */

/**
 * This removes any extra items from a set of elements. Intended to be used for
 * limiting the size of timelines
 * 
 * This does NOT remove bound event listeners in order to increase speed. Be careful!
 * 
 * @param {string} item_selector a jquery-compatible selector to get items
 * @param {integer} max_items the max # of item we should have
 * @param {boolean} remove_from_top whether or not to remove extra items from the top. default is FALSE
 * @requires jQuery
 */
sc.helpers.removeExtraElements = function(item_selector, max_items, remove_from_top) {

	if (!remove_from_top) {
		remove_from_top = false;
	}

	var jqitems = jQuery(item_selector);

	var parent = jqitems.parent().get(0);

	var diff = jqitems.length - max_items;
	
	sch.debug('removing extra elements from '+item_selector);
	sch.debug('matching item count '+jqitems.length);
	sch.debug('max_items: '+max_items);
	sch.debug('diff: '+diff);
	sch.debug('remove_from_top: '+remove_from_top);

	if (diff > 0) {

		if (!remove_from_top) {
	        jqitems.slice(diff * -1).each( function() {
				this.parentNode.removeChild( this );
			} );
		} else {
	        jqitems.slice(diff).each( function() {
				this.parentNode.removeChild( this );
			} );
		}
	}
};



/**
 * This removes any duplicate items from a series of elements. Intended to be used for
 * limiting the sice of timelines
 * 
 * @param {string} item_selector a jquery-compatible selector to get items
 * @param {boolean} remove_from_top whether or not to remove extra items from the top. default is FALSE
 * @TODO
 */
sc.helpers.removeDuplicateElements = function(item_selector, remove_from_top) {
	sc.helpers.dump('removeDuplicateElements TODO');

};



/**
 * This updates relative times in elements. Each element has to have an attribute
 * that contains the created_at value provided by Twitter
 * 
 * @param {string} item_selector the jQuery selector for the elements which will contain the relative times
 * @param {string} time_attribute the attribute of the element that contains the created_at value
 * @requires jQuery
 */
sc.helpers.updateRelativeTimes = function(item_selector, time_attribute) {
	jQuery(item_selector).each(function(i) {
		var time = jQuery(this).attr(time_attribute);
		var relative_time = sc.helpers.getRelativeTime(time);
		jQuery(this).html( relative_time );
	});
};


/**
 * this marks all items in the selected set of elements as read. It does this by removing
 * the 'new' class
 * 
 * @param {string} item_selector
 * @requires jQuery
 */
sc.helpers.markAllAsRead = function(item_selector) {
	jQuery(item_selector).removeClass('new');
};
/*jslint 
browser: true,
nomen: false,
debug: true,
forin: true,
undef: true,
white: false,
onevar: false 
 */
var sc, DOMParser;

/**
 * Given a string, this returns an XMLDocument
 * @param {string} string
 * @return {XMLDocument}
 */
sc.helpers.createXMLFromString = function (string) {
	var xmlParser, xmlDocument;
	try {
		xmlParser = new DOMParser();
		xmlDocument = xmlParser.parseFromString(string, 'text/xml');
		return xmlDocument;
	} catch (e) {
		sc.helpers.dump(e.name + ":" + e.message);
		return null;
	}
};



/**
 * "constants" for account types 
 */
var SPAZCORE_ACCOUNT_TWITTER	= 'twitter';
var SPAZCORE_ACCOUNT_IDENTICA	= 'identi.ca';
var SPAZCORE_ACCOUNT_STATUSNET	= 'StatusNet';
var SPAZCORE_ACCOUNT_FLICKR		= 'flickr';
var SPAZCORE_ACCOUNT_WORDPRESS	= 'wordpress.com';
var SPAZCORE_ACCOUNT_TUMBLR		= 'tumblr';
var SPAZCORE_ACCOUNT_FACEBOOK	= 'facebook';
var SPAZCORE_ACCOUNT_FRIENDFEED	= 'friendfeed';

/**
 * This creates a new SpazAccounts object, and optionally associates it with an existing preferences object
 * @constructor
 * @param (Object) prefsObj  An existing SpazPrefs object (optional)
 */
var SpazAccounts = function(prefsObj) {
	if (prefsObj) {
		this.prefs = prefsObj;
	} else {
		this.prefs = new SpazPrefs();
		this.prefs.load();
	}
	
	/*
		load existing accounts
	*/
	this.load();

};

/**
 * the key used inside the prefs object 
 */
SpazAccounts.prototype.prefskey = 'users';

/**
 * loads the accounts array from the prefs object 
 */
SpazAccounts.prototype.load	= function() { 
	var accjson = this.prefs.get(this.prefskey);
	
	sch.debug("accjson:'"+accjson+"'");
	
	try {
		this._accounts = sch.deJSON(this.prefs.get(this.prefskey));
	} catch(e) {
		sch.error(e.message);
		this._accounts = [];
	}		

	/*
		sanity check
	*/
	if (!sch.isArray(this._accounts)) {
		this._accounts = [];
	}
	
	sch.debug("this._accounts:'"+this._accounts+"'");
	
};

/**
 * saves the accounts array to the prefs obj 
 */
SpazAccounts.prototype.save	= function() {
    sch.error(this._accounts[0]);
	this.prefs.set(this.prefskey, sch.enJSON(this._accounts));
	sch.debug('saved users to "'+this.prefskey+'" pref');
	for (var x in this._accounts) {
		sch.debug(this._accounts[x].id);
	};
	
	sch.debug('THE ACCOUNTS:');
	sch.debug(sch.enJSON(this._accounts));

	sch.debug('ALL PREFS:');
	sch.debug(sch.enJSON(this.prefs._prefs));

};

/**
 * returns the array of accounts
 * @returns {array} the accounts 
 */
SpazAccounts.prototype.getAll = function() {
	return this._accounts;
};

/**
 * Set all users by passing in a hash. overwrites all existing data!
 * @param {array} accounts_array an array of account objects
 */
SpazAccounts.prototype.setAll = function(accounts_array) {
	this._accounts = accounts_array;
	this.save();
	sch.debug("Saved these accounts:");
	for (var i=0; i < this_accounts.length; i++) {
		sch.debug(this._accounts[x].id);
	};
};

/**
 * @param {string} id the UUID to update
 * @param {object} acctobj
 * @param {string} [acctobj.username] a new username
 * @param {string} [acctobj.password] a new password
 * @param {string} [acctobj.type] a new account type
 * @param {object} [acctobj.meta] the hash of metadata; you should probably use SpazAccounts.setMeta() instead
 */
SpazAccounts.prototype.update = function(id, acctobj) {
	var orig = this.get(id);
	if (orig) {
		var modified = sch.defaults(orig, acctobj);
		return this.get(id);
	} else {
		sch.error('No account with id "'+id+'" exists');
		return null;
	}
};



/**
 * wipes the accounts array and saves it
 */
SpazAccounts.prototype.initAccounts	= function() {
	this._accounts = [];
	this.save();
};

/**
 * add a new account
 * @param {string} username the username of the account
 * @param {string} auth serialized authentication key, generated by SpazAuth.save()
 * @param {string} type the type of account
 * @returns {object} the account object just added
 */
SpazAccounts.prototype.add = function(username, auth, type) {
	
	if (!type) {
		sch.error("Type must be set");
		return false;
	}

	var account = {
		id: this.generateID(),
		type: type,
		auth: auth,
		username: username,
		meta: {}
	};

    this._accounts.push(account);
	this.save();

	return account;
};


/**
 * @param {string} id the UUID of the account to delete 
 */
SpazAccounts.prototype.remove = function(id) {
	sch.error("Deleting '"+id+"'…");
	
	var index = this._findUserIndex(id);
	if (index !== false) {
		var deleted = this._accounts.splice(index, 1);
		sch.debug("Deleted account '"+deleted[0].id+"'");
		this.save();
		return deleted[0];
	} else {
		sch.error("Could not find this id to delete: '"+id+"'");
		return false;
	}
};


/**
 * @param {string} type the type of accounts to retrieve
 * @returns {array} the array of matching accounts
 */
SpazAccounts.prototype.getByType = function(type) {
	var matches = [];
	
	for (var i=0; i < this._accounts.length; i++) {
		if (this._accounts[i].type === type) {
			matches.push(this._accounts[i]);
		}
	};
	
	return matches;
};

/**
 * @param {string} username the username to search for
 * @returns {array} an array of matching accounts
 */
SpazAccounts.prototype.getByUsername = function(username) {
	var matches = [];

	for (var i=0; i < this._accounts.length; i++) {
		if (this._accounts[i].username === username) {
			matches.push(this._accounts[i]);
		}
	};
	
	return matches;
};

/**
 * @param {string} username the username to search for
 * @param {string} type the type to search for
 * @returns {array} an array of matching accounts
 */
SpazAccounts.prototype.getByUsernameAndType = function(username, type) {
	var matches = [];

	for (var i=0; i < this._accounts.length; i++) {
		if (this._accounts[i].username === username && this._accounts[i].type === type) {
			matches.push(this._accounts[i]);
		}
	};
	
	return matches;
	
};


/**
 * retrives the user object by user and type
 * @param {string} id  the user id UUID
 * @param {string} type 
 */
SpazAccounts.prototype.get = function(id) {

	var index = this._findUserIndex(id);

	if (index !== false) {
		return this._accounts[i];		
	}
	
	return false;
	
};


/**
 * a private function to find the user's array index by their UUID
 * @param {string} id the user's UUID
 * @returns {number|boolen} returns the array index or false if DNE 
 */
SpazAccounts.prototype._findUserIndex = function(id) {
	
	for (i=0; i<this._accounts.length; i++) {
		
		if (this._accounts[i].id === id) {
			sch.debug('Found matching user record to '+ id);
			return i;
		}
		
	}
	
	return false;
};



/**
 * @returns {string} returns the generated UUID 
 */
SpazAccounts.prototype.generateID = function() {
	var id = sc.helpers.UUID();
	return id;
};



/**
 * @param {string} id the user's UUID
 * @param {string} key the key for the metadata entry
 * @returns {String|Object|Array|Boolean|Number} returns the set value, or null if user ID or meta entry is not found
 */
SpazAccounts.prototype.getMeta = function(id, key) {
	
	if ( (user = this.get(id)) ) {
		if (user.meta && user.meta[key] !== null ) {
			return user.meta[key];
		}
	}
	
	return null;
	
};

/**
 * @param {string} id the user's UUID
 * @param {string} key the key for the metadata entry
 * @param {String|Object|Array|Boolean|Number} value the value of the metadata entry
 * @returns {String|Object|Array|Boolean|Number} returns the set value, or null if user ID is not found
 */
SpazAccounts.prototype.setMeta = function(id, key, value) {
	
	var index = this._findUserIndex(id);

	if (index !== false) {		
		if (!this._accounts[index].meta) {
			this._accounts[index].meta = {};
		}
		this._accounts[index].meta[key] = value;
		
		this.save();
		
		return this._accounts[index].meta[key];
		
	}
	return null;
	
};/**
 * A library for performing authentication.
 * Currently supports both Basic and oAuth.
 */

var SPAZCORE_AUTHTYPE_BASIC  = 'basic';
var SPAZCORE_AUTHTYPE_OAUTH  = 'oauth';

var SPAZAUTH_SERVICES = {};

SPAZAUTH_SERVICES[SPAZCORE_ACCOUNT_STATUSNET] = {
	'authType': SPAZCORE_AUTHTYPE_BASIC
};
SPAZAUTH_SERVICES[SPAZCORE_ACCOUNT_IDENTICA] = {
	'authType': SPAZCORE_AUTHTYPE_BASIC
};
SPAZAUTH_SERVICES['default'] = {
	'authType': SPAZCORE_AUTHTYPE_BASIC
};

/**
 * Construct a new authentication object.
 *
 * @param {string} service name of the service to authenticate (ex: twitter, identica)
 * @class SpazAuth
 */
function SpazAuth(service) {
    var serviceInfo = SPAZAUTH_SERVICES[service];
    if (serviceInfo == undefined) {
        sch.error("Invalid authentication service: " + service);
        return null;
    }

    switch (serviceInfo.authType) {
        case SPAZCORE_AUTHTYPE_OAUTH:
            return new SpazOAuth(service, serviceInfo);
        case SPAZCORE_AUTHTYPE_BASIC:
            return new SpazBasicAuth();
        default:
            return new SpazBasicAuth();
    }
};

/**
 * use this to add services that aren't in by default (like, say, stuff with secrets)
 */
SpazAuth.addService = function(label, opts) {
    SPAZAUTH_SERVICES[label] = opts;
};



/**
 * Construct a new basic authentication object.
 *
 * @class SpazBasicAuth
 */
function SpazBasicAuth() {
};

/**
 * Set username and password of account to access service.
 *
 * @param {string} username
 * @param {string} password
 * @class SpazBasicAuth
 * @return {Boolean} true. ALWAYS returns true!
 */
SpazBasicAuth.prototype.authorize = function(username, password) {
    this.username = username;
    this.password = password;
    this.authHeader = "Basic " + sc.helpers.Base64.encode(username + ":" + password);
	return true;
};

/**
 * Returns the authentication header
 * @returns {string} Authentication header value
 * @class SpazBasicAuth
 */
SpazBasicAuth.prototype.signRequest = function() {
    return this.authHeader;
};

/**
  * Load basic auth credentials from a serialized string
  *
  * @param {string} pickle the serialized data string returned by save()
  * @returns {boolean} true if successfully loaded
  * @class SpazBasicAuth
  */
SpazBasicAuth.prototype.load = function(pickle) {
    var credentials = pickle.split(':', 2);
    if (credentials.length != 2) {
        sch.error("Invalid basic auth pickle: " + pickle);
        return false;
    }

    this.authorize(credentials[0], credentials[1]);
    return true;
};

/**
  * Save basic auth credentials into a serialized string
  *
  * @returns {string} serialized string
  * @class SpazBasicAuth
  */
SpazBasicAuth.prototype.save = function() {
    return this.username + ":" + this.password;
};


/**
 * Construct a new OAuth authentication object.
 *
 * @param {string} realm
 * @param {object} options
 * @class SpazOAuth
 */
function SpazOAuth(realm, options) {
    this.realm = realm;
    this.opts = options;
};

/**
 * Authorize access to the service by fetching an OAuth access token.
 *
 * @param {string} username
 * @param {string} password
 * @returns {boolean} true if authorization successful, otherwise false
 * @class SpazOAuth
 */
SpazOAuth.prototype.authorize = function(username, password) {
    this.username = username;

    // Fill in xAuth parameters
    var parameters = {
        'x_auth_username': username,
        'x_auth_password': password,
        'x_auth_mode': 'client_auth'
    };

    // Sign the request
    OAuth.completeRequest({
        method: 'post',
        action: this.opts.accessURL,
        parameters: parameters
    }, this.opts);

    // Perform request to fetch access token
    var accessToken = null;
    jQuery.ajax({
        async: false,
        type: 'post',
        url: this.opts.accessURL,
        data: parameters,
        success: function(data, textStatus) {
            var results = OAuth.decodeForm(data);
            accessToken = {};
            accessToken.key = OAuth.getParameter(results, 'oauth_token');
            accessToken.secret = OAuth.getParameter(results, 'oauth_token_secret');
        },
        error: function(req, textStatus, error) {
            sch.error("Failed to fetch oAuth access token: " + req.responseText);
        }
    });

    if (accessToken != null) {
        this.setAccessToken(accessToken.key, accessToken.secret);
        return true;
    } else {
        return false;
    }
};

/**
  * Set the access token
  *
  * @param {string} key
  * @param {string} secret
  * @class SpazOAuth
  */
SpazOAuth.prototype.setAccessToken = function(key, secret) {
    this.accessToken = {key: key, secret: secret};
    this.signingCredentials = {
        consumerKey: this.opts.consumerKey,
        consumerSecret: this.opts.consumerSecret,
        token: key,
        tokenSecret: secret
    };
};

/**
 * Sign a HTTP request and return oAuth header
 *
 * @param {string} method HTTP method of the request
 * @param {string} url the URL of the request
 * @param {object} parameters map of all parameters in the request
 * @returns {string} Authorization header value
 * @class SpazOAuth
 */
SpazOAuth.prototype.signRequest = function(method, url, parameters) {
    // We need to copy parameters because OAuth.js modifies it.
    var param = jQuery.extend({}, parameters);
    
    OAuth.completeRequest({
        method: method,
        action: url,
        parameters: param
    }, this.signingCredentials);

    return OAuth.getAuthorizationHeader(this.realm, param);
};

/**
  * Load OAuth credentials from a serialized string
  *
  * @param {string} pickle the serialized string returned by save()
  * @returns {boolean} true if successfully loaded
  * @class SpazOAuth
  */
SpazOAuth.prototype.load = function(pickle) {
    var credentials = pickle.split(':', 3);
    if (credentials.length != 3) {
        sch.error("Invalid oauth pickle: " + pickle);
        return false;
    }

    this.username = credentials[0];
    this.setAccessToken(credentials[1], credentials[2]);
    return true;
};

/**
  * Save OAuth credentials to a serialized string
  *
  * @returns {string} serialized string
  * @class SpazOAuth
  */
SpazOAuth.prototype.save = function() {
    return this.username + ":" + this.accessToken.key + ":" + this.accessToken.secret;
};

/*jslint 
browser: true,
nomen: false,
debug: true,
forin: true,
undef: true,
white: false,
onevar: false 
 */
var sc, Titanium, air, jQuery, Mojo;

var SPAZCORE_PREFS_TI_KEY = 'preferences_json';

var SPAZCORE_PREFS_AIR_FILENAME = 'preferences.json';

var SPAZCORE_PREFS_MOJO_COOKIENAME = 'preferences.json';

var SPAZCORE_PREFS_STANDARD_COOKIENAME = 'preferences_json';
 
/**
 * A preferences lib for AIR JS apps. This requires the json2.js library
 * 
 * @param {object} defaults a JS object of key:value pairs used for the pref defaults. Example:
 * {
 * 	foo:124545,
 * 	bar:'Hello!',
 *  boo:false
 * };
 * @param {object} sanity_methods a JS object of key:object pairs that defines methods to be called when the pref is get() or set(). Example:
 * {
 * 	foo:{
 * 		onGet:function(key, value) {};
 * 		onSet:function(key, value) {};
 * 	},
 * 	bar:{
 * 		onGet:function(key, value) {};
 * 		onSet:function(key, value) {};
 * 	}
 * }
 * 
 * events raised:
 * 'spazprefs_loaded'
 * 
 * @TODO we need to pull out the platform-specifc stuff into the /platforms/... hierarchy
 * @class SpazPrefs
 */
function SpazPrefs(defaults, id, sanity_methods) {	

	/*
		init prefs
	*/
	this._prefs = {};
	
	/*
		init sanity check methods
		we use:
		* onGet()
		* onSet()
	*/
	this._sanity_methods = {};


	if (sanity_methods) {
		sch.debug('adding sanity methods to prefs');
		this._sanity_methods = sanity_methods;
	}
	
	if (id) {
		this.id = id;
	}
	
	if (defaults) {
		this.setDefaults(defaults);
		this._applyDefaults();
	}
	
	this.loaded = false;
}


/**
 * sets the passed object of key:val pairs as the default preferences
 * @param {object} defaults
 */ 
SpazPrefs.prototype.setDefaults = function(defaults) {
	this._defaults = defaults;
};


/**
 * this goes through the default prefs and applies them. It also will
 * call the onSet sanity method if it is defined for a given pref keys.
 */
SpazPrefs.prototype._applyDefaults = function() {
	var key;
	for (key in this._defaults) {
		sc.helpers.debug('Copying default "' + key + '":"' + this._defaults[key] + '" (' + typeof(this._defaults[key]) + ')');
		this._prefs[key] = this._defaults[key];
	}
};

/**
 * resets all prefs to defaults and saves 
 */
SpazPrefs.prototype.resetPrefs = function() {
	
	this._applyDefaults();
	this.save();
};



/**
 * Get a preference
 * Note that undefined is returned if the key does not exist
 */
SpazPrefs.prototype.get = function(key, encrypted) {
	var value;
	
	if (encrypted) {
		value = this.getEncrypted(key);
	} else {
		sc.helpers.debug('Looking for pref "'+key+'"');

		if (this._prefs[key] !== undefined) {
			sc.helpers.debug('Found pref "'+key+'" of value "'+this._prefs[key]+'" ('+typeof(this._prefs[key])+')');
			value = this._prefs[key];
		} else {
			value = undefined;
		}
	}
	
	if (this._sanity_methods[key] && this._sanity_methods[key].onGet) {
		sc.helpers.debug("Calling "+key+".onGet()");
		value = this._sanity_methods[key].onGet.call(this, key, value);
	}
		
	return value;
};


/**
 * set a preference and save automatically
 */
SpazPrefs.prototype.set = function(key, val, encrypted) {
	
	sc.helpers.debug('Setting and saving "'+key+'" to "'+val+'" ('+typeof(val)+')');
	
	if (this._sanity_methods[key] && this._sanity_methods[key].onSet) {
		sc.helpers.debug("Calling "+key+".onSet()");
		val = this._sanity_methods[key].onSet.call(this, key, val);
	}
	
	if (encrypted) {
		this.setEncrypted(key, val);
	} else {
		this._prefs[key] = val;
	}

	
	
	this.save();
};







/**
 * @param {string} key the name of the pref
 * @param {string} type the type of method. Currently either 'onGet' or 'onSet'
 * @param {function} method the method definition
 */
SpazPrefs.prototype.setSanityMethod = function(key, type, method) {
	
	if (type !== 'onGet' && type !== 'onSet') {
		sch.error('sanity method type must be onGet or onSet');
	}
	
	if (!this._sanity_methods[key]) {
		this._sanity_methods[key] = {};
	}
	
	this._sanity_methods[key][type] = method;
	
};


/**
 * get an encrypted preference
 * @todo
 */
SpazPrefs.prototype.getEncrypted = function(key) {
	alert('not yet implemented');
};


/**
 * Sets an encrypted pref
 * @todo
 */
SpazPrefs.prototype.setEncrypted = function(key, val) {
	alert('not yet implemented');
};


/**
 * loads the prefs file and parses the prefs into this._prefs,
 * or initializes the file and loads the defaults
 * @stub
 */
SpazPrefs.prototype.load = function(name) {
};







/**
 * saves the current preferences
 * @todo
 */
SpazPrefs.prototype.save = function() {


	
};



/**
 * shortcut for SpazPrefs
 */
if (sc) {
	var scPrefs = SpazPrefs;
}
/*jslint 
browser: true,
nomen: false,
debug: true,
forin: true,
plusplus: false,
regexp: false,
sub: true,
undef: true,
white: false,
onevar: false 
 */
var sc, jQuery, Mojo, use_palmhost_proxy;

/**
 * @depends ../helpers/string.js 
 * @depends ../helpers/datetime.js 
 * @depends ../helpers/event.js 
 * @depends ../helpers/json.js 
 * @depends ../helpers/sys.js 
 */


/**
 * various constant definitions
 */
var SPAZCORE_SECTION_FRIENDS = 'friends';
var SPAZCORE_SECTION_HOME = 'home';
var SPAZCORE_SECTION_REPLIES = 'replies';
var SPAZCORE_SECTION_DMS = 'dms';
var SPAZCORE_SECTION_FAVORITES = 'favorites';
var SPAZCORE_SECTION_COMBINED = 'combined';
var SPAZCORE_SECTION_PUBLIC = 'public';
var SPAZCORE_SECTION_SEARCH = 'search';
var SPAZCORE_SECTION_USER = 'user-timeline';
var SPAZCORE_SECTION_FRIENDLIST = 'friendslist';
var SPAZCORE_SECTION_FOLLOWERSLIST = 'followerslist';
var SPAZCORE_SECTION_USERLISTS = 'userlists';

var SPAZCORE_SERVICE_TWITTER = 'twitter';
var SPAZCORE_SERVICE_IDENTICA = 'identi.ca';
var SPAZCORE_SERVICE_WORDPRESS_TWITTER = 'wordpress-twitter';
var SPAZCORE_SERVICE_CUSTOM = 'custom';
var SPAZCORE_SERVICEURL_TWITTER = 'https://api.twitter.com/1/';
var SPAZCORE_SERVICEURL_IDENTICA = 'https://identi.ca/api/';
var SPAZCORE_SERVICEURL_WORDPRESS_TWITTER = 'https://twitter-api.wordpress.com/';



/**
 * A Twitter API library for Javascript
 * 
 * 
 * jQuery events raised by this library
 * 
 * 'spaztwit_ajax_error'
 * 'new_public_timeline_data' (data)
 * 'new_friends_timeline_data' (data)
 * 'error_friends_timeline_data' (data)
 * 'new_replies_timeline_data' (data)
 * 'error_replies_timeline_data' (data)
 * 'new_dms_timeline_data' (data)
 * 'error_dms_timeline_data' (data)
 * 'new_combined_timeline_data' (data)
 * 'error_combined_timeline_data' (data)
 * 'new_favorites_timeline_data' (data)
 * 'error_favorites_timeline_data' (data)
 * 'verify_credentials_succeeded' (data)
 * 'verify_credentials_failed' (data)
 * 'update_succeeded' (data)
 * 'update_failed' (data)
 * 'get_user_succeeded' (data)
 * 'get_user_failed' (data)
 * 'get_one_status_succeeded' (data)
 * 'get_one_status_failed' (data)
 * 'new_search_timeline_data' (data)
 * 'error_search_timeline_data' (data)
 * 'new_trends_data' (data)
 * 'error_trends_data' (data)
 * 'new_saved_searches_data' (data)
 * 'error_saved_searches_data' (data)
 * 'create_saved_search_succeeded' (data)
 * 'create_saved_search_failed' (data)
 * 'destroy_saved_search_succeeded' (data)
 * 'destroy_saved_search_failed' (data)
 * 'create_favorite_succeeded'
 * 'create_favorite_failed'
 * 'destroy_favorite_succeeded'
 * 'destroy_favorite_failed'
 * 'create_friendship_succeeded'
 * 'create_friendship_failed'
 * 'destroy_friendship_succeeded'
 * 'destroy_friendship_failed'
 * 'create_block_succeeded'
 * 'create_block_failed'
 * 'destroy_block_succeeded'
 * 'destroy_block_failed'
 * 'follow_succeeded'
 * 'follow_failed'
 * 'unfollow_succeeded'
 * 'unfollow_failed'
 * 'ratelimit_status_succeeded'
 * 'ratelimit_status_failed'
 * 'destroy_status_succeeded'
 * 'destroy_status_failed'
 * 'destroy_dm_succeeded'
 * 'destroy_dm_failed'
 * 
 * 
 * @param {Object} opts various options
 * @param {Object} [opts.auth] SpazAuth object
 * @param {String} [opts.event_mode] The event mode to use ('jquery' or 'DOM'). Defaults to 'DOM'
 * @param {Object} [opts.event_target] the DOM element to target the event on. Defaults to document
 * @param {Number} [opts.timeout] length of time, in seconds, to timeout
 * @class SpazTwit
*/
function SpazTwit(opts) {
	
	this.opts = sch.defaults({
		auth:         null,
		username:     null,
		event_mode:   'DOM',
		event_target: document,
		timeout:      this.DEFAULT_TIMEOUT
	}, opts);
	
	
	this.auth                = this.opts.auth;
	
	this.setSource('SpazCore');
	
	this.initializeData();
	
	this.initializeCombinedTracker();
	
	/*
		Cache for one-shot users and posts. Not sure what we'll do with it yet
	*/
	this.cache = {
		users:{},
		posts:{}
	};
	
	this.me = {};
	

	this.setBaseURL(SPAZCORE_SERVICEURL_TWITTER);

	/**
	 * remap dump calls as appropriate 
	 */
	if (sc && sc.helpers && sc.helpers.dump) {
		window.dump = sc.helpers.dump;
	} else { // do nothing!
		var dump = function(input) {
			return;
		};
	}
}

/**
 * the default timeout value (60 seconds) 
 */
SpazTwit.prototype.DEFAULT_TIMEOUT = 1000*60;



/**
 * retrieves the last status id retrieved for a given section
 * @param {string} section  use one of the defined constants (ex. SPAZCORE_SECTION_HOME)
 * @return {integer} the last id retrieved for this section
 */
SpazTwit.prototype.getLastId   = function(section) {
	return this.data[section].lastid;
};

/**
 * sets the last status id retrieved for a given section
 * @param {string} section  use one of the defined constants (ex. SPAZCORE_SECTION_HOME)
 * @param {integer} id  the new last id retrieved for this section
 */
SpazTwit.prototype.setLastId   = function(section, id) {
	this.data[section].lastid = parseInt(id, 10);
};


SpazTwit.prototype.initializeData = function() {
	/*
		this is where we store timeline data and settings for persistence
	*/
	this.data = {};
	this.data[SPAZCORE_SECTION_HOME] = {
		'lastid':   1,
		'items':   [],
		'newitems':[],
		'max':200,
		'min_age':5*60
	};
	this.data[SPAZCORE_SECTION_FRIENDS] = {
		'lastid':   1,
		'items':   [],
		'newitems':[],
		'max':200,
		'min_age':5*60
	};
	this.data[SPAZCORE_SECTION_REPLIES] = {
		'lastid':   1,
		'items':   [],
		'newitems':[],
		'max':50,
		'min_age':5*60
	};
	this.data[SPAZCORE_SECTION_DMS] = {
		'lastid':   1,
		'items':   [],
		'newitems':[],
		'max':50,
		'min_age':5*60
	};
	this.data[SPAZCORE_SECTION_FAVORITES] = {
		'lastid':   1,
		'items':   [],
		'newitems':[],
		'max':100,
		'min_age':5*60
	};
	this.data[SPAZCORE_SECTION_COMBINED] = {
		'items':   [],
		'newitems':[],
		'updates' :[],
		'max':400,
		'min_age':5*60
	};
	this.data[SPAZCORE_SECTION_FRIENDLIST] = {
		'items':   [],
		'newitems':[],
		'max':500,
		'min_age':5*60
	};
	this.data[SPAZCORE_SECTION_FOLLOWERSLIST] = {
		'items':   [],
		'newitems':[],
		'max':500,
		'min_age':5*60
	};
	this.data[SPAZCORE_SECTION_SEARCH] = {
		'lastid':  0, // search api prefers 0, will freak out on "1"
		'items':   [],
		'newitems':[],
		'lastresultdata':{},
		'max':200,
		'min_age':30
	};
	this.data[SPAZCORE_SECTION_USERLISTS] = {
		'items':   [],
		'newitems':[],
		'max':500,
		'min_age':5*60
	};
	// this.data.byid = {};
};


/**
 * resets the combined_finished progress tracker 
 */
SpazTwit.prototype.initializeCombinedTracker = function() {
	this.combined_finished = {};
	this.combined_finished[SPAZCORE_SECTION_HOME] = false;
	this.combined_finished[SPAZCORE_SECTION_REPLIES] = false;
	this.combined_finished[SPAZCORE_SECTION_DMS] = false;
	
	this.combined_errors = [];
};

/**
 * Checks to see if the combined timeline is finished 
 * @return {boolean}
 */
SpazTwit.prototype.combinedTimelineFinished = function() {
	for (var i in this.combined_finished) {
		if (!this.combined_finished[i]) {
			return false;
		}
	}
	return true;
};

/**
 * Checks to see if the combined timeline is finished 
 * @return {boolean}
 */
SpazTwit.prototype.combinedTimelineHasErrors = function() {
	if (this.combined_errors.length > 0) {
		return true;
	} else {
		return false;
	}
};

/**
 * Checks to see if the combined timeline contains sent updates
 * @return {boolean}
 */
SpazTwit.prototype.combinedTimelineHasUpdates = function() {
	return this.data[SPAZCORE_SECTION_COMBINED].updates.length > 0;
};

/**
 * Adds ids of array of statuses to updates
 */
SpazTwit.prototype.combinedTimelineAddUpdates = function(items) {
	if (items.id) {
		items = [items];
	}
	var i;
	for (i in items) {
		this.data[SPAZCORE_SECTION_COMBINED].updates.push(items[i].id);
	}
};

/**
 * Removes the update items from combined newitems
 */
SpazTwit.prototype.combinedNewItemsRemoveUpdates = function() {
	if (!this.combinedTimelineHasUpdates()) {
		return;
	}
	var data = this.data[SPAZCORE_SECTION_COMBINED],
		iStr = ':' + data.updates.join(':') + ':',
		news = data.newitems,
		keep = [],
		i;

	for (i in news) {
		if (!RegExp(':' + news[i].id + ':').test(iStr)) {
			keep.push(news[i]);
		}
	}
	data.newitems = keep;
	data.updates  = [];
};


/**
 * sets the base URL
 * @param {string} newurl
 */
SpazTwit.prototype.setBaseURL= function(newurl) {
	
	var lastchar = newurl.charAt(newurl.length -1);
	if (lastchar !== '/') {
		newurl = newurl + '/';
	}
	
	this.baseurl = newurl;
};


/**
 * sets the base URL by the service type
 * @param {string} service  see SPAZCORE_SERVICE_* 
 */
SpazTwit.prototype.setBaseURLByService= function(service) {
	
	var baseurl = '';
	
	switch (service) {
		case SPAZCORE_SERVICE_TWITTER:
			baseurl = SPAZCORE_SERVICEURL_TWITTER;
			break;
		case SPAZCORE_SERVICE_IDENTICA:
			baseurl = SPAZCORE_SERVICEURL_IDENTICA;
			break;
		case SPAZCORE_SERVICE_WORDPRESS_TWITTER:
			baseurl = SPAZCORE_SERVICEURL_WORDPRESS_TWITTER;
			break;
		default:
			baseurl = SPAZCORE_SERVICEURL_TWITTER;
			break;
	}
	
	this.baseurl = baseurl;
};


SpazTwit.prototype.setCredentials = function(auth_obj) {
	this.auth = auth_obj;
	this.username = this.auth.username;
};


/**
 * set the source string we will pass on updates
 * 
 * @param {string} new_source 
 */
SpazTwit.prototype.setSource = function(new_source) {
	this.source = new_source;
};



/*
 * given a key, it returns the URL (baseurl+API method path)
 * @param {string} key the key for the URL
 * @param {array|object} urldata data to included in the URL as GET data
*/
SpazTwit.prototype.getAPIURL = function(key, urldata) {
	var urls = {};



    // Timeline URLs
	urls.public_timeline    = "statuses/public_timeline.json";
	urls.friends_timeline   = "statuses/friends_timeline.json";
	urls.home_timeline		= "statuses/home_timeline.json";
	urls.user_timeline      = "statuses/user_timeline.json";
	urls.replies_timeline   = "statuses/replies.json";
	urls.show				= "statuses/show/{{ID}}.json";
	urls.favorites          = "favorites.json";
	urls.user_favorites     = "favorites/{{ID}}.json"; // use this to retrieve favs of a user other than yourself
	urls.dm_timeline        = "direct_messages.json";
	urls.dm_sent            = "direct_messages/sent.json";
	urls.friendslist        = "statuses/friends.json";
	urls.followerslist      = "statuses/followers.json";
	urls.show_user			= "users/show/{{ID}}.json";
	urls.featuredlist       = "statuses/featured.json";

	// Action URLs
	urls.update           	= "statuses/update.json";
	urls.destroy_status   	= "statuses/destroy/{{ID}}.json";
	urls.dm_new             = "direct_messages/new.json";
	urls.dm_destroy         = "direct_messages/destroy/{{ID}}.json";
	urls.friendship_create  = "friendships/create/{{ID}}.json";
	urls.friendship_destroy	= "friendships/destroy/{{ID}}.json";
	urls.block_create		= "blocks/create/{{ID}}.json";
	urls.block_destroy		= "blocks/destroy/{{ID}}.json";
	urls.follow             = "notifications/follow/{{ID}}.json";
	urls.unfollow			= "notifications/leave/{{ID}}.json";
	urls.favorites_create 	= "favorites/create/{{ID}}.json";
	urls.favorites_destroy	= "favorites/destroy/{{ID}}.json";
	urls.saved_searches_create 	= "saved_searches/create.json";
	urls.saved_searches_destroy	= "saved_searches/destroy/{{ID}}.json";
	urls.verify_credentials = "account/verify_credentials.json";
	urls.ratelimit_status   = "account/rate_limit_status.json";
	urls.update_profile		= "account/update_profile.json";
	urls.saved_searches		= "saved_searches.json";
	urls.report_spam		= "report_spam.json";

    // User lists URLs
	urls.lists              = "{{USER}}/lists.json";
	urls.lists_list         = "{{USER}}/lists/{{SLUG}}.json";
	urls.lists_memberships  = "{{USER}}/lists/memberships.json";
	urls.lists_timeline     = "{{USER}}/lists/{{SLUG}}/statuses.json";
	urls.lists_members      = "{{USER}}/{{SLUG}}/members.json";
	urls.lists_check_member = "{{USER}}/{{SLUG}}/members/{{ID}}.json";
	urls.lists_subscribers  = "{{USER}}/{{SLUG}}/subscribers.json";
	urls.lists_check_subscriber = "{{USER}}/{{SLUG}}/subscribers/{{ID}}.json";
	urls.lists_subscriptions = "{{USER}}/lists/subscriptions.json";

	//trends
	urls.trends				= "trends.json";
	urls.trends_current		= "trends/current.json";
	urls.trends_daily		= "trends/daily.json";
	urls.trends_weekly		= "trends/weekly.json";
	
	//retweet
	urls.retweet			= "statuses/retweet/{{ID}}.json";
	urls.retweets			= "statuses/retweets/{{ID}}.json";
	urls.retweeted_by_me	= "statuses/retweeted_by_me.json";
	urls.retweeted_to_me	= "statuses/retweeted_to_me.json";
	urls.retweets_of_me		= "statuses/retweets_of_me.json";

	// search
	if (this.baseurl === SPAZCORE_SERVICEURL_TWITTER) {
		urls.search				= "http://search.twitter.com/search.json";
	} else {
		urls.search				= "search.json";
	}

	// misc
	urls.test 			  	= "help/test.json";
	urls.downtime_schedule	= "help/downtime_schedule.json";

	
	if (urls[key].indexOf('{{ID}}') > -1) {
		if (typeof(urldata) === 'string') {
			urls[key] = urls[key].replace('{{ID}}', urldata);
		} else if (urldata && typeof(urldata) === 'object') {
			urls[key] = urls[key].replace('{{ID}}', urldata.id);
		}
		
	}

    // Token replacement for user lists
    if (urls[key].indexOf('{{USER}}') > - 1) {
        if (urldata && typeof(urldata) === 'object') {
            urls[key] = urls[key].replace('{{USER}}', urldata.user);
        }
    }

    if (urls[key].indexOf('{{SLUG}}') > -1) {
        if (urldata && typeof(urldata) === 'object') {
            urls[key] = urls[key].replace('{{SLUG}}', urldata.slug);
        }
    }

    if (urls[key]) {
	
		if (urldata && typeof urldata !== "string") {
			urldata = '?'+jQuery.param(urldata);
		} else {
			urldata = '';
		}
		
		if (this.baseurl === SPAZCORE_SERVICEURL_TWITTER && (key === 'search' || key === 'trends')) {
			return this._postProcessURL(urls[key] + urldata);
		} else {
			return this._postProcessURL(this.baseurl + urls[key] + urldata);
		}
        
    } else {
        return false;
    }

};




/*
 * Verify authentication credentials. 
*/
SpazTwit.prototype.verifyCredentials = function(onSuccess, onFailure) {
	var url = this.getAPIURL('verify_credentials');
	
	var opts = {
		'url':url,
		'process_callback': this._processAuthenticatedUser,
		'success_event_type':'verify_credentials_succeeded',
		'failure_event_type':'verify_credentials_failed',
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'method':'GET'
	};

	/*
		Perform a request and get true or false back
	*/
	var xhr = this._callMethod(opts);
	
};

/**
 * This takes data retrieved from the verifyCredentials method and stores it
 * in this.me. it then fires off the event specified in finished_event
 * 
 * @param {object} data the data returned by a successful call to the verifyCredentials API method
 * @param {string} finished_event the type of event to fire 
 * @private
 */
SpazTwit.prototype._processAuthenticatedUser = function(data, opts) {
	this.me = data;
	this.initializeData();
	
	if (opts.success_callback) {
		opts.success_callback(this.me);
	}
	this.triggerEvent(opts.success_event_type, this.me);
	
};


/**
 * Initiates retrieval of the public timeline. 
 */
SpazTwit.prototype.getPublicTimeline = function(onSuccess, onFailure) {
	var url = this.getAPIURL('public_timeline');
	
	var xhr = this._getTimeline({
		'url':url,
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'success_event_type': 'new_public_timeline_data'
	});
};


/**
 * Initiates retrieval of the home timeline (all the people you are following)
 * 
 * @param {integer} since_id default is 1
 * @param {integer} count default is 200 
 * @param {integer} page default is null (ignored if null)
 */
SpazTwit.prototype.getHomeTimeline = function(since_id, count, page, processing_opts, onSuccess, onFailure) {
	
	if (!page) { page = null;}
	if (!count) { count = 50;}
	if (!since_id) {
		if (this.data[SPAZCORE_SECTION_HOME].lastid && this.data[SPAZCORE_SECTION_HOME].lastid > 1) {
			since_id = this.data[SPAZCORE_SECTION_HOME].lastid;
		} else {
			since_id = 1;
		}
	}
	
	if (!processing_opts) {
		processing_opts = {};
	}
	
	if (processing_opts.combined) {
		processing_opts.section = SPAZCORE_SECTION_HOME;
	}
	
	var data = {};
	if (since_id < -1) {
		data['max_id'] = Math.abs(since_id);
	} else {
		data['since_id'] = since_id;
	}
	data['count']	 = count;
	if (page) {
		data['page'] = page;
	}
	
	
	var url = this.getAPIURL('home_timeline', data);
	this._getTimeline({
		'url':url,
		'process_callback'	: this._processHomeTimeline,
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'success_event_type': 'new_home_timeline_data',
		'failure_event_type': 'error_home_timeline_data',
		'processing_opts':processing_opts
	});
};

/**
 * @private
 */
SpazTwit.prototype._processHomeTimeline = function(ret_items, opts, processing_opts) {
	sc.helpers.dump('Processing '+ret_items.length+' items returned from home method');
	this._processTimeline(SPAZCORE_SECTION_HOME, ret_items, opts, processing_opts);
};



/**
 * Initiates retrieval of the friends timeline (all the people you are following)
 * 
 * @param {integer} since_id default is 1
 * @param {integer} count default is 200 
 * @param {integer} page default is null (ignored if null)
 */
SpazTwit.prototype.getFriendsTimeline = function(since_id, count, page, processing_opts, onSuccess, onFailure) {
	
	if (!page) { page = null;}
	if (!count) { count = 50;}
	if (!since_id) {
		if (this.data[SPAZCORE_SECTION_FRIENDS].lastid && this.data[SPAZCORE_SECTION_FRIENDS].lastid > 1) {
			since_id = this.data[SPAZCORE_SECTION_FRIENDS].lastid;
		} else {
			since_id = 1;
		}
	}
	
	if (!processing_opts) {
		processing_opts = {};
	}
	
	if (processing_opts.combined) {
		processing_opts.section = SPAZCORE_SECTION_FRIENDS;
	}
	
	var data = {};
	data['since_id'] = since_id;
	data['count']	 = count;
	if (page) {
		data['page'] = page;
	}
	
	
	var url = this.getAPIURL('friends_timeline', data);
	this._getTimeline({
		'url':url,
		'process_callback'	: this._processFriendsTimeline,
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'success_event_type': 'new_friends_timeline_data',
		'failure_event_type': 'error_friends_timeline_data',
		'processing_opts':processing_opts
	});
};

/**
 * @private
 */
SpazTwit.prototype._processFriendsTimeline = function(ret_items, opts, processing_opts) {
	sc.helpers.dump('Processing '+ret_items.length+' items returned from friends method');
	this._processTimeline(SPAZCORE_SECTION_FRIENDS, ret_items, opts, processing_opts);
};


/**
 *  
 */
SpazTwit.prototype.getReplies = function(since_id, count, page, processing_opts, onSuccess, onFailure) {	
	if (!page) { page = null;}
	if (!count) { count = null;}
	if (!since_id) {
		if (this.data[SPAZCORE_SECTION_REPLIES].lastid && this.data[SPAZCORE_SECTION_REPLIES].lastid > 1) {
			since_id = this.data[SPAZCORE_SECTION_REPLIES].lastid;
		} else {
			since_id = 1;
		}
	}
	
	if (!processing_opts) {
		processing_opts = {};
	}
	
	if (processing_opts.combined) {
		processing_opts.section = SPAZCORE_SECTION_REPLIES;
	}
	
	
	var data = {};
	if (since_id < -1) {
		data['max_id'] = Math.abs(since_id);
	} else {
		data['since_id'] = since_id;
	}
	if (page) {
		data['page'] = page;
	}
	if (count) {
		data['count'] = count;
	}
	
	var url = this.getAPIURL('replies_timeline', data);
	this._getTimeline({
		'url':url,
		'process_callback'	: this._processRepliesTimeline,
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'success_event_type': 'new_replies_timeline_data',
		'failure_event_type': 'error_replies_timeline_data',
		'processing_opts':processing_opts
	});

};


/**
 * @private
 */
SpazTwit.prototype._processRepliesTimeline = function(ret_items, opts, processing_opts) {
	sc.helpers.dump('Processing '+ret_items.length+' items returned from replies method');
	this._processTimeline(SPAZCORE_SECTION_REPLIES, ret_items, opts, processing_opts);
};

/**
 *  
 */
SpazTwit.prototype.getDirectMessages = function(since_id, count, page, processing_opts, onSuccess, onFailure) {
	if (!page) { page = null;}
	if (!count) { count = null;}
	if (!since_id) {
		if (this.data[SPAZCORE_SECTION_DMS].lastid && this.data[SPAZCORE_SECTION_DMS].lastid > 1) {
			since_id = this.data[SPAZCORE_SECTION_DMS].lastid;
		} else {
			since_id = 1;
		}
	}
	
	if (!processing_opts) {
		processing_opts = {};
	}
	
	if (processing_opts.combined) {
		processing_opts.section = SPAZCORE_SECTION_DMS;
	}
	
	var data = {};
	if (since_id < -1) {
		data['max_id'] = Math.abs(since_id);
	} else {
		data['since_id'] = since_id;
	}
	if (page) {
		data['page'] = page;
	}
	if (count) {
		data['count'] = count;
	}
	
	var url = this.getAPIURL('dm_timeline', data);
	this._getTimeline({
		'url':url,
		'process_callback'	: this._processDMTimeline,
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'success_event_type': 'new_dms_timeline_data',
		'failure_event_type': 'error_dms_timeline_data',
		'processing_opts':processing_opts		
	});
	
};

/**
 * @private
 */
SpazTwit.prototype._processDMTimeline = function(ret_items, opts, processing_opts) {
	sc.helpers.dump('Processing '+ret_items.length+' items returned from DM method');
	this._processTimeline(SPAZCORE_SECTION_DMS, ret_items, opts, processing_opts);
};

/**
 *  
 */
SpazTwit.prototype.getFavorites = function(page, processing_opts, onSuccess, onFailure) {	
	if (!page) { page = null;}
	if (!processing_opts) {
		processing_opts = {};
	}
	
	var data = {};
	if (page) {
		data['page'] = page;
	}
	
	var url = this.getAPIURL('favorites', data);

	this._getTimeline({
		'url':url,
		'process_callback'	: this._processFavoritesTimeline,
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'success_event_type': 'new_favorites_timeline_data',
		'failure_event_type': 'error_favorites_timeline_data',
		'processing_opts':processing_opts
	});

};
/**
 * @private
 */
SpazTwit.prototype._processFavoritesTimeline = function(ret_items, opts, processing_opts) {
	this._processTimeline(SPAZCORE_SECTION_FAVORITES, ret_items, opts, processing_opts);
};



SpazTwit.prototype.getSent = function(since_id, count, page, onSuccess, onFailure) {}; // auth user's sent statuses
SpazTwit.prototype.getSentDirectMessages = function(since_id, page, onSuccess, onFailure) {};

SpazTwit.prototype.getUserTimeline = function(id, count, page, onSuccess, onFailure) {

	var opts = sch.defaults({
		'id': id,
		'since_id': null,
		'count': count || 10,
		'page': page || null,
		'onSuccess': onSuccess,
		'onFailure': onFailure
	}, id);

	if (!opts.id || 'object' === typeof opts.id) {
		return;
	}

	var data = {};
	data['id']    = opts.id;
	data['count'] = opts.count;
	if (opts.since_id) {
		if (opts.since_id < -1) {
			data['max_id'] = Math.abs(opts.since_id);
		} else {
			data['since_id'] = opts.since_id;
		}
	}
	if (opts.page) {
		data['page'] = opts.page;
	}
	
	
	var url = this.getAPIURL('user_timeline', data);
	
	this._getTimeline({
		'url':url,
		'process_callback'	: this._processUserTimeline,
		'success_callback':opts.onSuccess,
		'failure_callback':opts.onFailure,
		'success_event_type': 'new_user_timeline_data',
		'failure_event_type': 'error_user_timeline_data'
	});
}; // given user's sent statuses


/**
 * @private
 */
SpazTwit.prototype._processUserTimeline = function(ret_items, opts, processing_opts) {
	this._processTimeline(SPAZCORE_SECTION_USER, ret_items, opts, processing_opts);
};



/**
 * this retrieves three different timelines. the event "new_combined_timeline_data"
 * does not fire until ALL async ajax calls are made 
 * 
 * 
 */
SpazTwit.prototype.getCombinedTimeline = function(com_opts, onSuccess, onFailure) {
	var home_count, friends_count, replies_count, dm_count, home_since, friends_since, dm_since, replies_since = null;

	var opts = {
		'combined':true
	};
	
	if (com_opts) {
		if (com_opts.friends_count) {
			friends_count = com_opts.friends_count;
		}
		if (com_opts.home_count) {
			home_count = com_opts.home_count;
		}
		if (com_opts.replies_count) {
			replies_count = com_opts.replies_count; // this is not used yet
		}
		if (com_opts.dm_count) {
			dm_count = com_opts.dm_count; // this is not used yet
		}
		if (com_opts.home_since) {
			home_since = com_opts.home_since;
		}
		if (com_opts.friends_since) {
			friends_since = com_opts.friend_since;
		}
		if (com_opts.replies_since) {
			replies_since = com_opts.replies_since;
		}
		if (com_opts.dm_since) {
			dm_since = com_opts.dm_since;
		}
		
		/*
			we might still only pass in friends_* opts, so we translate those to home_*
		*/
		if (!home_count) { home_count = friends_count; }
		if (!home_since) { home_since = friends_since; }
		
		if (com_opts.force) {
			opts.force = true;
		}
	}
	
	this.getHomeTimeline(home_since, home_count, null, opts, onSuccess, onFailure);
	this.getReplies(replies_since, replies_count, null, opts, onSuccess, onFailure);
	this.getDirectMessages(dm_since, dm_count, null, opts, onSuccess, onFailure);
};



SpazTwit.prototype.search = function(query, since_id, results_per_page, page, lang, geocode, onSuccess, onFailure) {
	if (!page) { page = 1;}
	// if (!since_id) {
	// 	if (this.data[SPAZCORE_SECTION_SEARCH].lastid && this.data[SPAZCORE_SECTION_SEARCH].lastid > 1) {
	// 		since_id = this.data[SPAZCORE_SECTION_SEARCH].lastid;
	// 	} else {
	// 		since_id = 1;
	// 	}
	// }
	if (!results_per_page) {
		results_per_page = 50;
	}
	
	
	var data = {};
	data['q']        = query;
	data['rpp']      = results_per_page;
	// data['since_id'] = since_id;
	data['page']     = page;
	if (lang) {
		data['lang'] = lang;
	}
	if (geocode) {
		data['geocode'] = geocode;
	}
	
	var url = this.getAPIURL('search', data);
	this._getTimeline({
		'url':url,
		'process_callback'	: this._processSearchTimeline,
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'success_event_type': 'new_search_timeline_data',
		'failure_event_type': 'error_search_timeline_data'
	});
	
};

/**
 * @private
 */
SpazTwit.prototype._processSearchTimeline = function(search_result, opts, processing_opts) {	
	/*
		Search is different enough that we need to break it out and 
		write a custom alternative to _processTimeline
	*/
	if (!processing_opts) { processing_opts = {}; }

	/*
		reset .newitems data properties
	*/
	this.data[SPAZCORE_SECTION_SEARCH].newitems = [];
	
	/*
		put these results in the lastresultdata property
	*/
	this.data[SPAZCORE_SECTION_SEARCH].lastresultdata = search_result;
	
	/*
		grab the array of items
	*/
	var ret_items = search_result.results;

	if (ret_items.length > 0){
		/*
			we process each item, adding some attributes and generally making it cool
		*/
		for (var k=0; k<ret_items.length; k++) {
			ret_items[k] = this._processSearchItem(ret_items[k], SPAZCORE_SECTION_SEARCH);
		}

		/*
			sort items
		*/
		ret_items.sort(this._sortItemsAscending);
					
		/*
			set lastid
		*/ 
		var lastid = ret_items[ret_items.length-1].id;
		this.data[SPAZCORE_SECTION_SEARCH].lastid = lastid;
		sc.helpers.dump('this.data['+SPAZCORE_SECTION_SEARCH+'].lastid:'+this.data[SPAZCORE_SECTION_SEARCH].lastid);

		/*
			add new items to data.newitems array
		*/
		this.data[SPAZCORE_SECTION_SEARCH].newitems = ret_items;

		/*
			concat new items onto data.items array
		*/
		this.data[SPAZCORE_SECTION_SEARCH].items = this.data[SPAZCORE_SECTION_SEARCH].items.concat(this.data[SPAZCORE_SECTION_SEARCH].newitems);
		
		this.data[SPAZCORE_SECTION_SEARCH].items = this.removeDuplicates(this.data[SPAZCORE_SECTION_SEARCH].items);
		sch.debug('NOT removing extras from search -- we don\'t do that anymore');
		// this.data[SPAZCORE_SECTION_SEARCH].items = this.removeExtraElements(this.data[SPAZCORE_SECTION_SEARCH].items, this.data[SPAZCORE_SECTION_SEARCH].max);


		var search_info = {
			'since_id'         : search_result.since_id,
			'max_id'           : search_result.max_id,
			'refresh_url'      : search_result.refresh_url,
			'results_per_page' : search_result.results_per_page,
			'next_page'        : search_result.next_page,
			'completed_in'     : search_result.completed_in,
			'page'             : search_result.page,
			'query'            : search_result.query
		};
		
		if (opts.success_callback) {
			opts.success_callback(this.data[SPAZCORE_SECTION_SEARCH].newitems, search_info);
		}
		this.triggerEvent(opts.success_event_type, [this.data[SPAZCORE_SECTION_SEARCH].newitems, search_info]);
		


	} else { // no new items, but we should fire off success anyway
		
		if (opts.success_callback) {
			opts.success_callback(null, []);
		}
		this.triggerEvent(opts.success_event_type, []);
	}
	
};



SpazTwit.prototype._processSearchItem = function(item, section_name) {
	
	item.SC_timeline_from = section_name;
	if (this.username) {
		item.SC_user_received_by = this.username;
	}
	// sc.helpers.dump(item);
	
	item.SC_is_search = true;

	/*
		add unix timestamp .SC_created_at_unixtime for easier date comparison
	*/
	if (!item.SC_created_at_unixtime) {
		item.SC_created_at_unixtime = sc.helpers.httpTimeToInt(item.created_at);
	}
	
	/*
		add raw text .SC_raw_text for unmodified text
	*/
	if (!item.SC_text_raw) {
		item.SC_text_raw = item.text;
	}
	
	/*
		add "in_reply_to_screen_name" if it does not exist
	*/
	if (!item.in_reply_to_screen_name && item.in_reply_to_user_id) {
		/**
		 * @todo get this from the Spaz code 
		 */
	}
	
	/*
		add .SC_retrieved_unixtime
	*/
	if (!item.SC_retrieved_unixtime) {
		item.SC_retrieved_unixtime = sc.helpers.getTimeAsInt();
	}
	
	/*
		normalize so we have as much user data in this object as possible
	*/
	item.user = {
		'profile_image_url':item.profile_image_url,
		'screen_name':item.from_user,
		'id':item.from_user_id
	};
	
	/*
		The source info here is encoded differently
	*/
	item.source = sc.helpers.fromHTMLSpecialChars(item.source);
	
	
	return item;
};


SpazTwit.prototype.getTrends = function(onSuccess, onFailure) {
	var url = this.getAPIURL('trends');
	this._getTimeline({
		'url':url,
		'process_callback'	: this._processTrends,
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'success_event_type': 'new_trends_data',
		'failure_event_type': 'error_trends_data'
	});
};


/**
 * @private
 */
SpazTwit.prototype._processTrends = function(trends_result, opts, processing_opts) {

	if (!processing_opts) { processing_opts = {}; }
	
	/*
		grab the array of items
	*/
	var ret_items = trends_result.trends;

	if (ret_items.length > 0) {

		for (var k=0; k<ret_items.length; k++) {
			ret_items[k].searchterm = ret_items[k].name;
			if ( /\s+/.test(ret_items[k].searchterm)) { // if there is whitespace, wrap in quotes
				ret_items[k].searchterm = '"'+ret_items[k].searchterm+'"';
			}
		}
		// jQuery().trigger(finished_event, [ret_items]);
		
		if (opts.success_callback) {
			opts.success_callback(ret_items);
		}
		this.triggerEvent(opts.success_event_type, ret_items);
		
	}
};


/**
 * this is a general wrapper for timeline methods
 * @param {obj} opts a set of options for this method 
 * @private
 */
SpazTwit.prototype._getTimeline = function(opts) {
	
	opts = sch.defaults({
		'method':'GET',
		'timeout':this.DEFAULT_TIMEOUT,
		'url':null,
		'data':null,
		'process_callback':null,
		'processing_opts':null,
		'success_event_type':null,
		'failure_event_type':null,
		'success_callback':null,
		'failure_callback':null
	}, opts);
	
	/*
		for closure references
	*/
	var stwit = this;
	
	var xhr = jQuery.ajax({
		'timeout' :opts.timeout,
        'complete':function(xhr, msg){
            sc.helpers.dump(opts.url + ' complete:'+msg);
			if (msg === 'timeout') {
				// jQuery().trigger(opts.failure_event_type, [{'url':opts.url, 'xhr':xhr, 'msg':msg}]);
				stwit.triggerEvent(opts.failure_event_type, {'url':opts.url, 'xhr':xhr, 'msg':msg});				
			}
        },
        'error':function(xhr, msg, exc) {
			sc.helpers.dump(opts.url + ' error:"'+msg+'"');
			if (msg.toLowerCase().indexOf('timeout') !== -1) {
				stwit.triggerEvent(document, opts.failure_event_type, {'url':opts.url, 'xhr':null, 'msg':msg});
			} else if (xhr) {
				if (!xhr.readyState < 4) {
					sc.helpers.dump("Error:"+xhr.status+" from "+opts['url']);
					if (xhr.responseText) {
						try {
							var data = sc.helpers.deJSON(xhr.responseText);
						} catch(e) {
							sc.helpers.dump(e.name + ":" + e.message);
							data = xhr.responseText;
						}
					}
				}
				if (opts.failure_callback) {
					opts.failure_callback(xhr, msg, exc);
				}
				if (opts.failure_event_type) {
					sc.helpers.dump("opts.failure_event_type:"+opts.failure_event_type);
					// jQuery().trigger(opts.failure_event_type, [{'url':opts.url, 'xhr':xhr, 'msg':msg}]);
					stwit.triggerEvent(opts.failure_event_type, {'url':opts.url, 'xhr':xhr, 'msg':msg});
					
				}
	
	        } else {
                sc.helpers.dump("Error:Unknown from "+opts['url']);
				if (opts.failure_callback) {
					opts.failure_callback(null, msg, exc);
				}
				if (opts.failure_event_type) {
					// jQuery().trigger(opts.failure_event_type, [{'url':opts.url, 'xhr':null, 'msg':'Unknown Error'}]);
					stwit.triggerEvent(opts.failure_event_type, {'url':opts.url, 'xhr':xhr, 'msg':'Unknown Error'});
					
				}
            }
			// jQuery().trigger('spaztwit_ajax_error', [{'url':opts.url, 'xhr':xhr, 'msg':msg}]);
			stwit.triggerEvent('spaztwit_ajax_error', {'url':opts.url, 'xhr':xhr, 'msg':msg});
			
			if (opts.processing_opts && opts.processing_opts.combined) {
				sc.helpers.dump('adding to combined processing errors');
				stwit.combined_errors.push( {'url':opts.url, 'xhr':xhr, 'msg':msg, 'section':opts.processing_opts.section} );
				stwit.combined_finished[opts.processing_opts.section] = true;
				sc.helpers.dump(stwit.combined_errors);
				sc.helpers.dump(stwit.combined_finished);
				if (opts.process_callback) {
					opts.process_callback.call(stwit, [], opts, opts.processing_opts);
				}
			}
			
        },
        'success':function(data) {
			// sc.helpers.dump("Success! \n\n" + data);
			sc.helpers.dump(opts.url + ' success!'+" data:"+data);
			
			try {
				data = sc.helpers.deJSON(data);
			} catch(e) {
				stwit.triggerEvent(document, opts.failure_event_type, {'url':opts.url, 'xhr':xhr, 'msg':'Error decoding data from server'});
			}

			if (opts.process_callback) {
				/*
					using .call here and passing stwit as the first param
					ensures that "this" inside the callback refers to our
					SpazTwit object, and not the jQuery.Ajax object
				*/
				opts.process_callback.call(stwit, data, opts, opts.processing_opts);
			} else {
				if (opts.success_callback) {
					sch.error('CALLING SUCCESS CALLBACK');
					opts.success_callback(data);
				}
				// jQuery().trigger(opts.success_event_type, [data]);
				stwit.triggerEvent(opts.success_event_type, data);
			}			
        },
        'beforeSend':function(xhr){
			sc.helpers.dump("beforesend");
            xhr.setRequestHeader('Authorization', stwit.auth.signRequest(opts.method, opts.url, opts.data));
        },
        'type': 	opts.method,
        'url': 		opts.url,
        'data': 	opts.data,
		'dataType':'text'
	});
	
	return xhr;
};



/**
 * general processor for timeline data 
 * @private
 */
SpazTwit.prototype._processTimeline = function(section_name, ret_items, opts, processing_opts) {
	
	sch.debug(opts);
	
	if (!processing_opts) { processing_opts = {}; }

	if (section_name !== SPAZCORE_SECTION_USER) { // the user timeline section isn't persistent
		/*
			reset .newitems data properties
		*/
		this.data[section_name].newitems = [];
		
	}
	

	if (ret_items.length > 0){
		
		
		/*
			we process each item, adding some attributes and generally making it cool
		*/
		for (var k=0; k<ret_items.length; k++) {
			ret_items[k] = this._processItem(ret_items[k], section_name);
		}


		/*
			sort items
		*/
		ret_items.sort(this._sortItemsAscending);
		
		
		if (section_name === SPAZCORE_SECTION_USER) { // special case -- we don't keep this data, just parse and fire it off

			if (opts.success_callback) {
				opts.success_callback(ret_items);
			}

			this.triggerEvent(opts.success_event_type, ret_items);
			
		} else { // this is a "normal" timeline that we want to be persistent
			
			if (opts.is_update_item) {
				/*
					we do not want this to be the lastid, instead remember it in combined.updates
				*/
				this.combinedTimelineAddUpdates(ret_items);
			} else {
				// set lastid
				var lastid = ret_items[ret_items.length-1].id;
				this.data[section_name].lastid = lastid;
				sc.helpers.dump('this.data['+section_name+'].lastid:'+this.data[section_name].lastid);
			}

			// add new items to data.newitems array
			this.data[section_name].newitems = ret_items;

			this._addToSectionItems(section_name, this.data[section_name].newitems);


			// @todo check length of data.items, and remove oldest extras if necessary
			/*
				@todo
			*/

			/*
				Fire off the new section data event
			*/
			if (!processing_opts.combined) {
				
				if (opts.success_callback) {
					opts.success_callback(this.data[section_name].newitems);
				}
				
				this.triggerEvent(opts.success_event_type, this.data[section_name].items);
			} else {
				this.combined_finished[section_name] = true;
				sc.helpers.dump("this.combined_finished["+section_name+"]:"+this.combined_finished[section_name]);
			}
			


			/*
				add on to newitems array for combined section
			*/
			this.data[SPAZCORE_SECTION_COMBINED].newitems = this.data[SPAZCORE_SECTION_COMBINED].newitems.concat(this.data[section_name].newitems);
			
		}


	} else { // no new items, but we should fire off success anyway
		if (!processing_opts.combined) {
			// jQuery().trigger(finished_event, []);
			if (opts.success_callback) {
				opts.success_callback();
			}
			this.triggerEvent(opts.success_event_type);
			
		} else {
			this.combined_finished[section_name] = true;
		}
	}
	
	/*
		Fire off the new combined data event
	*/
	if (this.combinedTimelineFinished()) {
		
		/*
			Remove those updates from combined newitems
		*/
		this.combinedNewItemsRemoveUpdates();

		/*
			we do this stuff here to avoid processing repeatedly
		*/
		
		this._addToSectionItems(SPAZCORE_SECTION_COMBINED, this.data[SPAZCORE_SECTION_COMBINED].newitems, this._sortItemsByDateAsc);
		
		// sort these items -- the timelines can be out of order when combined

		
		// sc.helpers.dump('Removing duplicates in '+SPAZCORE_SECTION_COMBINED+' newitems');
		// 
		this.data[SPAZCORE_SECTION_COMBINED].newitems = this._cleanupItemArray(this.data[SPAZCORE_SECTION_COMBINED].newitems, this.data[SPAZCORE_SECTION_COMBINED].max, this._sortItemsByDateAsc);
		
		if (this.combinedTimelineHasErrors()) {
			if (opts.failure_callback) {
				opts.failure_callback(this.combined_errors);
			}
			
			this.triggerEvent('error_combined_timeline_data', this.combined_errors);
		}
		
		if (opts.success_callback) {
			opts.success_callback(this.data[SPAZCORE_SECTION_COMBINED].newitems);
		}
		sch.debug('this.data[SPAZCORE_SECTION_COMBINED].newitems has '+this.data[SPAZCORE_SECTION_COMBINED].newitems.length+' items');
		this.triggerEvent('new_combined_timeline_data', this.data[SPAZCORE_SECTION_COMBINED].newitems);
		this.data[SPAZCORE_SECTION_COMBINED].newitems = []; // reset combined.newitems
		this.initializeCombinedTracker();
	}
};


/**
 * Adds an array of items to the .items property of the appropriate section, then
 * removes dupes, extras, and optionally sorts the section items
 * @param {string} section_name
 * @param {array}  arr  an array of items
 * @param {function}  sortfunc - optional 
 */
SpazTwit.prototype._addToSectionItems = function(section_name, arr, sortfunc) {
	// concat new items onto data.items array
	var data = this.data[section_name];
	data.items = this._cleanupItemArray(data.items.concat(arr), null, sortfunc);
};

/**
 * Sorts (optionally), removes dupes, and removes extra items from a given
 * array of section items
 * 
 * @param {array} arr
 * @param {max} integer
 * @param {func} sortfunc - optional
 * 
 * @return {array} 
 */
SpazTwit.prototype._cleanupItemArray = function(arr, max, sortfunc) {
	if (sortfunc) {
		arr = arr.sort(sortfunc);
	}
	arr = this.removeDuplicates(arr);
	sch.debug('NOT removing extras -- we don\'t do that anymore');
	// arr = this.removeExtraElements(arr, max);
	return arr;
};

/**
 * This modifies a Twitter post, adding some properties. All new properties are
 * prepended with "SC_"
 * 
 * this executes within the jQuery.each scope, so this === the item 
 */
SpazTwit.prototype._processItem = function(item, section_name) {
	
	item.SC_timeline_from = section_name;
	if (this.username) {
		item.SC_user_received_by = this.username;
	}
	
	/*
		is reply? Then add .SC_is_reply
	*/
	if ( (item.in_reply_to_screen_name && item.SC_user_received_by) ) {
		if (item.in_reply_to_screen_name.toLowerCase() === item.SC_user_received_by.toLowerCase() ) {
			item.SC_is_reply = true;
		}
	}
	
	/*
		is an official API retweet? then add .SC_is_retweet
	*/
	if ( item.retweeted_status ) {
		item.SC_is_retweet = true;
	}
	
	/*
		If it comes from the replies timeline, it's a reply (aka a mention)
	*/
	if (section_name === SPAZCORE_SECTION_REPLIES) {
		item.SC_is_reply = true;
	}
	
	/*
		Does it contain my name? then it's a reply
	*/
	if (this.username && sc.helpers.containsScreenName(item.text, this.username) ) {
		item.SC_is_reply = true;
	}
	
	/*
		is dm?
	*/
	if (item.recipient_id && item.sender_id) {
		item.SC_is_dm = true;
	}
	
	
	/*
		add unix timestamp .SC_created_at_unixtime for easier date comparison
	*/
	if (!item.SC_created_at_unixtime) {
		item.SC_created_at_unixtime = sc.helpers.httpTimeToInt(item.created_at);
	}
	
	/*
		add raw text .SC_raw_text for unmodified text
	*/
	if (!item.SC_text_raw) {
		item.SC_text_raw = item.text;
	}
	
	/*
		add "in_reply_to_screen_name" if it does not exist
	*/
	if (!item.in_reply_to_screen_name && item.in_reply_to_user_id) {
		/**
		 * @todo get this from the Spaz code 
		 */
	}
	
	/*
		add .SC_retrieved_unixtime
	*/
	if (!item.SC_retrieved_unixtime) {
		item.SC_retrieved_unixtime = sc.helpers.getTimeAsInt();
	}
	
	return item;
};



/**
 * This modifies a Twitter post, adding some properties. All new properties are
 * prepended with "SC_"
 * 
 * this executes within the jQuery.each scope, so this === the item 
 */
SpazTwit.prototype._processUser = function(item, section_name) {
	
	item.SC_timeline_from = section_name;
	if (this.username) {
		item.SC_user_received_by = this.username;
	}
	
	
	if (section_name === SPAZCORE_SECTION_FOLLOWERSLIST) {
		item.SC_is_follower;
	}
	if (section_name === SPAZCORE_SECTION_FRIENDLIST) {
		item.SC_is_followed;
	}
	
	/*
		add unix timestamp .SC_created_at_unixtime for easier date comparison
	*/
	if (!item.SC_created_at_unixtime) {
		item.SC_created_at_unixtime = sc.helpers.httpTimeToInt(item.created_at);
	}
	
	/*
		add .SC_retrieved_unixtime
	*/
	if (!item.SC_retrieved_unixtime) {
		item.SC_retrieved_unixtime = sc.helpers.getTimeAsInt();
	}
	
	return item;
};


/**
 * returns the header string for oAuth Echo usage
 */
SpazTwit.prototype.getEchoHeader = function(opts) {
	var url = this.getAPIURL('verify_credentials');
	var method = 'GET';

	var auth_header = this.auth.signRequest(method, url, null);

	return auth_header;
};


/**
 * this is a general wrapper for non-timeline methods on the Twitter API. We
 * use this to call methods that will return a single response 
 * 
 * @param {obj} opts a set of options for this method 
 * @param {string} opts.url The url for the request
 * @param {string} [opts.method] the HTTP method to use. default is POST
 * @param {number} [opts.timeout] the timeout for the request. default is 60 seconds
 * @param {object} [opts.data] data to pass with the request
 * @param {string} [opts.username]
 * @param {string} [opts.password]
 * @param {function} [opts.process_callback] a function to call on the retured data for extra processing on success
 * @param {string} [opts.success_event_type] the event to trigger on success
 * @param {string} [opts.failure_event_type] the event to trigger on failure
 * @param {function} [opts.success_callback] a callback to fire on success
 * @param {function} [opts.failure_callback] a callback to fire on failure
 */
SpazTwit.prototype._callMethod = function(opts) {
	
	opts = sch.defaults({
		'method':'POST',
		'timeout':this.DEFAULT_TIMEOUT,
		'url':null,
		'data':null,
		'process_callback':null,
		'success_event_type':null,
		'failure_event_type':null,
		'success_callback':null,
		'failure_callback':null
	}, opts);
	
	var method;
	
	/*
		for closure references
	*/
	var stwit = this;
	
	if (opts.method) {
		method = opts.method;
	} else {
		method = 'POST';
	}
	
	var xhr = jQuery.ajax({
		'timeout' :this.opts.timeout,
	    'complete':function(xhr, msg){
	        sc.helpers.dump(opts.url + ' complete:'+msg);
	    },
	    'error':function(xhr, msg, exc) {
			sc.helpers.dump(opts.url + ' error:'+msg);
	        if (xhr) {
				if (!xhr.readyState < 4) {
					sc.helpers.dump("Error:"+xhr.status+" from "+opts['url']);
					if (xhr.responseText) {
						try {
							var data = sc.helpers.deJSON(xhr.responseText);
						} catch(e) {
							sc.helpers.dump(e.name + ":" + e.message);
							data = xhr.responseText;
						}
					}
				}
				if (opts.failure_callback) {
					opts.failure_callback(xhr, msg, exc);
				}
				if (opts.failure_event_type) {
					// jQuery().trigger(opts.failure_event_type, [{'url':opts.url, 'xhr':xhr, 'msg':msg}]);
					stwit.triggerEvent(opts.failure_event_type, {'url':opts.url, 'xhr':xhr, 'msg':msg});
				}
	
	        } else {
	            sc.helpers.dump("Error:Unknown from "+opts['url']);
				if (opts.failure_callback) {
					opts.failure_callback(null, msg, exc);
				}
				if (opts.failure_event_type) {
					// jQuery().trigger(opts.failure_event_type, [{'url':opts.url, 'xhr':null, 'msg':'Unknown Error'}]);
					stwit.triggerEvent(opts.failure_event_type, {'url':opts.url, 'xhr':null, 'msg':'Unknown Error'});

				}
	        }
			// jQuery().trigger('spaztwit_ajax_error', [{'url':opts.url, 'xhr':xhr, 'msg':msg}]);
			stwit.triggerEvent('spaztwit_ajax_error', {'url':opts.url, 'xhr':xhr, 'msg':msg});
	    },
	    'success':function(data) {
			sc.helpers.dump(opts.url + ' success');
			data = sc.helpers.deJSON(data);
			if (opts.process_callback) {
				/*
					using .call here and passing stwit as the first param
					ensures that "this" inside the callback refers to our
					SpazTwit object, and not the jQuery.Ajax object
				*/
				opts.process_callback.call(stwit, data, opts);
			} else {
				if (opts.success_callback) {
					opts.success_callback(data);
				}
				// jQuery().trigger(opts.success_event_type, [data]);
				stwit.triggerEvent(opts.success_event_type, data);
				
			}
	    },
	    'beforeSend':function(xhr){
			sc.helpers.dump(opts.url + ' beforesend');
            xhr.setRequestHeader('Authorization', stwit.auth.signRequest(method, opts.url, opts.data));
	    },
	    'type': method,
	    'url' : opts.url,
		'data': opts.data,
		'dataType':'text'
	});
	return xhr;
};



SpazTwit.prototype.getUser = function(user_id, onSuccess, onFailure) {
	var data = {};
	data['id'] = user_id;
	
	var url = this.getAPIURL('show_user', data);
	
	var opts = {
		'url':url,
		// 'process_callback': this._processUserData,
		'success_event_type':'get_user_succeeded',
		'failure_event_type':'get_user_failed',
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'method':'GET'
	};

	/*
		Perform a request and get true or false back
	*/
	var xhr = this._callMethod(opts);
};



SpazTwit.prototype.getFriendsList = function() {
	
	var url = this.getAPIURL('friendslist');
	
	var opts = {
		'url':url,
		'process_callback': this._processFriendsList,
		'success_event_type':'get_friendslist_succeeded',
		'failure_event_type':'get_friendslist_failed',
		'method':'GET'
	};

	var xhr = this._getTimeline(opts);
};
/**
 * @private
 */
SpazTwit.prototype._processFriendsList = function(ret_items, opts, processing_opts) {
	this._processUserList(SPAZCORE_SECTION_FRIENDLIST, ret_items, opts.success_event_type, processing_opts);
};






SpazTwit.prototype.getFollowersList = function() {
	var url = this.getAPIURL('followerslist');
	
	var opts = {
		'url':url,
		'process_callback': this._processFollowersList,
		'success_event_type':'get_followerslist_succeeded',
		'failure_event_type':'get_followerslist_failed',
		'method':'GET'
	};

	var xhr = this._getTimeline(opts);
};
/**
 * @private
 */
SpazTwit.prototype._processFollowersList = function(ret_items, opts, processing_opts) {
	this._processUserList(SPAZCORE_SECTION_FOLLOWERSLIST, ret_items, opts.success_event_type, processing_opts);
};



/**
 * general processor for timeline data 
 * @private
 */
SpazTwit.prototype._processUserList = function(section_name, ret_items, opts, processing_opts) {
	
	if (!processing_opts) { processing_opts = {}; }

	if (ret_items.length > 0){
		/*
			we process each item, adding some attributes and generally making it cool
		*/
		for (var k=0; k<ret_items.length; k++) {
			ret_items[k] = this._processUser(ret_items[k], section_name);
			sch.dump(ret_items[k]);
		}

		/*
			sort items
		*/
		ret_items.sort(this._sortItemsAscending);
		
			
		// set lastid
		var lastid = ret_items[ret_items.length-1].id;
		this.data[section_name].lastid = lastid;
		sc.helpers.dump('this.data['+section_name+'].lastid:'+this.data[section_name].lastid);

		// add new items to data.newitems array
		this.data[section_name].newitems = ret_items;

		this._addToSectionItems(section_name, this.data[section_name].newitems);

		if (opts.success_callback) {
			opts.success_callback(this.data[section_name].newitems);
		}
		this.triggerEvent(opts.success_event_type,this.data[section_name].newitems );

	} else { // no new items, but we should fire off success anyway
		if (opts.success_callback) {
			opts.success_callback();
		}
		this.triggerEvent(opts.success_event_type);
	}

};


SpazTwit.prototype.addFriend = function(user_id, onSuccess, onFailure) {
	var data = {};
	data['id'] = user_id;
	
	var url = this.getAPIURL('friendship_create', data);
	
	var opts = {
		'url':url,
		'success_event_type':'create_friendship_succeeded',
		'failure_event_type':'create_friendship_failed',
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'data':data
	};

	/*
		Perform a request and get true or false back
	*/
	var xhr = this._callMethod(opts);
};
SpazTwit.prototype.removeFriend = function(user_id, onSuccess, onFailure) {
	var data = {};
	data['id'] = user_id;
	
	var url = this.getAPIURL('friendship_destroy', data);
	
	var opts = {
		'url':url,
		'success_event_type':'destroy_friendship_succeeded',
		'failure_event_type':'destroy_friendship_failed',
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'data':data
	};

	/*
		Perform a request and get true or false back
	*/
	var xhr = this._callMethod(opts);

};

SpazTwit.prototype.block = function(user_id, onSuccess, onFailure) {
	var data = {};
	data['id'] = user_id;
	
	var url = this.getAPIURL('block_create', data);
	
	var opts = {
		'url':url,
		'success_event_type':'create_block_succeeded',
		'failure_event_type':'create_block_failed',
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'data':data
	};

	/*
		Perform a request and get true or false back
	*/
	var xhr = this._callMethod(opts);
};
SpazTwit.prototype.unblock = function(user_id, onSuccess, onFailure) {
	var data = {};
	data['id'] = user_id;
	
	var url = this.getAPIURL('block_destroy', data);
	
	var opts = {
		'url':url,
		'success_event_type':'destroy_block_succeeded',
		'failure_event_type':'destroy_block_failed',
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'data':data
	};

	/*
		Perform a request and get true or false back
	*/
	var xhr = this._callMethod(opts);

};

SpazTwit.prototype.follow = function(user_id, onSuccess, onFailure) { // to add notification
	var data = {};
	data['id'] = user_id;
	
	var url = this.getAPIURL('follow', data);
	
	var opts = {
		'url':url,
		'username':this.username,
		'password':this.password,
		'success_event_type':'follow_succeeded',
		'failure_event_type':'follow_failed',
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'data':data
	};

	/*
		Perform a request and get true or false back
	*/
	var xhr = this._callMethod(opts);
    
};

SpazTwit.prototype.unfollow = function(user_id, onSuccess, onFailure) { // to remove notification
	var data = {};
	data['id'] = user_id;
	
	var url = this.getAPIURL('unfollow', data);
	
	var opts = {
		'url':url,
		'username':this.username,
		'password':this.password,
		'success_event_type':'unfollow_succeeded',
		'failure_event_type':'unfollow_failed',
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'data':data
	};

	/*
		Perform a request and get true or false back
	*/
	var xhr = this._callMethod(opts);
    
};


SpazTwit.prototype.update = function(status, source, in_reply_to_status_id, onSuccess, onFailure) {

	var url = this.getAPIURL('update');
	
	var data = {};
	if (in_reply_to_status_id) {
		data.in_reply_to_status_id = in_reply_to_status_id;
	}
	if (source) {
		data.source = source;
	} else {
		data.source = this.source;
	}
	data.status = status;
	
	var opts = {
		'url':url,
		'data':data,
		'process_callback': this._processUpdateReturn,
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'success_event_type':'update_succeeded',
		'failure_event_type':'update_failed'
	};

	/*
		Perform a request and get true or false back
	*/
	var xhr = this._callMethod(opts);

	
};

SpazTwit.prototype._processUpdateReturn = function(data, opts) {
	
	/*
		Add this to the HOME section and fire off the event when done
	*/	
	opts.is_update_item = true;
	this._processTimeline(SPAZCORE_SECTION_HOME, [data], opts);
};

/**
 * destroy/delete a status
 * @param {Number|String} id the id of the status 
 */
SpazTwit.prototype.destroy = function(id, onSuccess, onFailure) {
	var data = {};
	data['id'] = id;
	
	var url = this.getAPIURL('destroy_status', data);
	
	var opts = {
		'url':url,
		'data':data,
		'success_event_type':'destroy_status_succeeded',
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'failure_event_type':'destroy_status_failed'
	};

	/*
		Perform a request and get true or false back
	*/
	var xhr = this._callMethod(opts);
};

/**
 * destroy/delete a direct message
 * @param {Number|String} id the id of the status 
 */
SpazTwit.prototype.destroyDirectMessage = function(id, onSuccess, onFailure) {
	var data = {};
	data['id'] = id;
	
	var url = this.getAPIURL('dm_destroy', data);
	
	var opts = {
		'url':url,
		'data':data,
		'success_event_type':'destroy_dm_succeeded',
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'failure_event_type':'destroy_dm_failed'
	};

	/*
		Perform a request and get true or false back
	*/
	var xhr = this._callMethod(opts);
};


SpazTwit.prototype.getOne = function(id, onSuccess, onFailure) {
	var data = {};
	data['id'] = id;
	
	var url = this.getAPIURL('show', data);
	
	var opts = {
		'url':url,
		'process_callback': this._processOneItem,
		'success_event_type':'get_one_status_succeeded',
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'failure_event_type':'get_one_status_failed',
		'method':'GET'
	};

	/*
		Perform a request and get true or false back
	*/
	var xhr = this._callMethod(opts);
};


SpazTwit.prototype._processOneItem = function(data, opts) {
	
	/*
		this item needs to be added to the friends timeline
		so we can avoid dupes
	*/
	data = this._processItem(data);
	if (opts.success_callback) {
		opts.success_callback(data);
	}
	this.triggerEvent(opts.success_event_type, data);
	
};

// Retweet API

/*
 * Retweets a tweet.
 * id: the numeric id of a tweet
 */
 
SpazTwit.prototype.retweet = function(id, onSuccess, onFailure) {
	var data = {};
	data['id'] = id;
	
	var url = this.getAPIURL('retweet', data);
	
	var opts = {
		'url' : url,
		'username' : this.username,
		'password' : this.password,
		'success_event_type' : 'retweet_succeeded',
		'failure_event_type' : 'retweet_failed',
		'success_callback' : onSuccess,
		'failure_callback' : onFailure,
		'data' : data
	};
	
	var xhr = this._callMethod(opts);
};

/*
 * Gets up to 100 of the latest retweets of a tweet.
 * id: the tweet to get retweets of
 * count: the number of retweets to get
 */

SpazTwit.prototype.getRetweets = function(id, count) {
	var url = this.getAPIURL('retweets', {
		'id' : id,
		'count' : count
	});
	
	var opts = {
		'url' : url,
		'username' : this.username,
		'password' : this.password,
		'success_event_type' : 'get_retweets_succeeded',
		'failure_event_Type' : 'get_retweets_failed',
		'method' : 'GET'
	};
	
	var xhr = this._getTimeline(opts);
};

/*
 * Returns up to 200 of the most recent retweets by the user
 * since: the numeric id of the tweet serving as a floor
 * max: the numeric id of the tweet serving as a ceiling
 * count: the number of tweets to return. Cannot be over 200.
 * page: the page of results to return.
 */
 
SpazTwit.prototype.retweetedByMe = function(since, max, count, page){
	var params = {};
	if(since != null){
		params['since_id'] = since;
	}
	if(max != null){
		params['max_id'] = max;
	}
	if(count == null){
		count = 20;
	}
	params['count'] = count;
	if(page == null){
		page = 1;
	}
	params['page'] = page;
	var url = this.getAPIURL('retweeted_by_me', params);
	
	var opts = {
		'url' : url,
		'username' : this.username,
		'password' : this.password,
		'success_event_type' : 'retweeted_by_me_succeeded',
		'failure_event_type' : 'retweeted_by_me_failed',
		'method' : 'GET'
	};
	
	var xhr = this._getTimeline(opts);
};

/*
 * Returns up to 200 of the most recent retweets by the user's friends
 * since: the numeric id of the tweet serving as a floor
 * max: the numeric id of the tweet serving as a ceiling
 * count: the number of tweets to return. Cannot be over 200.
 * page: the page of results to return.
 */
 
SpazTwit.prototype.retweetedToMe = function(since, max, count, page){
	var params = {};
	if(since != null){
		params['since_id'] = since;
	}
	if(max != null){
		params['max_id'] = max;
	}
	if(count == null){
		count = 20;
	}
	params['count'] = count;
	if(page == null){
		page = 1;
	}
	params['page'] = page;
	var url = this.getAPIURL('retweeted_to_me', params);
	
	var opts = {
		'url' : url,
		'username' : this.username,
		'password' : this.password,
		'success_event_type' : 'retweeted_to_me_succeeded',
		'failure_event_type' : 'retweeted_to_me_failed',
		'method' : 'GET'
	};
	
	var xhr = this._getTimeline(opts);
};

/*
 * Returns up to 200 of the most recent retweets of the user's tweets
 * since: the numeric id of the tweet serving as a floor
 * max: the numeric id of the tweet serving as a ceiling
 * count: the number of tweets to return. Cannot be over 200.
 * page: the page of results to return.
 */
 
SpazTwit.prototype.retweetsOfMe = function(since, max, count, page){
	var params = {};
	if(since != null){
		params['since_id'] = since;
	}
	if(max != null){
		params['max_id'] = max;
	}
	if(count == null){
		count = 20;
	}
	params['count'] = count;
	if(page == null){
		page = 1;
	}
	params['page'] = page;
	var url = this.getAPIURL('retweets_of_me', params);
	
	var opts = {
		'url' : url,
		'username' : this.username,
		'password' : this.password,
		'success_event_type' : 'retweets_of_me_succeeded',
		'failure_event_type' : 'retweets_of_me_failed',
		'method' : 'GET'
	};
	
	var xhr = this._getTimeline(opts);
};

SpazTwit.prototype.favorite = function(id, onSuccess, onFailure) {
	var data = {};
	data['id'] = id;
	
	var url = this.getAPIURL('favorites_create', data);
	
	var opts = {
		'url':url,
		'success_event_type':'create_favorite_succeeded',
		'failure_event_type':'create_favorite_failed',
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'data':data
	};

	/*
		Perform a request and get true or false back
	*/
	var xhr = this._callMethod(opts);
};

SpazTwit.prototype.unfavorite = function(id, onSuccess, onFailure) {
	var data = {};
	data['id'] = id;
	
	var url = this.getAPIURL('favorites_destroy', data);
	
	var opts = {
		'url':url,
		'success_event_type':'destroy_favorite_succeeded',
		'failure_event_type':'destroy_favorite_failed',
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'data':data
	};

	/*
		Perform a request and get true or false back
	*/
	var xhr = this._callMethod(opts);
};




SpazTwit.prototype.updateLocation = function(location_str, onSuccess, onFailure) {
	var data = {};
	data.location = location_str;
	
	this.setBaseURL(SPAZCORE_SERVICEURL_TWITTER);
	
	var url = this.getAPIURL('update_profile');
	
	var opts = {
		'url':url,
		'success_event_type':'update_location_succeeded',
		'failure_event_type':'update_location_failed',
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'data':data
	};

	/*
		Perform a request and get true or false back
	*/
	var xhr = this._callMethod(opts);
};

SpazTwit.prototype.updateProfile = function(name, email, url, location, description) {
	
};



/**
 * get the current rate limit status
 * @param {Function} onSuccess callback for success 
 * @param {Function} onFailure callback for failure 
 */
SpazTwit.prototype.getRateLimitStatus = function(onSuccess, onFailure) {
	
	var url = this.getAPIURL('ratelimit_status');
	
	var opts = {
		'method':'GET',
		'url':url,
		'success_event_type':'ratelimit_status_succeeded',
		'failure_event_type':'ratelimit_status_failed',
		'success_callback':onSuccess,
		'failure_callback':onFailure
	};

	/*
		Perform a request and get true or false back
	*/
	var xhr = this._callMethod(opts);
	
};

SpazTwit.prototype.test = function() {};


/**
 * @private 
 */
SpazTwit.prototype._postProcessURL = function(url) {
	
	if (typeof Mojo !== "undefined") { // we're in webOS		
		if (use_palmhost_proxy) { // we are not on an emu or device, so proxy calls
			var re = /https?:\/\/.[^\/:]*(?::[0-9]+)?/;
			var match = url.match(re);
			if (match && match[0] !== Mojo.hostingPrefix) {
				url = "/proxy?url=" + encodeURIComponent(url);
			}
			return url;		
		} else {
			return url;
		}
		
	} else {
		return url;
	}
};


/**
 * sorting function for an array of tweets. Asc by ID.
 * 
 * Example: itemsarray.sort(this._sortItemsAscending) 
 * @param {object} a a twitter message object
 * @param {object} b a twitter message object
 * @return {integer}
 * @private
 */
SpazTwit.prototype._sortItemsAscending = function(a,b) {
	return (a.id - b.id);
};

/**
 * sorting function for an array of tweets. Desc by ID.
 * 
 * Example: itemsarray.sort(this._sortItemsDescending) 
 * @param {object} a a twitter message object
 * @param {object} b a twitter message object
 * @return {integer}
 * @private
 */
SpazTwit.prototype._sortItemsDescending = function(a,b) {
	return (b.id - a.id);
};



/**
 * sorting function for an array of tweets. Asc by date.
 * 
 * requires SpazCore helpers/datetime.js for httpTimeToInt()
 * 
 * Example: itemsarray.sort(this._sortItemsByDateAsc) 
 * @param {object} a a twitter message object
 * @param {object} b a twitter message object
 * @return {integer}
 * @private
 */
SpazTwit.prototype._sortItemsByDateAsc = function(a,b) {
	var time_a = sc.helpers.httpTimeToInt(a.created_at);
	var time_b = sc.helpers.httpTimeToInt(b.created_at);
	return (time_a - time_b);
};

/**
 * sorting function for an array of tweets. Desc by date.
 * 
 * requires SpazCore helpers/datetime.js for httpTimeToInt()
 * 
 * Example: itemsarray.sort(this._sortItemsByDateDesc)
 * @param {object} a a twitter message object
 * @param {object} b a twitter message object 
 * @return {integer}
 * @private
 */
SpazTwit.prototype._sortItemsByDateDesc = function(a,b) {
	var time_a = sc.helpers.httpTimeToInt(a.created_at);
	var time_b = sc.helpers.httpTimeToInt(b.created_at);
	return (time_b - time_a);
};


/**
 * this takes an array of messages and returns one with any duplicates removed
 * 
 * This is based on the jQuery.unique() method
 * 
 * @param {array} array an array of Twitter message objects
 * @return {array}
 */
SpazTwit.prototype.removeDuplicates = function(arr) {
	
	var ret = [], done = {}, length = arr.length;

	try {
		for ( var i = 0; i < length; i++ ) {
			var id = arr[i].id;
			
			if ( !done[ id ] ) {
				done[ id ] = true;
				ret.push( arr[ i ] );
			} else {
				sc.helpers.dump("removing dupe " + arr[i].id + ', "'+arr[i].text+'"');
			}
		}

	} catch( e ) {
		sc.helpers.dump(e.name + ":" + e.message);
		ret = arr;
	}
	return ret;
	
};


/**
 * removes extra elements from a timeline array.
 * @param {array} items the timeline array
 * @param {integer} max the max # of items we should have
 * @param {boolean} remove_from_top whether or not to remove extra items from the top. default is FALSE 
 */
SpazTwit.prototype.removeExtraElements = function(items, max, remove_from_top) {
	
	if (!remove_from_top) {
		remove_from_top = false;
	}
	
	var diff = items.length - max;
	if (diff > 0) {
		
		if (!remove_from_top) {
			sc.helpers.dump("array length is " + items.length + " > " + max + "; removing last " + diff + " entries");
	        items.splice(diff * -1, diff);
		} else {
			sc.helpers.dump("array length is " + items.length + " > " + max + "; removing first " + diff + " entries");
	        items.splice(0, diff);
		}
	}
	
	return items;
};


/**
 * gets the saved searches the authenticating user has 
 */
SpazTwit.prototype.getSavedSearches = function(onSuccess, onFailure) {
	var url = this.getAPIURL('saved_searches');
	
	var opts = {
		'url':url,
		'success_event_type':'new_saved_searches_data',
		'failure_event_type':'error_saved_searches_data',
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'method':'GET'
	};

	/*
		Perform a request and get true or false back
	*/
	var xhr = this._callMethod(opts);
};

/**
 * Saves the search query to the Twitter servers
 * 
 * @param {String} search_query 
 */
SpazTwit.prototype.addSavedSearch = function(search_query, onSuccess, onFailure) {
	var url = this.getAPIURL('saved_searches_create');
	
	var opts = {
		'url':url,
		'success_event_type':'create_saved_search_succeeded',
		'failure_event_type':'create_saved_search_failed',
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'data':{'query':search_query},
		'method':'POST'
	};

	/*
		Perform a request and get true or false back
	*/
	var xhr = this._callMethod(opts);
	
};

/**
 * Delete the saved search corresponding to the given ID
 * 
 * @param {String} search_id  Note that this is converted to a string via search_id.toString()
 */
SpazTwit.prototype.removeSavedSearch = function(search_id, onSuccess, onFailure) {
	var url = this.getAPIURL('saved_searches_destroy', search_id.toString());
	
	var opts = {
		'url':url,
		'success_event_type':'destroy_saved_search_succeeded',
		'failure_event_type':'destroy_saved_search_failed',
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'data':{'id':search_id},
		'method':'POST'
	};
	
	sch.debug('opts for removeSavedSearch');
	sch.debug(opts);

	/*
		Perform a request and get true or false back
	*/
	var xhr = this._callMethod(opts);
	
};




/**
 * retrieves the list of lists 
 */
SpazTwit.prototype.getLists = function(user, onSuccess, onFailure) {
	if (!user && !this.username) {
		return;
	} else if (!user) {
	    user = this.username;
	}

	var url = this.getAPIURL('lists', {
	    'user':user
	});
	
	var opts = {
		'url':url,
		'success_event_type':'get_lists_succeeded',
		'failure_event_type':'get_lists_failed',
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'method':'GET'
	};

	var xhr = this._callMethod(opts);
};




/**
 * general processor for user lists data
 * @private
 */
SpazTwit.prototype._processUserLists = function(section_name, ret_items, opts, processing_opts) {
  
    if (!processing_opts) { processing_opts = {}; }

	if (ret_items.length > 0){
		/*
			we process each item, adding some attributes and generally making it cool
		*/
		for (var k=0; k<ret_items.length; k++) {
			ret_items[k] = this._processList(ret_items[k], section_name);
			sch.dump(ret_items[k]);
		}

		/*
			sort items
		*/
		ret_items.sort(this._sortItemsAscending);

		// set lastid
		var lastid = ret_items[ret_items.length-1].id;
		this.data[section_name].lastid = lastid;
		sc.helpers.dump('this.data['+section_name+'].lastid:'+this.data[section_name].lastid);

		// add new items to data.newitems array
		this.data[section_name].newitems = ret_items;

		this._addToSectionItems(section_name, this.data[section_name].newitems);

		if (opts.success_callback) {
			opts.success_callback(this.data[section_name].newitems);
		}
		this.triggerEvent(opts.success_event_type, this.data[section_name].newitems );

	} else { // no new items, but we should fire off success anyway
		
		if (opts.success_callback) {
			opts.success_callback();
		}
		this.triggerEvent(opts.success_event_type);
	}
};

/**
 * This modifies a Twitter user list, adding some properties. All new properties are
 * prepended with "SC_"
 * 
 * this executes within the jQuery.each scope, so this === the item 
 */
SpazTwit.prototype._processList = function(item, section_name) {	
	/*
		add .SC_retrieved_unixtime
	*/
	if (!item.SC_retrieved_unixtime) {
		item.SC_retrieved_unixtime = sc.helpers.getTimeAsInt();
	}
	
	return item;
};


/**
 * retrieves a given list timeline
 * @param {string} list 
 */
SpazTwit.prototype.getListInfo = function(list, user, onSuccess, onFailure) {
	if (!user && !this.username) {
		sch.error('must pass a username or have one set to get list');
		return;
	}
	
	user = user || this.username;

	var url = this.getAPIURL('lists_list', {
	    'user':user,
		'slug':list
	});
	
	var opts = {
		'url':url,
		'success_event_type':'get_list_succeeded',
		'failure_event_type':'get_list_failed',
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'method':'GET'
	};

	var xhr = this._callMethod(opts);
};


/**
 * retrieves a given list timeline
 * @param {string} list 
 * @param {string} user the user who owns this list
 * @param {function} [onSuccess] function to call on success
 * @param {function} [onFailure] function to call on failure
 */
SpazTwit.prototype.getListTimeline = function(list, user, onSuccess, onFailure) {
	if (!user && !this.username) {
		sch.error('must pass a username or have one set to get list');
		return;
	}
	
	user = user || this.username;

	var url = this.getAPIURL('lists_timeline', {
	    'user':user,
		'slug':list
	});
	
	var opts = {
		'url':url,
		'success_event_type':'get_list_timeline_succeeded',
		'failure_event_type':'get_list_timeline_failed',
		'success_callback':onSuccess,
		'failure_callback':onFailure,
		'method':'GET',
		'process_callback':this._processListTimeline,
		'processing_opts': {
			'user':user,
			'slug':list
		}
	};

	var xhr = this._getTimeline(opts);
};


SpazTwit.prototype._processListTimeline = function(data, opts, processing_opts) {
	if (!processing_opts) { processing_opts = {}; }
	
	var user = processing_opts.user || null;
	var slug = processing_opts.slug || null;
	
	var rdata = {
		'statuses':data,
		'user':user,
		'slug':slug
	};
	
	/*
		grab the array of items
	*/
	// jQuery().trigger(finished_event, [ret_items]);
	
	if (opts.success_callback) {
		opts.success_callback(rdata);
	}
	this.triggerEvent(opts.success_event_type, rdata);
};

/**
 * retrieves a given list's members
 * @param {string} list 
 */
SpazTwit.prototype.getListMembers = function(list, user) {
	if (!user && !this.username) {
		sch.error('must pass a username or have one set to get list');
		return;
	}
	
	user = user || this.username;

	var url = this.getAPIURL('lists_members', {
	    'user':user,
		'slug':list
	});
	
	var opts = {
		'url':url,
		'success_event_type':'get_list_members_succeeded',
		'failure_event_type':'get_list_members_failed',
		'method':'GET',
		'process_callback':this._processListTimeline,
		'processing_opts': {
			'user':user,
			'slug':list
		}
	};

	var xhr = this._getTimeline(opts);
};

/**
 * create a new list for the authenticated user
 * @param {string} list  The list name
 * @param {string} visibility   "public" or "private"
 * @param {string} [description]  The list description
 */
SpazTwit.prototype.addList = function(list, visibility, description) {
	var data = {};
	data['name'] = list;
	data['mode'] = visibility;
	data['description'] = description;
	
	var url = this.getAPIURL('lists', {
		'user': this.username
	});
	
	var opts = {
		'url':url,
		'success_event_type':'create_list_succeeded',
		'failure_event_type':'create_list_failed',
		'success_callback':null,
		'failure_callback':null,
		'data':data
	};
	
	var xhr = this._callMethod(opts);
};

SpazTwit.prototype.updateList = function(list, name, visibility, description){
	var data = {};
	data['name'] = name;
	data['mode'] = visibility;
	data['description'] = description;
	
	var url = this.getAPIURL('lists_list', {
		'user': this.username,
		'slug': list
	});
	
	var opts = {
		'url':url,
		'username':this.username,
		'password':this.password,
		'success_event_type':'update_list_succeeded',
		'failure_event_type':'update_list_failed',
		'data':data
	};
	
	var xhr = this._callMethod(opts);
};

/**
 * delete a list
 * @param {string} list  The list name 
 */
SpazTwit.prototype.removeList = function(list, user) {
	
	if (!user && !this.username) {
		sch.error('must pass a username or have one set to remove list');
		return;
	}
	
	user = user || this.username;
	
	var url = this.getAPIURL('lists_list', {
		'user': user,
		'slug':list
	});
	
	var opts = {
		'url':url,
		'success_event_type':'remove_list_succeeded',
		'failure_event_type':'remove_list_failed',
		'method':'DELETE'
	};
	
	var xhr = this._callMethod(opts);
};

/**
 * add a user to a list
 */
SpazTwit.prototype.addUserToList = function(user, list, list_user) {
	var data = {};
	data['list_id'] = list;
	data['id'] = list_user;
	
	
	if (!user && !this.username) {
		sch.error('must pass a username or have one set to add a user to a list');
		return;
	}
	
	user = user || this.username;
	
	var url = this.getAPIURL('lists_members', {
		'user': user,
		'slug': list
	});
	
	var opts = {
		'url':url,
		'success_event_type':'create_list_succeeded',
		'failure_event_type':'create_list_failed',
		'success_event_type':'add_list_user_succeeded',
		'failure_event_type':'add_list_user_failed',
		'data':data
	};
	
	var xhr = this._callMethod(opts);
};

/**
 * delete a user from a list 
 */
SpazTwit.prototype.removeUserFromList = function(user, list, list_user) {
	var data = {};
	data['list_id'] = list;
	data['id'] = list_user;
	
	
	if (!user && !this.username) {
		sch.error('must pass a username or have one set to remove a user from a list');
		return;
	}
	
	user = user || this.username;
	
	var url = this.getAPIURL('lists_members', {
		'user': user,
		'slug': list
	});
	
	var opts = {
		'url':url,
		'success_event_type':'create_list_succeeded',
		'failure_event_type':'create_list_failed',
		'success_event_type':'remove_list_user_succeeded',
		'failure_event_type':'remove_list_user_failed',
		'data':data,
		'method':'DELETE'
	};
	
	var xhr = this._callMethod(opts);
};


SpazTwit.prototype.listsSubscribedTo = function(user) {
	if(!user && !this.username) {
		sch.error('must pass a username or have one set to retrieve subscribed lists');
		return false;
	}
	
	user = user || this.username;
	
	var url = this.getAPIURL('lists_subscriptions', {
		'user': user
	});
	
	var opts = {
		'url':url,
		'username': this.username,
		'password': this.password,
		'success_event_type':'get_subscriptions_succeeded',
		'failure_event_type':'get_subscriptions_failed'
	};
	
	var xhr = this._callMethod(opts);
};

SpazTwit.prototype.listMemberships = function(user) {
	if(!user && !this.username) {
		sch.error('must pass a username or have one set to retrieve list memberships');
		return false;
	}
	
	user = user || this.username;
	
	var url = this.getAPIURL('lists_memberships', {
		'user': user
	});
	
	var opts = {
		'url':url,
		'username': this.username,
		'password': this.password,
		'success_event_type':'get_list_memberships_succeeded',
		'failure_event_type':'get_list_memberships_failed'
	};
	
	var xhr = this._callMethod(opts);
};

SpazTwit.prototype.getListSubscribers = function(list, user){
	if(!user && !this.username) {
		sch.error('must pass a username or have one set to retrieve list subscribers');
		return false;
	}
	
	user = user || this.username;
	
	var url = this.getAPIURL('lists_subscribers', {
		'user': user,
		'slug': list
	});
	
	var opts = {
		'url':url,
		'username': this.username,
		'password': this.password,
		'success_event_type':'get_list_subscribers_succeeded',
		'failure_event_type':'get_list_subscribers_failed',
		'method':'GET'
	};
	
	var xhr = this._callMethod(opts);
};

SpazTwit.prototype.isSubscribed = function(list, list_user, user){
	if(!user && !this.username) {
		sch.error('must pass a username or have one set to retrieve list subscribers');
		return false;
	}
	
	user = user || this.username;
	
	var url = this.getAPIURL('lists_check_subscriber', {
		'user': user,
		'slug': list,
		'id': list_user
	});
	
	var opts = {
		'url':url,
		'username': this.username,
		'password': this.password,
		'success_event_type':'check_list_subscribers_succeeded',
		'failure_event_type':'check_list_subscribers_failed',
		'method':'GET'
	};
	
	var xhr = this._callMethod(opts);
};

SpazTwit.prototype.subscribe = function(list, user){
	if(!user && !this.username) {
		sch.error('must pass a username or have one set to subscribe to a list');
		return false;
	}
	
	user = user || this.username;
	
	var url = this.getAPIURL('lists_subscribers', {
		'user': user,
		'slug': list
	});
	
	var opts = {
		'url':url,
		'username': this.username,
		'password': this.password,
		'success_event_type':'list_subscribe_succeeded',
		'failure_event_type':'list_subscribe_failed',
		'method':'POST'
	};
	
	var xhr = this._callMethod(opts);
};

SpazTwit.prototype.unsubscribe = function(list, user){
	if(!user && !this.username) {
		sch.error('must pass a username or have one set to unsubscribe');
		return false;
	}
	
	user = user || this.username;
	
	var url = this.getAPIURL('lists_subscribers', {
		'user': user,
		'slug': list,
		'id': list_user
	});
	
	var opts = {
		'url':url,
		'username': this.username,
		'password': this.password,
		'success_event_type':'list_unsubscribe_succeeded',
		'failure_event_type':'list_unsubscribe_failed',
		'method':'DELETE'
	};
	
	var xhr = this._callMethod(opts);
};

SpazTwit.prototype.isMember = function(list, list_user, user){
	if(!user && !this.username) {
		sch.error('must pass a username or have one set to retrieve list memberships');
		return false;
	}
	
	user = user || this.username;
	
	var url = this.getAPIURL('lists_check_member', {
		'user': user,
		'slug': list,
		'id': list_user
	});
	
	var opts = {
		'url':url,
		'username': this.username,
		'password': this.password,
		'success_event_type':'check_list_members_succeeded',
		'failure_event_type':'check_list_members_failed',
		'method':'GET'
	};
	
	var xhr = this._callMethod(opts);
};

/*
 * Marks a user as a spammer and blocks them
 */
 
SpazTwit.prototype.reportSpam = function(user) {
	var url = this.getAPIURL('report_spam');
	
	var data = {};
	data['screen_name'] = user;
	
	var opts = {
		'url':url,
		'username': this.username,
		'password': this.password,
		'success_event_type':'report_spam_succeeded',
		'failure_event_type':'report_spam_failed',
		'method':'POST',
		'data':data
	};
	
	var xhr = this._callMethod(opts);
};
/**
 *  
 */
SpazTwit.prototype.triggerEvent = function(type, data) {
	var target = this.opts.event_target || document;
	data   = data || null;
	
	sc.helpers.dump('TriggerEvent: target:'+target.toString()+ ' type:'+type+ ' data:'+data);
	
	if (this.opts.event_mode === 'jquery') {
		data = [data];
		jQuery(target).trigger(type, data);
	} else {
		sc.helpers.trigger(type, target, data);	
	}
	
};

/**
 * shortcut for SpazTwit if the SpazCore libraries are being used
 * 
 */
if (sc) {
	var scTwit = SpazTwit;
}

/*jslint 
browser: true,
nomen: false,
debug: true,
forin: true,
undef: true,
white: false,
onevar: false 
 */
var sc, DOMParser;
 
/**
 * the AIR version of this platform-specific helper file 
 */

/**
 * Gets the contents of a file
 */
sc.helpers.getFileContents = function(url) {
	var f = new air.File(url);
	sch.error(url);
	sch.error(f.url);
	if (f.exists) {
		var fs = new air.FileStream();
		fs.open(f, air.FileMode.READ);
		var str = fs.readMultiByte(f.size, air.File.systemCharset);
		fs.close();
		return str;
	} else {
		return false;
	}
};



/**
 * sets the file contents 
 */
sc.helpers.setFileContents = function(url, content, serialize) {
	
	if (serialize) {
		content = JSON.stringify(content);
	}
	
	sc.helpers.dump('setFileContents for '+url+ ' to "' +content+ '"');
	
	try { 
		var f = new air.File(url);
		var fs = new air.FileStream();
		fs.open(f, air.FileMode.WRITE);
		fs.writeUTFBytes(content);
		fs.close();
	} catch (e) {
		sc.helpers.error(e.name + ":" + e.message);
	}
};





/**
 * does fileurl exist
 */
sc.helpers.fileExists = function (url) {
	var f = new air.File(url);
	return f.exists;
};

/**
 * is given fileurl a file 
 */
sc.helpers.isFile = function (url) {
	var f = new air.File(url);
	return !f.isDirectory;
};

/**
 * is given fileurl a directory 
 */
sc.helpers.isDirectory = function (url) {
	var f = new air.File(url);
	return f.isDirectory;
};


/**
 * resolve a path against the given url 
 */
sc.helpers.resolvePath = function(url, rel_path) {
	var f = new air.File(url);
	return f.resolvePath(rel_path).url;

};

/**
 * Returns the native file object 
 */
sc.helpers.getFileObject = function(url) {
	return new air.File(url);
};

/**
 * copy a file 
 */
sc.helpers.copyFile = function(url, dest_url) {
	var f = new air.File(url);
	sch.error(f.url);
	var fnew = new air.File(dest_url);
	sch.error(fnew.url);
	f.copyTo(fnew, true);
};

/**
 * move a file 
 */
sc.helpers.moveFile = function(url, dest_url) {
	var f = new air.File(url);
	var fnew = new air.File(dest_url);
	f.moveTo(fnew, true);
};

/**
 * delete a file 
 */
sc.helpers.deleteFile = function (url) {
	var f = new air.File(url);
	f.deleteFile();
};

/**
 * delete a directory 
 */
sc.helpers.deleteDirectory = function (url) {
	var f = new air.File(url);
	f.deleteDirectory();
};

/**
 * make a new directory 
 */
sc.helpers.createDirectory = function (url) {
	var f = new air.File(url);
	f.createDirectory();
};


/**
 * initializes a file at the given location. set overwrite to true
 * to clear out an existing file.
 * returns true or false
 */
sc.helpers.initFile = function (url) {
	var file = new air.File(url);
	if ( !file.exists || (file.exists && overwrite) ) {
		var fs = new air.FileStream();
		fs.open(file, air.FileMode.WRITE);
		fs.writeUTFBytes('');
		fs.close();
		return true;
	} else {
		return false;
	}
};
sc.helpers.init_file = sc.helpers.initFile;



/**
 * returns the file URL for the app storage directory
 */
sc.helpers.getAppStorageDir = function() {
	return air.File.applicationStorageDirectory.url;
};
sc.helpers.getAppStoreDir = sc.helpers.getAppStorageDir;


/**
 * get the application's directory 
 */
sc.helpers.getAppDir = function() {
	return air.File.applicationDirectory.url;
};



/**
 * make a temporary file 
 */
sc.helpers.createTempFile = function() {
	return air.File.createTempFile().url;
};

/**
 * make a temporary directory
 */
sc.helpers.createTempDirectory = function() {
	return air.File.createTempDirectory().url;
};
/*jslint 
browser: true,
nomen: false,
debug: true,
forin: true,
undef: true,
white: false,
onevar: false 
 */
var sc, air, DOMParser;
 
/*
	AIR VERSION
	We load this file to redefine platform-specific methods
*/

/*
	dump an object's first level to console
*/
sc.helpers.dump = function(obj, level) {
	var dumper;
	
	if (!level) { level = SPAZCORE_DUMPLEVEL_DEBUG; }
	
	if (sc.dumplevel < level ) {
		return;
	}
	
	if (sc.helpers.isString(obj) || sc.helpers.isNumber(obj) || !obj) {
		dumper = air.trace;
	} else {
		dumper = function() {
			for(var x in obj) {
				air.trace("'"+x+"':"+obj[x]);
			}
		};
	}
	
	if (sc.helpers.isString(obj)) {
		dumper(obj);
	} else if(sc.helpers.isNumber(obj)) {
		dumper(obj.toString());
	} else if (obj === undefined) {
		dumper('UNDEFINED');
	} else if (obj === null) {
		dumper('NULL');
	} else { // this should be a "normal" object
		dumper(obj);
	}
};


/*
	Open a URL in the default system web browser
*/
sc.helpers.openInBrowser = function(url) {
	var request = new air.URLRequest(url);
	try {            
	    air.navigateToURL(request);
	} catch (e) {
	    air.trace(e.errorMsg);
	}
};



/*
	Returns the current application version string
*/
sc.helpers.getAppVersion = function() {
	var appXML = air.NativeApplication.nativeApplication.applicationDescriptor;
	var domParser = new DOMParser();
	appXML = domParser.parseFromString(appXML, "text/xml");
	var version = appXML.getElementsByTagName("version")[0].firstChild.nodeValue;
	return version;
};


/*
	Returns the user agent string for the app
*/
sc.helpers.getUserAgent = function() {
	return window.htmlLoader.userAgent;
};


/*
	Sets the user agent string for the app
*/
sc.helpers.setUserAgent = function(uastring) {
	window.htmlLoader.userAgent = uastring;
	return window.htmlLoader.userAgent;
};



/*
	Gets clipboard text
*/
sc.helpers.getClipboardText = function() {
	if(air.Clipboard.generalClipboard.hasFormat("text/plain")){
	    var text = air.Clipboard.generalClipboard.getData("text/plain");
		return text;
	} else {
		return '';
	}
};

/*
	Sets clipboard text
*/
sc.helpers.setClipboardText = function(text) {
	sc.helpers.dump('Copying "' + text + '" to clipboard');
	air.Clipboard.generalClipboard.clear();
	air.Clipboard.generalClipboard.setData(air.ClipboardFormats.TEXT_FORMAT,text,false);
};


/*
	Loads a value for a key from EncryptedLocalStore
*/
sc.helpers.getEncryptedValue = function(key) {
	var storedValue = air.EncryptedLocalStore.getItem(key);
	var val = storedValue.readUTFBytes(storedValue.length);
	return val;
};

/*
	Sets a value in the EncryptedLocalStore of AIR
*/
sc.helpers.setEncryptedValue = function(key, val) {
	var bytes = new air.ByteArray();
    bytes.writeUTFBytes(val);
    air.EncryptedLocalStore.setItem(key, bytes);
};



/**
 * 
 */
sc.helpers.getPreferencesFile = function(name, create) {
	if (!name) {name='preferences';}
	
	var prefsFile = sc.helpers.getAppStoreDir();
	prefsFile = prefsFile.resolvePath(name+".json");
	
	return prefsFile;
};

/*jslint 
browser: true,
nomen: false,
debug: true,
forin: true,
undef: true,
white: false,
onevar: false 
 */
var sc, air;

 
/**
 * This really only supports image uploads right now (jpg, gif, png) 
 * 
 * opts = {
 *  content_type:'', // optional
 *  field_name:'', //optional, default to 'media;
 *  file_url:'',
 *  url:'',
 * 	extra:{...}
 *  headers:{...}
 * 
 * 
 * }
 */
sc.helpers.HTTPUploadFile = function(opts, onSuccess, onFailure) {

	function callback_for_upload_progress(event) { 

	    var pct = Math.ceil( ( event.bytesLoaded / event.bytesTotal ) * 100 ); 
	    sch.error('Uploaded ' + pct.toString() + '%');
		
		if (opts.onProgress) {
			opts.onProgress({
				'bytesLoaded':event.bytesLoaded,
				'bytesLoaded':event.bytesTotal,
				'percentage':pct
			});
		}
	}

	function callback_for_upload_finish(event) {
		sch.error('File upload complete');
		sch.error(event.data); // output of server response to AIR dev console
		if (onSuccess) {
			onSuccess(event.data);
		}
	}
	
    function callback_for_error(event) {
        sch.error('IOError!');
        if (onFailure) {
            onFailure(event);
        }
    }

    opts = sch.defaults({
        'method':'POST',
        'content_type':'multipart/form-data',
        'field_name':'media',
        'file_url':null,
        'url':null,
        'extra':null,
        'headers':null,
        'username':null,
        'password':null,
    }, opts);

	var field_name   = opts.field_name;
	var content_type = opts.content_type;
	
	var uploading_file = new air.File(opts.file_url);
	


	// creating POST request variables (like in html form fields)
	var variables = new air.URLVariables();

	if (opts.username) {
		variables.username = opts.username;
	}

	if (opts.password) {
		variables.password = opts.password;
	}

	var key;	
	if (opts.extra) {
		for(key in opts.extra) {
			sch.error('adding '+key+':'+opts.extra[key]);
			variables[key] = opts.extra[key];
		}
	}
	
	var headers = [];
	if (opts.headers) {
		for(key in opts.headers) {
			headers.push( new air.URLRequestHeader(key, opts.headers[key]) );
		}
	}
	

	// set params for http request
	var tmpRequest = new air.URLRequest(opts.url);
	tmpRequest.authenticate = false;
	tmpRequest.method = opts.method;
	tmpRequest.contentType = opts.content_type;
	tmpRequest.requestHeaders = headers;
	tmpRequest.data = variables;

	// attach events for displaying progress bar and upload complete
	uploading_file.addEventListener(air.ProgressEvent.PROGRESS, callback_for_upload_progress);
	uploading_file.addEventListener(air.DataEvent.UPLOAD_COMPLETE_DATA, callback_for_upload_finish); 
    uploading_file.addEventListener(air.SecurityErrorEvent.SECURITY_ERROR, callback_for_error);
    uploading_file.addEventListener(air.IOErrorEvent.IO_ERROR, callback_for_error);
    
	// doing upload request to server
	uploading_file.upload(tmpRequest, field_name, false);
	

};

/*jslint 
browser: true,
nomen: false,
debug: true,
forin: true,
undef: true,
white: false,
onevar: false 
 */
var sc, air;

/**
 * AIR
 * platform-specific definitions for prefs lib 
 */

SpazPrefs.prototype.load = function() {
	var filename = this.id || SPAZCORE_PREFS_AIR_FILENAME;
	
	var prefsFile = air.File.applicationStorageDirectory;
	prefsFile = prefsFile.resolvePath(filename);

	var fs = new air.FileStream();

	if (prefsFile.exists) {
		sch.debug('prefsfile exists');
		fs.open(prefsFile, air.FileMode.READ);
		var prefsJSON = fs.readUTFBytes(prefsFile.size);
		sch.debug(prefsJSON);

		try {
			var loaded_prefs = JSON.parse(prefsJSON);
		} catch (e) {
			sch.error('Could not load prefs JSON… using defaults');
			this.save();
			return;
		}

		for (var key in loaded_prefs) {
			sc.helpers.dump('Copying loaded pref "' + key + '":"' + this._prefs[key] + '" (' + typeof(this._prefs[key]) + ')');
			this._prefs[key] = loaded_prefs[key];
		}
	} else { // init the file
		sch.debug('prefs file does not exist; saving with defaults');
		this.save();
	}
	fs.close();
};

SpazPrefs.prototype.save = function() {
	var jsonPrefs = sch.enJSON(this._prefs);
	sch.debug(jsonPrefs);

	var filename = this.id || SPAZCORE_PREFS_AIR_FILENAME;

	var prefsFile = air.File.applicationStorageDirectory;
	prefsFile = prefsFile.resolvePath(filename);

	var fs = new air.FileStream();

	fs.open(prefsFile, air.FileMode.WRITE);
	fs.writeUTFBytes(sc.helpers.enJSON(this._prefs));
	fs.close();
};


SpazPrefs.prototype.getEncrypted = function(key) {
	var storedValue = air.EncryptedLocalStore.getItem(key);
	var val = storedValue.readUTFBytes(storedValue.length);
	return val;
};


SpazPrefs.prototype.setEncrypted = function(key, val) {
	var bytes = new air.ByteArray();
	bytes.writeUTFBytes(val);
	return air.EncryptedLocalStore.setItem(key, bytes);
};



SpazPrefs.prototype.saveWindowState = function() {
	this.set('__window-height', window.nativeWindow.width);
	this.set('__window-height', window.nativeWindow.height);
	this.set('__window-x', window.nativeWindow.x);
	this.set('__window-y', window.nativeWindow.y);
};


SpazPrefs.prototype.loadWindowState = function() {
	var width  = this.get('__window-height');
	var height = this.get('__window-height');
	var x	   = this.get('__window-x');
	var y	   = this.get('__window-y');
	
	if (x && y && width && height) {
		window.nativeWindow.width  = width;
		window.nativeWindow.height = height;
		window.nativeWindow.x = x;
		window.nativeWindow.y = y;
	}
};

