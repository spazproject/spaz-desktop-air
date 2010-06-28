(function(){

window.DraftModel = new JazzRecord.Model({
	table: 'drafts',
	columns: {
		account_id:          'string',
		text:                'text',
		updated_at:          'string',
		updated_at_unixtime: 'int'
	},
	// events: {
	// 	onSave: function(){
	// 		var now = new Date();
	// 		this.updated_at = now.toString();
	// 		this.updated_at_unixtime = +now;
	// 	}
	// },
	// recordMethods: {},
	modelMethods: {
		findById: function(id){
			return this.findBy('id', id);
		},
		countByAccountId: function(account_id){
			return this.count({account_id: account_id});
		}
	}
});

})();
