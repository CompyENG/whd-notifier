var autoLogin = document.createElement('script');
autoLogin.src = chrome.extension.getURL('autoLogin2.js');
document.body.appendChild(autoLogin);

var extensionId = autoLogin.src.match(/:\/\/([a-z]+)\//i)[1];

document.forms[0].onsubmit = function (event) {
	username = document.forms[0].userName.value;
	password = document.forms[0].password.value;
	
	//console.log("Username: "+username+" -- Password: "+password);
	
	//alert(chrome.extension.getURL('autoLogin.js'));
	
	chrome.extension.sendMessage(extensionId, {act: "loginInit", username: username, password: password});
	//chrome.extension.getBackgroundPage().setUserPass(username, password);
	//chrome.extension.getBackgroundPage().init();
	
	//this._submit(event);
};