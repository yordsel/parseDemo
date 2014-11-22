var dialogs = require('alloy/dialogs');

function closeMe(e) {
	$.newGroup.close();
}

function saveGroup(e) {
	var strImage = (typeof $.imgGroupLogo.image != "string")?Ti.Utils.base64encode($.imgGroupLogo.image).toString():"";
	var payload = {};
	
	payload.name = $.name.value;
	payload.description = $.description.value;
	payload.image = {__type: "Bytes", base64: strImage};

	dialogs.confirm({message: 'Are you sure you want to save?', callback: function() {
		Alloy.Collections.Group.create(
			payload,
			{
				wait: true, // Waits for a response from the server
				success: function(model, response, options) {// Custom call after a successful call.
					var message = 'Successfully created group!';
					alert(message);
					$.newGroup.close();
				},
				error: function(model, response, options) { // Custom callback after an unsuccessful call.
					alert(response); // Alert the user there was an error.
				}
			}
		);
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