var Spaz;
if (!Spaz) Spaz = {};

/***********
Spaz.Sounds
***********/
if (!Spaz.Sounds) Spaz.Sounds = {};


Spaz.Sounds.playSound = function(url, callback) {
    if (!Spaz.Prefs.get('sound-enabled')) {
        sch.debug('Not playing sound ' + url + '- disabled');
        if (callback) {
            sch.debug('calling callback manually');
            callback();
            sch.debug('ending callback');
        } else {
            sch.debug('no callback, returning');
        }
        return;
    }

    sch.debug('Spaz.Sounds.playSound callback:' + callback);
    sch.debug("loading " + url);

    var req = new air.URLRequest(url);
    var s = new air.Sound();

    function onComplete(e) {
        var sc = s.play();
        if (sc) {
            sch.debug("playing " + url);
            if (callback) {
                sc.addEventListener(air.Event.SOUND_COMPLETE, callback);
            }
        }
    }

    function onIOError(e) {
        sch.debug("failed to load " + url);
        if (callback) {
            sch.debug('calling callback manually');
            callback();
            sch.debug('ending callback');
        } else {
            sch.debug('no callback, returning');
        }

    }

    s.addEventListener(air.Event.COMPLETE, onComplete);
    s.addEventListener(air.IOErrorEvent.IO_ERROR, onIOError);
    s.load(req);
};


Spaz.Sounds.onSoundPlaybackComplete = function(event) {
    sch.dump("The sound has finished playing.");
};


Spaz.Sounds.playSoundUpdate = function(callback) {
    Spaz.Sounds.playSound(Spaz.Prefs.get('sound-url-update'), callback);
};

Spaz.Sounds.playSoundStartup = function(callback) {
    Spaz.Sounds.playSound(Spaz.Prefs.get('sound-url-startup'), callback);
};

Spaz.Sounds.playSoundShutdown = function(callback) {
    Spaz.Sounds.playSound(Spaz.Prefs.get('sound-url-shutdown'), callback);
};

Spaz.Sounds.playSoundNew = function(callback) {
    Spaz.Sounds.playSound(Spaz.Prefs.get('sound-url-new'), callback);
};

Spaz.Sounds.playSoundWilhelm = function(callback) {
    Spaz.Sounds.playSound(Spaz.Prefs.get('sound-url-wilhelm'), callback);
};


