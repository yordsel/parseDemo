var args = arguments[0] || {};

function fnHideMainMenu(e) {
	$.trigger('menuEvent','close');
}

function fnLogOut(e) {
	$.trigger('menuEvent',"logout");
 }
