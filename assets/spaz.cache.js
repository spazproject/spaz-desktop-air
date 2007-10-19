var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.Cache
************/
if (!Spaz.Cache) Spaz.Cache = {};

Spaz.Cache.sources  = {};
Spaz.Cache.statuses = {};

/**
 * sources cache
 */
Spaz.Cache.getSource = function(key) {
	// Spaz.dump('SOURCE CACHE: looking for ' + key);
	if (Spaz.Cache.sources[key]) {
		// Spaz.dump('SOURCE CACHE: val for ' + key + ' is ' + Spaz.Cache.sources[key]);
		return Spaz.Cache.sources[key];
	}
	return false;
};
Spaz.Cache.setSource = function(key, val) {
	// Spaz.dump('SOURCE CACHE: setting ' + key + ' to ' + val);
	Spaz.Cache.sources[key]=val;
	Spaz.dump("Added to SOURCE CACHE; length:"+Spaz.Cache.sourcesSize());
};
Spaz.Cache.sourcesSize = function() {
	var x = 0;
	for(i in Spaz.Cache.sources) {
		x++;
	}
	return x;
};
Spaz.Cache.sourcesClear = function() {
	Spaz.Cache.sources = {}
	Spaz.dump('Cleared sources cache');
};
Spaz.Cache.sourcesDump = function() {
	var str = '';
	for(i in Spaz.Cache.sources) {
		str = str + 'Spaz.Cache.sources['+i+']='+Spaz.Cache.sources[i] + "\n";
	}
	return str;
};


/**
 * statuses cache
 */
Spaz.Cache.getStatus = function(key) {
	// Spaz.dump('STATUS CACHE: looking for ' + key);
	if (Spaz.Cache.statuses[key]) {
		// Spaz.dump('STATUS CACHE: val for ' + key + ' is ' + Spaz.Cache.statuses[key]);
		return Spaz.Cache.statuses[key];
	}
	return false;
};
Spaz.Cache.setStatus = function(key, val) {
	// Spaz.dump('STATUS CACHE: setting ' + key + ' to ' + val);
	Spaz.Cache.statuses[key]=val;
	Spaz.dump("Added to STATUS CACHE; length:"+Spaz.Cache.statusesSize());
};
Spaz.Cache.statusesSize = function() {
	var x = 0;
	for(i in Spaz.Cache.statuses) {
		x++;
	}
	return x;
};
Spaz.Cache.statusesClear = function() {
	Spaz.Cache.statuses = {}
	Spaz.dump('Cleared satuses cache');
}
Spaz.Cache.statusesDump = function() {
	var str = '';
	for(i in Spaz.Cache.statuses) {
		str = str + 'Spaz.Cache.statuses['+i+']='+Spaz.Cache.statuses[i] + "\n";
	}
	return str;
};