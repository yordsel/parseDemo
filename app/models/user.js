exports.definition = {
	config: {
		adapter: {
			type: "parse_rest",
			collection_name: "user",
			base_url: Alloy.Globals.BASE_URL + 'users/',
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			idAttribute: 'objectId'
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
};