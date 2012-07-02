var customDomainsTextbox;
var saveButton;

String.prototype.endsWith = function(str) {return (this.match(str+"$")==str)}
String.prototype.startsWith = function(str) {return (this.match("^"+str)==str)}

function init() {
  autoServerCheckbox = document.getElementById("autoServer");
  urlTextbox = document.getElementById("url");
  hostedServerTextbox = document.getElementById("hostedServer");
  subscriberTextbox = document.getElementById("subscriber");
  useSslCheckbox = document.getElementById("ssl");
  autoCredentialsSelection = document.getElementById("autoCredentials");
  usernameTextbox = document.getElementById("username");
  passwordTextbox = document.getElementById("password");
  saveUserPassCheckbox = document.getElementById("saveUserPass");
  badgeSelection = document.getElementById("badge");
  intervalSelection = document.getElementById("interval");
  customTimerSpan = document.getElementById("customTimer");
  timerSecondsTextbox = document.getElementById("timerSeconds");
  saveButton = document.getElementById("save-button");
  
  var username = chrome.extension.getBackgroundPage().getUsername();
  var password = chrome.extension.getBackgroundPage().getMd5Password();

  autoServerCheckbox.chcked = localStorage.autoServer ? (localStorage.autoServer === "true") : true;
  urlTextbox.value = localStorage.url || "";
  hostedServerTextbox.value = localStorage.hostedServer || "www.webhelpdesk.com";
  subscriberTextbox.value = localStorage.subscriber || "";
  useSslCheckbox.checked = localStorage.ssl ? (localStorage.ssl === "true") : true;
  autoCredentialsSelection.selectedIndex = localStorage.autoCredentialsIdx || 0;
  usernameTextbox.value = username; //(localStorage.saveUserPass === "true") ? (localStorage.username || "") : (sessionStorage.username || "");
  passwordTextbox.value = (password != "") ? "*****" : ""; //(localStorage.saveUserPass === "true") ? (localStorage.md5password ? "*****" : "") : (sessionStorage.md5password ? "*****" : ""); ///localStorage.password || "";
  saveUserPassCheckbox.checked = localStorage.saveUserPass ? (localStorage.saveUserPass === "true") : false;
  badgeSelection.selectedIndex = localStorage.badgeSelectionIdx || 1;
  intervalSelection.selectedIndex = localStorage.intervalSelectionIdx || 0;
  timerSeconds.value = localStorage.update || 60;
  if(intervalSelection.options[intervalSelection.selectedIndex].value == "custom") {
    customTimerSpan.style.display = "";
  }
  
  autoServerCheck();

  markClean();
}

function save() {
	//alert( 'saving...');
    localStorage.autoServer = autoServerCheckbox.checked ? "true" : "false";
  localStorage.url = urlTextbox.value;
  localStorage.hostedServer = hostedServerTextbox.value;
  localStorage.subscriber = subscriberTextbox.value;
  localStorage.ssl = useSslCheckbox.checked ? "true" : "false";
  localStorage.autoCredentialsIdx = autoCredentialsSelection.selectedIndex;
  localStorage.autoCredentials = autoCredentialsSelection.options[autoCredentialsSelection.selectedIndex].value;
  localStorage.saveUserPass = saveUserPassCheckbox.checked ? "true" : "false";
  /*
  if(localStorage.saveUserPass === "true" ) {
	localStorage.username = usernameTextbox.value;
	if( passwordTextbox.value != "*****" && passwordTextbox.value != "" ) {
	  localStorage.md5password = b64_md5( passwordTextbox.value );
	  passwordTextbox.value = "*****";
	}
  } else {
	sessionStorage.username = usernameTextbox.value;
	if( passwordTextbox.value != "*****" && passwordTextbox.value != "" ) {
	  sessionStorage.md5password = b64_md5( passwordTextbox.value );
	  passwordTextbox.value = "*****";
	}
  }*/
  // Because localStorage is page-specific, the function to save the username and password needs to exist
  //  in the background page.  But... we can still call it from here!
  chrome.extension.getBackgroundPage().setUserPass(usernameTextbox.value, passwordTextbox.value);
  if(passwordTextbox.value != "") {
	passwordTextbox.value = "*****";
  }
  localStorage.badgeSelectionIdx = badgeSelection.selectedIndex;
  localStorage.badge = badgeSelection.options[badgeSelection.selectedIndex].value;
  localStorage.intervalSelectionIdx = intervalSelection.selectedIndex;
  if(intervalSelection.options[intervalSelection.selectedIndex].value == "custom") {
    localStorage.update = timerSeconds.value;
  } else {
    localStorage.update = intervalSelection.options[intervalSelection.selectedIndex].value;
  }

  markClean();

  // init takes care of validation, returns true if validation passes
  if( chrome.extension.getBackgroundPage().init() ) {
	
	// username & password aren't strictly required, so that the button can serve simply as a shortcut to the login page
	if( ! usernameTextbox.value || ! passwordTextbox.value ) {
	    alert( chrome.i18n.getMessage( "whdnotifier_missing_username_or_password" ) );
    }
  }

}


function markDirty() {
//alert('dirty');
  saveButton.disabled = false;
}

function markClean() {
//	alert('clean');
  saveButton.disabled = true;
}

function updateInt() {
    if(intervalSelection.options[intervalSelection.selectedIndex].value == "custom") {
        customTimerSpan.style.display = "";
    } else {
        customTimerSpan.style.display = "none";
    }
}

function autoServerCheck() {
    urlTextbox.disabled = autoServerCheckbox.checked;
    hostedServerTextbox.disabled = autoServerCheckbox.checked;
    subscriberTextbox.disabled = autoServerCheckbox.checked;
    useSslCheckbox.disabled = autoServerCheckbox.checked;
}

window.onload = function() {
    init();
    
    $("select#interval").change(updateInt);
    $("input[type=text]").keyup(markDirty);
    $("input,select").change(markDirty);
    $("button#save-button").click(save);
    $("button#cancel-button").click(init);
    $("#autoServer").change(autoServerCheck);
};