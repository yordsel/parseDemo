var args = arguments[0] || {};
var currentUser = Alloy.Models.instance('user');
var mainMenu = null;
var mainMenuCtrler = null;
var menuVisible = false;

function fnSetMode(e) {
	
	if(!menuVisible) {
		var mode = e.source.id;

	    switch(mode) {
	    case 'CareProv':
		    break;  
	    default:
			var joinGroup = Alloy.createController("groups", args).getView();
		    if (OS_IOS) {
		        Alloy.Globals.navWin.openWindow(joinGroup);
		    }
		    if (OS_ANDROID) {
		        joinGroup.open();
		    }
		    var joinGroup = null;
	    	break;
		}
	}
}

function leftNavClicked(e) {
	fnToggleMenu();
}

function fnSecureHomeClicked(e) {
	if (menuVisible) {
		fnToggleMenu();
	}
}

function fnToggleMenu() {
	var slideIn = Ti.UI.createAnimation();
	var slideOut = Ti.UI.createAnimation();
	if (menuVisible) {
	   	slideIn.left = 0;
		slideOut.width = 0;
		
		Alloy.Globals.navWin.animate(slideIn);
	   	mainMenu.close(slideOut);
	    mainMenuCtrler.off('menuEvent', fnMenuEvent);
	   	menuVisible = false;
	} 
	else {
		slideOut.left = $.secureHome.rect.width-40;
		slideOut.width = $.secureHome.rect.width;
		slideOut.duration=300;
		
		slideIn.left = 0;
		slideIn.width = $.secureHome.rect.width-40;
		slideIn.duration=290;
	   	
	   	if(mainMenu === null) {
	   		mainMenuCtrler = Alloy.createController("mainMenu",args);
	   		mainMenu = mainMenuCtrler.getView();
	   	}
	   	mainMenuCtrler.on('menuEvent',fnMenuEvent);
	
		//slide the Home window out and slide in the menu
	   	mainMenu.open(slideIn);
	   	Alloy.Globals.navWin.animate(slideOut);
	
		menuVisible = true;
	}
}

function fnMenuEvent(event) {
	switch(event) {
		case 'logout':
		   	currentUser.clear(); //Log the user out by clearing the currentUser
			Ti.App.Properties.removeProperty('sessionToken');
			$.secureHome.close({animated:false}); 

		case 'close':
			fnToggleMenu();
			break;

		case 'default':
			break;
	}
}

function fnSecureHomeClose(e) {
	mainMenu = null;
	mainMenuCtrler = null;
}