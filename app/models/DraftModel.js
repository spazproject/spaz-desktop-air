(function(){

window.DraftModel = new JazzRecord.Model({
	table: 'drafts',
	columns: {
		// TODO: accountId: 'string',
		text: 'text'
	},
	// events: {
	// 	onUpdate: function(){}
	// },
	// recordMethods: {},
	modelMethods: {
		findById: function(id){
			return this.findBy('id', id);
		}
	}
});

})();
