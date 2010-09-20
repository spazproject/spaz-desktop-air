/**
 * Hooks are events for which users can write listeners.
 * 
 * Hook events are always triggered on the document object.
 * 
 * Known hooks:
 * 'friends_timeline_data_success_start' 
 * 'friends_timeline_data_success_finish' 
 * 'public_timeline_data_success_start' 
 * 'public_timeline_data_success_finish' 
 * 'search_timeline_data_success_start' 
 * 'search_timeline_data_success_finish' 
 * 'favorites_timeline_data_success_start' 
 * 'favorites_timeline_data_success_finish' 
 * 'user_timeline_data_success_start' 
 * 'user_timeline_data_success_finish' 
 * 'lists_timeline_data_success_start' 
 * 'lists_timeline_data_success_finish' 
 * 'followers_timeline_data_success_start' 
 * 'followers_timeline_data_success_finish' 
 */

Spaz.Hooks = {};

Spaz.Hooks.trigger = function(hook, data) {
	sch.trigger(hook, document, data);
};

Spaz.Hooks.register = function(hook, listener) {
	sch.listen(document, hook, listener);
};
