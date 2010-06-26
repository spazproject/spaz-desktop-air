// TODO: Associate each draft with a specific account
// TODO: Add control to destroy all drafts

(function($){

if(!window.Spaz){ window.Spaz = {}; }
if(!window.Spaz.Drafts){ window.Spaz.Drafts = {}; }

var Spaz = window.Spaz,
    draft,  // DraftModel record
    drafts, // DraftModel record collection
    $list;

$(function(){
	$list = $('#popbox-content-drafts').find('.content ul');

	// Delegate handlers
	$('#entrybox').live('keydown', function(ev){
		if($(ev.target).val() === ''){
			// When the textarea is cleared, allow for creating a new draft
			Spaz.Drafts.setEditingId(null);
		}
	});
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

Spaz.Drafts.createView = function(draft){
	$list.append(
		'<li id="draft-' + draft.id + '">' +
			'<p>' + draft.text + '</p>' +
			'<div class="actions">' +
				'<span class="clickable draft-action draft-action-edit" ' +
					'title="Edit" data-action="edit">Edit</span>' +
				'<span class="clickable draft-action draft-action-del" ' +
					'title="Delete" data-action="delete">Delete</span>' +
			'</div>' +
		'</li>'
	);
};

Spaz.Drafts.showList = function(){
	sch.error('Spaz.Drafts.showList'); // FIXME: Testing; remove

	var i, iMax, draft,
	    drafts = DraftModel.all({select: 'id'});

	// Create any missing draft views
	for(i = 0, iMax = drafts.length; i < iMax; i++){
		sch.error('DRAFTS: id: ' + drafts[i].id); // FIXME: Testing; remove
		draft = DraftModel.findById(drafts[i].id);
		if(!$('#draft-' + draft.id)[0]){
			Spaz.Drafts.createView(draft);
		}
	}

	Spaz.UI.openPopboxInline('#draftsWindow');

	// FIXME: Testing; remove
	sch.error('DRAFTS: List has ' + $list.children().length + ' children');
};

Spaz.Drafts.hideList = function(){
	// Be careful, as this could hide a popbox with any content.
	Spaz.UI.closePopbox();
};

Spaz.Drafts.create = function(text){
	sch.error('Spaz.Drafts.create'); // FIXME: Testing; remove

	if(text === ''){ return; }

	// Update model
	var draft = DraftModel.create({ text: text });
	Spaz.Drafts.setEditingId(draft.id);

	// FIXME: Testing; remove
	sch.error('DRAFTS: Created id=' + draft.id + ':');
	sch.error(draft.text);

	// Update views
	Spaz.Drafts.createView(draft);
	Spaz.Drafts.updateCounter();
};

Spaz.Drafts.edit = function(draft){
	sch.error('Spaz.Drafts.edit'); // FIXME: Testing; remove

	$(Spaz.postPanel.textarea).val(draft.text);
	Spaz.Drafts.setEditingId(draft.id);
	Spaz.Drafts.hideList();
	Spaz.Drafts.flashPostPanel();
};

Spaz.Drafts.update = function(draft, text){
	sch.error('Spaz.Drafts.update'); // FIXME: Testing; remove

	if(text === ''){ return; }

	// Update model
	draft.updateAttribute('text', text);

	// FIXME: Testing; remove
	draft.reload();
	sch.error('DRAFTS: Updated id=' + draft.id + ':');
	sch.error(draft.text);

	// Update views
	$('#draft-' + draft.id).children('p:first').html(draft.text);
};

Spaz.Drafts.destroy = function(draft){
	sch.error('Spaz.Drafts.destroy'); // FIXME: Testing; remove

	// FIXME: Testing; remove
	sch.error('DRAFTS: About to destroy: id=' + draft.id);

	// Update model
	DraftModel.destroy(draft.id);

	// Update views
	if(DraftModel.count() < 1){
		Spaz.Drafts.hideList();
	}
	$('#draft-' + draft.id).remove(); // <li>
	Spaz.Drafts.updateCounter();
};

Spaz.Drafts.destroyAll = function(){
	sch.error('Spaz.Drafts.destroyAll'); // FIXME: Testing; remove

	// Update model
	DraftModel.destroyAll();

	// Update views
	$list.empty();
	Spaz.Drafts.updateCounter();
	Spaz.Drafts.hideList();
};

Spaz.Drafts.updateCounter = function(){
	var count      = DraftModel.count(),
	    text       = count + (count === 1 ? ' draft' : ' drafts'),
	    $entryform = $('#entryform'),
	    $wrapper   = $('#entryform-drafts'),
	    $text      = $wrapper.children('span.count');

	if(count > 0){
		$entryform.addClass('has-drafts');
		$text.html(text);
	}else{
		$entryform.removeClass('has-drafts');
	}
};

Spaz.Drafts.getEditingId = function(){
	// Returns the id of the draft being editing, or null if no draft is being
	// edited.
	return $list.data('editing-draft-id');
};

Spaz.Drafts.setEditingId = function(id){
	// Sets the id of the draft being edited.
	$list.data('editing-draft-id', id);
};

Spaz.Drafts.flashPostPanel = function(){
	var $textarea = $(Spaz.postPanel.textarea);
	setTimeout(function(){
		$textarea.addClass('flash');
		setTimeout(function(){ $textarea.removeClass('flash'); }, 1000);
	}, 250);
};

})(jQuery);
