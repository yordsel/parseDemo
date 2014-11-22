var args = arguments[0] || {};

//Function calls the Parse CreateUser REST API and creates the user in the backend.
function fnPasswordReset(event) {

	var resetEmailStr = $.tfResetPassword.value;
	var resetEmail = resetEmailStr.toLowerCase();

	var url = Alloy.Globals.BASE_URL + "requestPasswordReset";
	
	if (fnCheckResetEmail() === true) {
		var userData = {"email":resetEmail};
		payload = JSON.stringify(userData);
		
		Alloy.Globals.http_request('POST', url, payload, fnCallback);
	}
}

function fnCallback(success, response, error) {
    if (success) {
        alert("Please check your email inbox for an email from Yordsel. Please follow instructions in the email to reset your password.");
        $.resetPassword.close();
    }
    else {
        responseObj = JSON.parse(response);
        if (responseObj.code == 205) {
        	$.lblResetPasswordError.text = "Sorry! This email is not registered with Yordsel.";
        	$.tfResetPassword.focus();
        } else {
        	alert("Oops! Something went wrong. Please try again later.");
        }
        
    }
}

//Function to check if the email provided is a valid email string.
function fnCheckResetEmail() {
	
	if ($.tfResetPassword.hasText()) {
		var email = $.tfResetPassword.value;
		var filter=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		if (filter.test(email)) {
			return true;
		} else {
			$.lblResetPasswordError.text = "Please enter a valid EmailID.";
			$.tfResetPassword.focus();
			return false;
		}		
	} else {
		$.lblResetPasswordError.text = "Please enter a valid EmailID.";
		$.tfResetPassword.focus();
		return false;		
	}

}