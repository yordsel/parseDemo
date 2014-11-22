var groups = Alloy.Collections.Group;
var currentUser = Alloy.Models.instance('user');

groups.fetch();

function showGroup(e) {
	var group = groups.at(e.index);
	var groupDetails = Alloy.createController('showGroup', group).getView();

	if (OS_IOS) {
		Alloy.Globals.navWin.openWindow(groupDetails);
	}
	if (OS_ANDROID) {
		groupDetails.open();
	}
}

function addGroup(e) {
	var newGroup = Alloy.createController('addGroup').getView();
	if (OS_IOS) {
		Alloy.Globals.navWin.openWindow(newGroup);
	}
	if (OS_ANDROID) {
		newGroup.open();
	}
}

function refreshGroups(e) {
	groups.fetch();
}

function transformFunction(model) {
    // Need to convert the model to a JSON object
    var group = model.toJSON();
    group.groupLogo = ((typeof group.image != "undefined")&&(group.image.base64 != ""))?Ti.Utils.base64decode(group.image.base64):"./images/noimage.png";
    group.editVisible = model.isOwnedBy(currentUser.get('objectId'));
    return group;
}

function closeGroups() {
	$.destroy();
}
