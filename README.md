WHD Notifier
============

Based on the official [WHD Notifier](https://chrome.google.com/webstore/detail/dfijaohkokappmgggfcldmnepdpcalkm).  This notifier has been updated to add additional features -- mainly, notifications when the new/updated ticket count increases.  As with the official notifier, this one is compatible with WHD 10.0.8  and above.


Major Changes
------------

1. Pop-up notifications when the ticket count selected increases
2. Ability to save username and password for session only
3. Login popup when clicking on icon when it displays "Login"
4. Automatically grabs credentials upon logging in to WHD on the web


Todo
------------

1. Use the [WHD REST API](http://downloads.webhelpdesk.com/api/) instead of the current whatever-it-is.
    * Should allow more customization of where we check for updates
    * Possibly allows a "latest ticket" popup when clicking on icon
2. Add more options:
    * Custom refresh timer
    * Turn off automatically grabbing credentials
    * Automatically grab URL of WHD install, as well as credentials
3. Ideas? [File an enhancement issue](https://github.com/TrueJournals/whd-notifier/issues/new)