var args = arguments[0] || {};
var currentUser = Alloy.Models.instance('user');

//Function calls the Parse CreateUser REST API and creates the user in the backend.
function signUpUser(event) {

	var emailStr = $.tfEmail.value;
	var username = emailStr.toLowerCase();
	var email = emailStr.toLowerCase();
	var password = $.tfPassword.value;
	var firstname = $.tfFirstName.value;
	var lastname = $.tfLastName.value;

	var url = Alloy.Globals.BASE_URL + "users";
	
	if (checkFormComplete() === true) {
		if (checkEmail() === true) {
			if (checkEmailMatches() === true) {
				currentUser.save(
					{"username":username, "email":email, "password":password, "firstname":firstname, "lastname":lastname},
					{
						wait: true, // Waits for a response from the server
						success: function(model, response, options) {// Custom call after a successful call.
							alert('You have successfully signed up.');
							var homeWin = Alloy.createController("secureHome", {}).getView();
							homeWin.open();
							/*if (OS_IOS) {
								Alloy.Globals.navWin.openWindow(homeWin);
							}
				
							if (OS_ANDROID) {
								homeWin.open();
							}*/
						},
						error: function(model, response, options) { // Custom callback after an unsuccessful call.
							alert(response); // Alert the user there was an error.
						}
					}
				);			
			}		
		} 
	} else {
		$.lblSignUpError.text = "Please enter details for all fields.";
	}
}

//Function to check if the email provided is a valid email string.
function checkEmail() {
	var email = $.tfEmail.value;
	var filter=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

	if (filter.test(email)) {
		return true;
	} else {
		$.lblSignUpError.text = "Please enter a valid EmailID.";
		$.tfEmail.focus();
		return false;
	}
}

//Function to check if emails in the Email and Confirm Email fields match.
function checkEmailMatches() {
	var email = $.tfEmail.value;
	var cemail = $.tfConfirmEmail.value;
	
	if (email === cemail) {
		$.lblSignUpError.text = ""; //Doing this in the event that the emails did not match first time around and the user fixed it.
		return true;
	} else {
		$.lblSignUpError.text = "The Email IDs do not match. Please verify.";
		$.tfEmail.focus();
		return false;
	}
}

//Function to check for completeness of the SignUp form.
function checkFormComplete() {
	if ($.tfFirstName.hasText() && $.tfLastName.hasText() && $.tfEmail.hasText() && $.tfConfirmEmail.hasText() && $.tfPassword.hasText()) {
		return true;
	} else {
		highlightSignUpErrorFields();
		return false;
	}
}

//Function to highlight missing 
function highlightSignUpErrorFields() {
	var errorFieldCount = 0;
	
	$.tfFirstName.borderColor = "EEEEEE";
	$.tfLastName.borderColor = "EEEEEE";
	$.tfEmail.borderColor = "EEEEEE";
	$.tfConfirmEmail.borderColor = "EEEEEE";
	$.tfPassword.borderColor = "EEEEEE";
	
	if ($.tfFirstName.hasText() === false) {
		$.tfFirstName.borderColor = "red";
		errorFieldCount = 1;
	} 

	if ($.tfLastName.hasText() === false) {
		$.tfLastName.borderColor = "red";
		if (errorFieldCount === 0) {
			errorFieldCount = 2;
		}
	} 

	if ($.tfEmail.hasText() === false) {
		$.tfEmail.borderColor = "red";
		if (errorFieldCount === 0) {
			errorFieldCount = 3;
		}		
	} 

	if ($.tfConfirmEmail.hasText() === false) {
		$.tfConfirmEmail.borderColor = "red";
		if (errorFieldCount === 0) {
			errorFieldCount = 4;
		}		
	} 

	if ($.tfPassword.hasText() === false) {
		$.tfPassword.borderColor = "red";
		if (errorFieldCount === 0) {
			errorFieldCount = 5;
		}		
	}
	
	switch (errorFieldCount) {
    case 1:
        $.tfFirstName.focus();
        break;
    case 2:
        $.tfLastName.focus();
        break;
    case 3:
        $.tfEmail.focus();
        break;
    case 4:
        $.tfConfirmEmail.focus();
        break;
    case 5:
        $.tfPassword.focus();
        break;
	}
}

//Function resets the error label text when the user starts typing in the fields
function resetSignUpErrorText() {
	$.lblSignUpError.text = "";
}
