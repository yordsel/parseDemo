var args = arguments[0] || {};
var group = args.toJSON();
var model = args;
$.name.value = group.name || 'No group name';
$.description.value = group.description || 'No group description';
$.imgGroupLogo.image = ((typeof group.image != "undefined")&&(group.image.base64 != ""))?Ti.Utils.base64decode(group.image.base64):"./images/noimage.png";

var dialogs = require('alloy/dialogs');

function closeMe(e) {
	$.groupDetails.close();
}

function updateGroup(e) {
	var strImage = (typeof $.imgGroupLogo.image != "string")?Ti.Utils.base64encode($.imgGroupLogo.image).toString():"";
	dialogs.confirm({message: 'Are you sure you want to make changes?', callback: function() {
		model.save({
			objectId: group.objectId, 
			name: $.name.value, 
			description: $.description.value,
			image: {
				__type: "Bytes",
				base64: strImage
				}
			},
			{
				wait: true, // Waits for a response from the server
				success: function(model, response, options) {// Custom call after a successful call.
					var message = 'Successfully updated group!';
					alert(message);
					$.groupDetails.close();
				},
				error: function(model, response, options) { // Custom callback after an unsuccessful call.
					Ti.API.info(response);
					alert(response); // Alert the user there was an error.
				}
			}
			);
	}});
}

function deleteGroup(e) {
	dialogs.confirm({message: 'Are you sure you want to delete this group?', callback: function() {
		model.destroy({
			wait: true, // Waits for a response from the server
			success: function(mod, response, options) { // Custom callback after a successful call.
				$.groupDetails.close(); // Close the window
			},
			error: function(mod, response, options) { // Custom callback after an unsuccessful call.
				alert(response); // Alert the user there was an error.
			}
		});
	}});
}


function showOptions(event){
	$.odlgPhoto.show();
}

function showGallery(e) {
	switch(e.index) {
		case 0:
			Ti.Media.openPhotoGallery({	
				success:function(response)
				{
					successFunction(response);
				},
				cancel:function()
				{
				},
				error:function(error)
				{
				},
				allowEditing:true,
				mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
			});		
			break;
		case 1:
			Ti.Media.showCamera({	
				success:function(response)
				{
					successFunction(response);
				},
				cancel:function()
				{
				},
				error:function(error)
				{
					Ti.API.info("Camera not available");
				},
				allowEditing:true,
				mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
			});
			break;
		default:
			break;
	}

}

function successFunction (response) {
	var image = response.media;
	if(response.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
	{
		$.imgGroupLogo.image = image.imageAsThumbnail(150);
	}
}