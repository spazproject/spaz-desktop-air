(function($){

if(!window.Spaz){ window.Spaz = {}; }
if(!window.Spaz.Drafts){ window.Spaz.Drafts = {}; }

var Spaz = window.Spaz,
    draft,  // DraftModel record
    drafts, // DraftModel record collection
    editingId = null, // id of the draft being edited; private to this file
    $list, $popbox, $saveButton;

$(function(){
	$popbox     = $('#popbox-content-drafts');
	$list       = $popbox.find('.content ul');
	$saveButton = $('#entrybox-saveDraft');

	// Delegate handlers
	$('#entrybox').live('keyup', function(ev){
		if($(ev.target).val() === ''){
			// When the textarea is cleared, allow for creating a new draft
			Spaz.Drafts.setEditingId(null);
			Spaz.Drafts.highlightEditing();
		}
	});
	// $popbox.delegate('.meta input[name=destroy-all]', 'click', function(ev){
	// 	Spaz.Drafts.destroyAll();
	// });
	$list.delegate('.draft-action', 'click', function(ev){
		var $target   = $(ev.target),
		    $listItem = $target.closest('li'),
		    draftId   = +($listItem.attr('id').replace(/^draft-/, '')),
		    draft     = DraftModel.findById(draftId);
		switch($target.attr('data-action')){
			case 'edit':
				Spaz.Drafts.edit(draft); break;
			case 'delete':
				Spaz.Drafts.destroy(draft); break;
		}
	});
});

Spaz.Drafts.showList = function(){
	if($list.is(':empty')){
		Spaz.Drafts.rebuildList();
	}else{
		Spaz.Drafts.updateRelativeTimes();
	}
	Spaz.UI.openPopboxInline('#draftsWindow');
};

Spaz.Drafts.hideList = function(){
	// Be careful, as this could hide a popbox with any content.
	Spaz.UI.closePopbox();
};

Spaz.Drafts.create = function(text){
	if(text === ''){ return; }

	// Update model
	var draft = DraftModel.create({
	            	account_id: Spaz.Drafts.currentAccountId(),
	            	text:       text
	            });
	Spaz.Drafts.setEditingId(draft.id);
	Spaz.Drafts.afterDraftSave(draft);

	// Update views
	Spaz.Drafts.rebuildList();
	Spaz.Drafts.updateCounter();
};

Spaz.Drafts.edit = function(draft){
	// Update model
	Spaz.Drafts.setEditingId(draft.id);

	// Update views
	Spaz.Drafts.highlightEditing();
	$(Spaz.postPanel.textarea).val(draft.text).focus();
	Spaz.Drafts.hideList();
	Spaz.Drafts.flashPostPanel();
};

Spaz.Drafts.update = function(draft, text){
	if(text === ''){ return; }

	var $draft = $('#draft-' + draft.id);

	// Update model
	draft.updateAttributes({ text: text });
	Spaz.Drafts.afterDraftSave(draft);

	// Update views
	Spaz.Drafts.rebuildList();
};

Spaz.Drafts.destroy = function(draft){
	// Update model
	DraftModel.destroy(draft.id);

	// Update views
	if(Spaz.Drafts.count() < 1){
		Spaz.Drafts.hideList();
	}
	$('#draft-' + draft.id).remove(); // <li>
	Spaz.Drafts.updateCounter();
};

Spaz.Drafts.destroyAll = function(){
	// Update model
	DraftModel.destroyAll({account_id: Spaz.Drafts.currentAccountId()});

	// Update views
	$list.empty();
	Spaz.Drafts.updateCounter();
	Spaz.Drafts.hideList();
};



/*** Helpers > Model ***/

Spaz.Drafts.currentAccountId = function(){
	return Spaz.Prefs.getUsername() + '@' + Spaz.Prefs.getAccountType();
};

Spaz.Drafts.count = function(){
	// Returns the count for *only* the current account, not the overall count.
	return DraftModel.countByAccountId(Spaz.Drafts.currentAccountId());
}

Spaz.Drafts.getEditingId = function(){
	// Returns the id of the draft being editing, or null if no draft is being
	// edited.

	return editingId;
};

Spaz.Drafts.setEditingId = function(id){
	// Sets the id of the draft being edited.

	editingId = id;
};

Spaz.Drafts.afterDraftSave = function(draft){
	// Tried this in the JazzRecord model as an `events.onSave` callback
	// (*before* save), but since it wouldn't work, we'll make an extra query
	// *after* save.

	var now = new Date();
	draft.updateAttributes({
		updated_at:          now.toString(),
		updated_at_unixtime: +now
	});
};



/*** Helpers > Views ***/

Spaz.Drafts.getNewViewHTML = function(draft){
	var length = draft.text.length,
	    maxLength = Spaz.postPanel ? Spaz.postPanel.maxlen : 140;
	    	// The value `140` really belongs in a global config that's set
	    	// immediately.
	return (
		'<li id="draft-' + draft.id + '">' +
			'<p>' + sch.makeClickable(draft.text) + '</p>' +
			'<div class="meta">' +
				'<p class="editing" style="display:none">Currently editing</p>' +
				'<p class="chars' + (length <= maxLength ? '' : ' over') + '">' +
					length + ' character' + (length != 1 ? 's' : '') +
				'</p>' +
				'<p class="updated-at">Saved ' +
					'<span class="datetime" data-value="' + draft.updated_at + '">' +
						draft.updated_at +
					'</span>' +
				'</p>' +
			'</div>' +
			'<div class="draft-actions">' +
				'<span class="clickable draft-action" ' +
					'title="Edit" data-action="edit">Edit</span>' +
				'<span class="clickable draft-action" ' +
					'title="Delete" data-action="delete">Delete</span>' +
			'</div>' +
		'</li>'
	);
};

Spaz.Drafts.rebuildList = function(){
	var i, iMax,
	    drafts = DraftModel.all({
	    	conditions: {account_id: Spaz.Drafts.currentAccountId()},
	    	order:      'updated_at_unixtime ASC'
	    }),
	    html = '';
	$list.empty();

	// if(drafts.length > 1 &&
	// 		!$popbox.find('div.meta input[name=destroy-all]')[0]){
	// 	$list.before(
	// 		'<div class="meta">' +
	// 			'<span class="count"></span>' +
	// 			'<input type="button" name="destroy-all" ' +
	// 				'value="Delete all drafts" />' +
	// 		'</div>'
	// 	);
	// }

	i = drafts.length; while(i--){
		// Drafts are retrieved oldest first, then with a reverse loop (for
		// speed), rendered newest first.
		html += Spaz.Drafts.getNewViewHTML(drafts[i]);
	}
	$list.html(html);

	Spaz.Drafts.updateRelativeTimes();
	Spaz.Drafts.highlightEditing();
};

Spaz.Drafts.updateRelativeTimes = function(){
	var selector = $popbox.selector = ' .datetime:not(:empty)';
	sch.updateRelativeTimes(selector, 'data-value');
	$(selector).html(function(i, html){
		return html.toLowerCase();
	});
};

Spaz.Drafts.updateCounter = function(){
	var count       = Spaz.Drafts.count(),
	    text        = count + (count === 1 ? ' draft' : ' drafts'),
	    $entryform  = $('#entryform'),
	    $wrapper    = $('#entryform-drafts'),
	    $text       = $wrapper.children('span.count').
	                  	add($popbox.find('div.meta span.count'));

	if(count > 0){
		$entryform.addClass('has-drafts');
		$text.html(text);
	}else{
		$entryform.removeClass('has-drafts');
	}
};

Spaz.Drafts.highlightEditing = function(){
	// Highlights the drafts list item that is currently being edited, if any.

	var id = Spaz.Drafts.getEditingId();

	$list.children('.editing').removeClass('editing').
		find('div.meta .editing').hide();
	if(id){
		$('#draft-' + id).addClass('editing').find('div.meta .editing').show();
		$saveButton.html('Save Existing Draft').
			attr('title', 'To start a new draft, delete the current text.');
	}else{
		$saveButton.html('Save New Draft').removeAttr('title');
	}
};

Spaz.Drafts.flashPostPanel = function(){
	var $textarea = $(Spaz.postPanel.textarea);
	setTimeout(function(){
		$textarea.addClass('flash');
		setTimeout(function(){ $textarea.removeClass('flash'); }, 1000);
	}, 250);
};



})(jQuery);
