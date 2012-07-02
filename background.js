var badgeCount = localStorage.badgeCount;
var updater = null;

String.prototype.startsWith = function(str) {return (this.match("^"+str)==str)}
String.prototype.endsWith = function(str) {return (this.match(str+"$")==str)}

function log_debug( msg ) {
    //console.log( msg );
}

function log_error( msg ) {
    console.log( msg );
}

function validateSettings() {
    var success = true;
    
    if( localStorage.url && localStorage.subscriber ) {
        alert( chrome.i18n.getMessage( "whdnotifier_invalid_config" ) );
        success = false;
    }
    else if( ! localStorage.url && ! localStorage.subscriber ) {
        alert( chrome.i18n.getMessage( "whdnotifier_config_help" ) );
        success = false;
    }
    else {
        if( localStorage.url ) {
            var url = localStorage.url;
            var errorMsg = null;
            if( url.indexOf( "/helpdesk/WebObjects/" ) < 0 
                && url.indexOf( "/cgi-bin/WebObjects/") < 0 ) 
            {
                errorMsg = chrome.i18n.getMessage( "whdnotifier_url_missing_adaptor" );
            }
            else if( ! url.endsWith( ".woa" ) ) {
                errorMsg = chrome.i18n.getMessage( "whdnotifier_url_missing_woa" );
            }
            else if( ! (url.startsWith( "http://") || url.startsWith( "https://" )) ) {
                errorMsg = chrome.i18n.getMessage( "whdnotifier_url_missing_proto" );
            }

            if( errorMsg ) {
                errorMsg += "\n\n" + chrome.i18n.getMessage( "whdnotifier_url_example" );
                alert( errorMsg );
            }
        }
        
    }
    
    
    
    return success;
}

function getHostedServer() {
    var server = localStorage.hostedServer;
    if( ! server )
        server = "www.webhelpdesk.com";
    return server;
}

function setUserPass(username, password) {
    if(localStorage.saveUserPass === "true" ) {
        localStorage.username = username;
        if( password != "*****" ) {
            if( password == "" ) {
                localStorage.md5password = "";
            } else {
                localStorage.md5password = b64_md5( password );
            }
            //passwordTextbox.value = "*****";
        }
    } else {
        sessionStorage.username = username;
        if( password != "*****" ) {
            if( password == "" ) {
                sessionStorage.md5password = "";
            } else {
                sessionStorage.md5password = b64_md5( password );
            }
            //passwordTextbox.value = "*****";
        }
    }
}

function getUsername() {
    if(localStorage.saveUserPass === "true") {
        return localStorage.username || "";
    } else {
        return sessionStorage.username || "";
    }
}

function getPassword() {
    if(localStorage.saveUserPass === "true") {
        return localStorage.password || "";
    } else {
        return sessionStorage.password || "";
    }
}

function getMd5Password() {
    if(localStorage.saveUserPass === "true") {
        return localStorage.md5password || "";
    } else {
        return sessionStorage.md5password || "";
    }
    /*
    //alert( "in getMd5Password");
    //alert( "password = " + getPassword() );
    var md5Password = null;
    if( getPassword() != null ) {
        md5Password = b64_md5( getPassword() );
    }
    //alert( "md5Password = " + md5Password );
    return md5Password;
    */
}

function getSubscriber() {
    //alert( "in getSubscriber" );
    var subscriberId = localStorage.subscriber;
    if( subscriberId == null || subscriberId < 0 || subscriberId == "" ) {
        subscriberId = 1;
    }
    
    //alert( "subscriberId = " + subscriberId );
    return subscriberId;
}

function getUseSsl() {
    return localStorage.ssl ==="true";
}

function getBaseUrl() {
    //alert ('in getBaseUrl')
    var baseUrl;
    
    if( localStorage.subscriber )
        baseUrl = (getUseSsl() ? "https" : "http") + "://" + getHostedServer() + "/cgi-bin/WebObjects/HostedHelpdesk.woa";
    else
        baseUrl = localStorage.url;
        
    //alert('baseUrl = ' + baseUrl);
    return baseUrl;
}

function getBadgeCountUrl() {

    //alert('In getBadgeCountUrl');
    var badgeType = localStorage.badge;
    //alert( 'badgeType = ' + badgeType );
    var subscriber = getSubscriber();
    //alert( "subscriber = " + subscriber );
    var username = getUsername();
    //alert( "username = " + username );
    var uriUsername = encodeURIComponent( getUsername() );
    //alert( "uriUsername = " + uriUsername );
    var md5Password = getMd5Password();
    //alert( "md5Password = " + md5Password );
    var uriMd5Password = encodeURIComponent( getMd5Password() );
    //alert( "uriMd5Password = " + uriMd5Password );
    
    var url = getBaseUrl() + "/wa/APNActions/techBadgeCount?accountId=" + getSubscriber() 
        + "&badgeType=" + badgeType + "&loginId=" + encodeURIComponent( getUsername() ) + "&md5Password=" + encodeURIComponent( getMd5Password() );
    //alert( "Got url!" );
    //alert( 'badgeCountUrl = ' + url );
    return url;
}

function getLoginUrl() {
    var url = getBaseUrl();
    
    // Don't provide the username and password because it will show up in the address bar, where it could be copied & pasted by an intruder
    // in order to get access. If 'login automatically' is checked, they'll only have to log in once.
    
    //if( getUseSsl() )
    //	url += "/wa/login?id=" + getSubscriber() + "&username=" + encodeURIComponent( getUsername() ) + "&md5Password=" + encodeURIComponent( getMd5Password() );
    
    // nh 6/17/10: There seems to be a bug when connecting to the hosted app using automatic login; it doesn't log you in.
    // Seems to be remedied by appending "/wa?id=#". This is a hack that may need to be cleaned up later.
    
    if( getSubscriber() )
        url += "/wa?id=" + getSubscriber();
    
    return url;
}


function updateBadgeCount() {
    updateBadge( badgeCount );
}

function reloadBadgeCount() {

    // don't waste time trying to get the badge count if we don't have a username or password
    if( getUsername() == null || getMd5Password() == null )
        return;
        
    //alert('In reloadBadgeCount' );
    log_debug('reloadBadgeCount(): url = ' + getBadgeCountUrl() );
     $.ajax({
        type: "GET",
        url: getBadgeCountUrl(),
        data: "",
        cache: false,
        dataType: "text",
        /*
        dataFilter: function(data) {
            //console.log( data );
            //console.log( 'dataFilter: ' + data );
            return data;
        },
        complete: function(XMLHttpRequest, textStatus) {
            //console.log( 'complete: ' + textStatus );
        },
        */
        success: function(data, textStatus, xhr) {
            //console.log( 'success: ' + data );
            //console.log( 'textStatus: ' + textStatus );
            //console.log( 'xhr: ' + xhr );
            log_debug( 'techBadgeCount returned: \n"' + data + '"' );
            re = /^Web Help Desk ([0-9\.]+)\n(.*)$/;
            var reGroups = re.exec( data );
            if( reGroups && reGroups.length >= 3 ) {
                //alert( 'match returned: ' + reGroups );
                //alert( 'whd version: ' + reGroups[1] );
                //alert( 'badge count: ' + reGroups[2] );
                badgeCount = reGroups[2];
            }
            else {
                badgeCount = 0;
            }
            
            
            if(badgeCount > localStorage.badgeCount) {
                // If new badge count has more tickets, there's a new or updated ticket to look at!
                whdNotify( badgeCount );
            }
            
            // store in settings so it persists between launches
            localStorage.badgeCount = badgeCount;	
            updateBadge( badgeCount );	
            chrome.browserAction.setPopup({popup: ""});
        },
        error:function (xhr, textStatus, thrownError){
            badgeCount = 0;
            updateBadge( badgeCount );
            if(getUsername() != "" && getMd5Password() != "") { // Only throw error if username and password are not filled out
                alert( xhr.status + " error while fetching tech badge count. Check your Options settings." );
                log_error( "Error while fetching badge count: " + xhr.status + " (" + thrownError + ") -- check your Options settings.");
            } else {
                updateBadge( "login" );
                chrome.browserAction.setPopup({popup: "popup.html"});
            }
         }
      });
}

function whdNotify(n) {
    var notification = webkitNotifications.createNotification(
        'icon_128.png',
        'New or Updated Ticket',
        'New/Updated ticket count is now '+n+'.'
    );
    notification.onshow  = notification.ondisplay = function() { setTimeout(function() { notification.cancel(); }, 5000); };
    notification.show();
}

function updateBadge(n) {
    if( n == 0 )
        n = "";
    chrome.browserAction.setBadgeText({text:n});
}

function isHelpdeskUrl(url) {
    // This is the Gmail we're looking for if:
    // - starts with the correct gmail url
    // - doesn't contain any other path chars
    var isMatch = false;
    
    var whdUrl = getBaseUrl();

    if( whdUrl && url.startsWith( whdUrl ) )
        isMatch = true;
        
    return isMatch;
}

function goToHelpdesk() {
    if( validateSettings() ) {
        chrome.tabs.getAllInWindow(undefined, function(tabs) {
            for (var i = 0, tab; tab = tabs[i]; i++) {
                if (tab.url && isHelpdeskUrl(tab.url)) {
                    chrome.tabs.update(tab.id, {selected: true, url:getLoginUrl()});
                    return;
                }
            }
            chrome.tabs.create({url: getLoginUrl()});
        });
    }
}

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.browserAction.getPopup({}, function(pop) {
    if(pop == "") {
        goToHelpdesk();
    }
  });
});

chrome.extension.onMessage.addListener(function (details) {
    if(details['act'] == "loginInit") {
        if((localStorage.autoServer ? (localStorage.autoServer === "true") : true) && details['server']) {
            localStorage.url = details['server'];
        }
        if(details['origin'] == "autoLogin") {  // If coming from autoLogin...
            if(!localStorage.autoCredentials || // Check if using default setting
                localStorage.autoCredentials == "always" || // Or always auto-grabbing
                (localStorage.autoCredentials == "sometimes" && // Or somtimes...
                    getUsername() == "" &&                      // With blank username
                    getMd5Password() == "")                     // And blank password
            ) {
                setUserPass(details['username'], details['password']);
                init();
            }
        } else {    // If not coming from autoLogin, we don't care!
            setUserPass(details['username'], details['password']);
            init();
        }
    }
    return true;
});

function init() {
    var success = false;
    log_debug( "init()" ); 
    //alert( 'init');
    chrome.browserAction.setBadgeBackgroundColor({color:[208, 0, 24, 255]});
    chrome.browserAction.setIcon({path:"whd_icon.png"});
    chrome.browserAction.setTitle({title:chrome.i18n.getMessage("whdnotifier_name")});

    if( updater )
        window.clearInterval( updater );

    if( validateSettings() && localStorage.update ) {
        //alert('setting updater interval');
        updater = window.setInterval(reloadBadgeCount, localStorage.update * 1000);
        reloadBadgeCount();
        success = true;
    }
    else {
        badgeCount = localStorage.badgeCount = 0;
        updateBadge( badgeCount );
    }
    
    return success;
}

init();