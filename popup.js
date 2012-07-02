function save() {
    usernameTextbox = document.getElementById('username');
    passwordTextbox = document.getElementById('password');

    extensionId = chrome.extension.getURL('popup.js').match(/:\/\/([a-z]+)\//i)[1];
    
    chrome.extension.sendMessage(extensionId, {
        act: "loginInit", 
        username: usernameTextbox.value, 
        password: passwordTextbox.value,
        origin: "popup"     // Just to mirror autoLogin
    });

    if(passwordTextbox.value != "") {
        passwordTextbox.value = "*****";
    }
    
    window.close();
    return false;
}

window.onload = function() {
    document.forms[0].onsubmit = save;
    document.getElementById('save-button').onclick = save;
};