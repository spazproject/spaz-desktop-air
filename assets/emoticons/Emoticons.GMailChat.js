var Emoticons; if (!Emoticons) Emoticons = {};

if (!Emoticons.GMailChat) {
    Emoticons.GMailChat = {};
}

Emoticons.GMailChat.name      = "GMail Chat Animated Emoticons";
Emoticons.GMailChat.author    = "Google";
Emoticons.GMailChat.home      = "http://mail.google.com/support/bin/answer.py?hl=en&answer=34056";
Emoticons.GMailChat.className = "gmail-chat";
Emoticons.GMailChat.imgPath   = "http://mail.google.com/mail/help/images/screenshots/chat/";

Emoticons.GMailChat.mappings = {
    "<3"   : Emoticons.GMailChat.imgPath + "heart.gif",
    ":(|)" : Emoticons.GMailChat.imgPath + "monkey.gif",
    "\\m/" : Emoticons.GMailChat.imgPath + "rockout.gif",
    ":-o"  : Emoticons.GMailChat.imgPath + "shocked.gif",
    ":D"   : Emoticons.GMailChat.imgPath + "grin.gif",
    ":("   : Emoticons.GMailChat.imgPath + "frown.gif",
    "x-("  : Emoticons.GMailChat.imgPath + "angry.gif",
    "B-)"  : Emoticons.GMailChat.imgPath + "cool.gif",
    ":'("  : Emoticons.GMailChat.imgPath + "cry.gif",
    "=D"   : Emoticons.GMailChat.imgPath + "equal_grin.gif",
    ";)"   : Emoticons.GMailChat.imgPath + "wink.gif",
    ":-|"  : Emoticons.GMailChat.imgPath + "straightface.gif",
    "=)"   : Emoticons.GMailChat.imgPath + "equal_smile.gif",
    ":-D"  : Emoticons.GMailChat.imgPath + "nose_grin.gif",
    ";^)"  : Emoticons.GMailChat.imgPath + "wink_big_nose.gif",
    ";-)"  : Emoticons.GMailChat.imgPath + "wink_nose.gif",
    ":-)"  : Emoticons.GMailChat.imgPath + "nose_smile.gif",
    ":-/"  : Emoticons.GMailChat.imgPath + "slant.gif",
    ":P"   : Emoticons.GMailChat.imgPath + "tongue.gif"
}

// Build a regular expression containing all emoticons in this set.
if (!Emoticons.GMailChat.regexp) {
    Emoticons.GMailChat.regexp = Emoticons.buildRegexp(Emoticons.GMailChat.mappings);
}

// Convert emoticons to <img /> using then Emoticons.convertEmoticons() function.
Emoticons.GMailChat.convertEmoticons = function(msg) {
    return Emoticons.convertEmoticons(
        msg,
        Emoticons.GMailChat.regexp,
        Emoticons.GMailChat.mappings,
        Emoticons.GMailChat.className
    );
}