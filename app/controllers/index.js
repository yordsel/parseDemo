var fb = Alloy.Globals.Facebook;
fb.appid = "1497446637206161";
fb.permissions = ['public_profile', 'email'];

fb.addEventListener('login', updateLoginStatus);

var currentUser = Alloy.Models.instance('user');
var sessToken = Ti.App.Properties.getString('sessionToken', currentUser.get('sessionToken'));

Alloy.Globals.navWin = $.navGroupWin; 

//If a sessionToken exists, check if it is valid and login the user.
if(sessToken) {
	var sessionUrl = Alloy.Globals.BASE_URL + 'users/me';
	fnLoginUser(sessionUrl, sessToken);
}
else {
	if (OS_IOS) {
		$.navGroupWin.open();
		$.tfUsername.focus();		
	} else if (OS_ANDROID) {
		$.index.open();	
	}
}

function updateLoginStatus() {
	alert("User Logged In from FB");
}

//Function displays the Reset Password Screen
function showResetPassword(event) {
	var rpWin = Alloy.createController("resetPassword", {}).getView();

	if (OS_IOS) {
		$.navGroupWin.openWindow(rpWin);
	}
	if (OS_ANDROID) {
		rpWin.open();
	}
	rpWin = null;
}

//Function display the Sign Up screen.
function showSignUp(event) {
	var signUpWin = Alloy.createController("signUp", {}).getView();

	if (OS_IOS) {
		$.navGroupWin.openWindow(signUpWin);
	}
	if (OS_ANDROID) {
		signUpWin.open();
	}
	signUpWin = null;
}

//Function calls the Parse REST API to validate the user's credentials and log the user in.
function signInUser(event) {

	var username = $.tfUsername.value;
	var password = $.tfPassword.value;

	var loginUrl = Alloy.Globals.BASE_URL+'login'+"?username=" + $.tfUsername.value +"&password=" + $.tfPassword.value;
	fnLoginUser(loginUrl, null);
}

function fnLoginUser(loginUrl, sessToken) {
	currentUser.fetch({success: function(model, response, options) {// Custom call after a successful call.
			Ti.App.Properties.setString('sessionToken', currentUser.get('sessionToken'));
			if (OS_IOS) {
				if(sessToken) {
					$.navGroupWin.open(); //If the session token is set then the Navigation Window has not been opened yet. Do that first.
				}
				var homeWin = Alloy.createController("secureHome", {}).getView();
				$.navGroupWin.openWindow(homeWin);
				homeWin = null;
			}

			if (OS_ANDROID) {
				homeWin.open();
			}
			$.tfPassword.value = "";
		},
		error: function(model, response, options) { // Custom callback after an unsuccessful call.
			// Alert the user there was an error.
			$.lblErrorText.text = 'Invalid Username or Password. Please retry.';
			$.tfUsername.value = "";
			$.tfPassword.value = "";
			$.tfUsername.focus();
			},
		url: loginUrl,
		sessionToken : sessToken
		});	
}

//Function resets the error label text when the user starts typing in the fields
function resetErrorText() {
	$.lblErrorText.text = "";
}