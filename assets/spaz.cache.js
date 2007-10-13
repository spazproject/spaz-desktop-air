var Spaz; if (!Spaz) Spaz = {};

/***********
Spaz.Cache
************/
if (!Spaz.Cache) Spaz.Cache = {};

Spaz.Cache.sources  = {};
Spaz.Cache.statuses = {};

Spaz.Cache.getSource = function(key) {
	// Spaz.dump('cache: getting ' + key);
	// Spaz.dump('cache: val for ' + key + ' is ' + Spaz.Cache.statuses[key]);
	if (Spaz.Cache.statuses[key]) {
		return Spaz.Cache.statuses[key];
	}
	return false;
};
Spaz.Cache.addSource = function(key, val) {
	// Spaz.dump('cache: setting ' + key + ' to ' + val);
	Spaz.Cache.statuses[key]=val;
};

Spaz.Cache.getStatus = function(key) {
	// Spaz.dump('cache: getting ' + key);
	// Spaz.dump('cache: val for ' + key + ' is ' + Spaz.Cache.statuses[key]);
	if (Spaz.Cache.statuses[key]) {
		return Spaz.Cache.statuses[key];
	}
	return false;
};
Spaz.Cache.setStatus = function(key, val) {
	// Spaz.dump('cache: setting ' + key + ' to ' + val);
	Spaz.Cache.statuses[key]=val;
};