//Globals for Parse access
Alloy.Globals.APP_ID = "qBFRevzFSiRHfYVXkbQHi9FMLQG0OQdQ69CVInTM";
Alloy.Globals.API_KEY = "QXAOw05BRwnXB4n7fwIo6NdTvb8ybJ3ugUF6p89c";
Alloy.Globals.BASE_URL = "https://api.parse.com/1/";
Alloy.Globals.Facebook = require('Facebook');

// Helper function for creating an HTTP request
Alloy.Globals.http_request = function (method, url, payload, callback, sessionToken) {

	var client = Ti.Network.createHTTPClient({
		onload: function(e) {
			if (callback) callback(true, this.responseText, null);
		},
		onerror: function(e) {
			if (callback) callback(false, this.responseText, e.error);
		},
		timeout : 5000
	});

	client.open(method, url);
	client.setRequestHeader('X-Parse-Application-Id', Alloy.Globals.APP_ID);
	client.setRequestHeader('X-Parse-REST-API-Key', Alloy.Globals.API_KEY);
	client.setRequestHeader('Content-Type','application/json');
	
	//Set the Session Token if provided
	if(sessionToken !== null) {
		client.setRequestHeader('X-Parse-Session-Token',sessionToken);
	}
	client.send(payload);

};