var autoLogin = document.createElement('script');
autoLogin.src = chrome.extension.getURL('autoLogin2.js');
document.body.appendChild(autoLogin);

var extensionId = autoLogin.src.match(/:\/\/([a-z]+)\//i)[1];

document.forms[0].onsubmit = function (event) {
    server = window.location.href;
    if(!(server.match(".woa$")==".woa")) {
        // Since we only run this on /Helpdesk.woa and /Helpdesk, simply add the
        //  .woa if it isn't there already. A cheap trick? Perhaps, but it should work
        server = server+".woa";
    }
    username = document.forms[0].userName.value;
    password = document.forms[0].password.value;
	
    chrome.extension.sendMessage(extensionId, {
        act: "loginInit",
        server: server,
        username: username,
        password: password,
        origin: "autoLogin"     // Perhaps a cheap trick
    });
};