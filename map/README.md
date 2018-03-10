# SCaLE16 Map
Interactive map user interface for SCaLE 16.

Intended to be used to monitor wireless AP on the SCaLE floor.

Setup:
- Clone or download and unzip this repo to a web served folder
- Navigate to the url where the index.html file is.
- Provide your Zabbix log in credentials and the full URL for the Zabbix API file
- Click "Settings" and set up the Host Group search term and method you want to use.  For instance if your wireless AP are all stored in a group called "My Wireless AP", put that as your search term.  If you have several groups, start them all with the same prefix.  For example something like: "ap_scale".  The map will locate them all.
- Click either "Refresh Data" or  turn on Automatic Polling to load the available wireless AP
- If you don't see the AP you are looking for, then your search term is wrong, or the device is not listed and enabled in Zabbix
- AP with already established locations will be added to the map
- If the Configure button turns yellow, then there are AP that need to be added to the map
- Click the Configure button
- Tap an unplaced AP and then tap the map to place it.  The placement will be saved to Zabbix immediately.
- While in configure mode, tap an AP to allow you to remove it from the map.
- Data will not be automatically refreshed in Configure mode.  Tap the Monitor button to return to Monitor mode.

Warning!
- To allow for quicker subsequent logins, your Zabbix username and password will be saved to local storage.  You will need to clear your cache to remove this data.

Not Working:
- This does not currently ingest any status information, hopefully implemented at SCaLE 16
- Only tested against HTTP sites.  Uncertain if it works on HTTPS yet.


