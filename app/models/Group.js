exports.definition = {
	config: {
		adapter: {
			type: "parse_rest",
			collection_name: "Group",
			base_url: Alloy.Globals.BASE_URL + 'classes/Groups/'
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			idAttribute: 'objectId',
			addAccessControl : function(model) {
				var currentUser = Alloy.Models.instance('user');
				var userId = currentUser.get("objectId");
				var ACL = {};
				
				ACL["*"] = {"read":true,};
				ACL[userId] = {"write":true};
				model.set("ACL",ACL);
			},
			isOwnedBy: function(userId) {
				if (this.has('ACL')) {
					var accessControlList = this.get('ACL');
					return ((userId in accessControlList)?true:false);
				}
				else {
					return true;
				}
			}
		});

		return Model;
	}
};
