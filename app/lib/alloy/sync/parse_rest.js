// Override the Backbone.sync method with the following
module.exports.sync = function(method, model, options) {

	var payload = JSON.stringify(model.toJSON());
	var error;
	var parseUrl = options.url || BASE_URL;
	var currentUser = Alloy.Models.instance('user');
	var sessionToken = options.sessionToken || currentUser.get('sessionToken');
	
	switch(method) {

		// This case is called by the Model.fetch and Collection.fetch methods to retrieve data.
		case 'read':
			if (model.get("objectId")) {
				// If we have an ID, fetch only one document
				Alloy.Globals.http_request('GET', parseUrl + model.get("objectId") , null, callback, sessionToken);
			}
			else {
				// if not, fetch all documents
				Alloy.Globals.http_request('GET', parseUrl, null, callback, sessionToken);
			}
			break;

		// This case is called by the Model.save and Collection.create methods
		// to initialize model if the IDs are not set.
		case 'create':
			if(typeof model.addAccessControl === "function") {
				model.addAccessControl(model);
				payload = JSON.stringify(model.toJSON());
			}
			Alloy.Globals.http_request('POST', parseUrl, payload, callback, sessionToken);
			break;

		// This case is called by the Model.destroy method to delete the model from storage.
		case 'delete':
			if (model.get("objectId") ) {
				Alloy.Globals.http_request('DELETE', parseUrl + model.get("objectId") , null, callback, sessionToken);
			}
			else {
				error = 'ERROR: Model does not have an ID!';
			}
			break;

		// This case is called by the Model.save and Collection.create methods
		// to update a model if they have IDs set.
		case 'update':
			if (model.get("objectId") ) {
				Alloy.Globals.http_request('PUT', parseUrl + model.get("objectId") , payload, callback, sessionToken);
			}
			else {
				error = 'ERROR: Model does not have an ID!';
			}
			break;

		default :
			error = 'ERROR: Sync method not recognized!';
	};

	if (error) {
		options.error(model, error, options);
		Ti.API.error(error);
		model.trigger('error');
	}

	// Simple default callback function for HTTP request operations.
	function callback(success, response, error) {
		res = JSON.parse(response);

		returnVal = (typeof res.results != "undefined") ? res.results : res;
		
		if (success) {
			// Calls the default Backbone success callback
			// and invokes a custom callback if options.success was defined
			options.success(returnVal, JSON.stringify(returnVal), options);
		}
		else {
			// Calls the default Backbone error callback
			// and invokes a custom callback if options.error was defined.
			var err = res.error || error;
			options.error(model, err, options);
			model.trigger('error');
		}
	};
};

// Perform some actions before creating the Model class
module.exports.beforeModelCreate = function(config, name) {
	config = config || {};
	// If there is a base_url defined in the model file, use it
	if (config.adapter.base_url) {
		BASE_URL = config.adapter.base_url;
	}
	return config;
};

// Perform some actions after creating the Model class 
module.exports.afterModelCreate = function(Model, name) {
	// Nothing to do
};