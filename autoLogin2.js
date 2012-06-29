function onReady(callback) {
  if (document.readyState === "complete")
    window.setTimeout(callback, 0);
  else
    window.addEventListener("load", callback, false);
}

function getUserPass(event) {
	username = document.forms[0].userName.value;
	password = document.forms[0].password.value;
	
	console.log("Username: "+username+" -- Password: "+password);
	
	chrome.extension.getBackgroundPage().setUserPass(username, password);
	chrome.extension.getBackgroundPage().init();
	
	this._submit(event);
}

function testFunc(e) {
	console.log("Key up");
}

//onReady(function() {
	//console.log(document.forms[0].userName);
	if(document.forms[0].userName) {
		//console.log("Found it!");
		// We're probably on the login page
		//document.forms[0].addEventListener('submit', getUserPass);
		//document.forms[0].userName.addEventListener('keyup', testFunc);
		//window.addEventListener('submit', getUserPass, true);
		/*HTMLFormElement.prototype._submit = HTMLFormElement.prototype.submit;
		HTMLFormElement.prototype.submit = function(e) {
			username = document.forms[0].userName.value;
			password = document.forms[0].password.value;
			
			console.log("Username: "+username+" -- Password: "+password);
			
			chrome.extension.getBackgroundPage().setUserPass(username, password);
			chrome.extension.getBackgroundPage().init();
			
			this._submit(e);
		};*/
		HTMLFormElement.prototype._submit = HTMLFormElement.prototype.submit;
		HTMLFormElement.prototype.submit = function () {
			this.onsubmit();
			
			this._submit();
		};
		//chrome.webRequest.onBeforeRequest.addListener(getUserPass);
	}
//});