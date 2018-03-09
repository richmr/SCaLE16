/*
Copyright 2018 Michael R Rich (mike@tofet.net)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
documentation files (the "Software"), to deal in the Software without restriction, including without limitation 
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, 
and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions 
of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var zabServer;
var zabhost;
var zab_username = false;
var zab_password = false;

function zabbixAPIInitialize() {
	// Activate button(s)
	$("#loginModal-loginbutton").click(function (event) {
		clickedLogin();
	});
	
	// For testing
	initializeZabbixAuth();	
	
	if (wasDataSaved()) {
		loadAllData();
		$("#loginModal-login").val(zab_username);
		$("#loginModal-password").val(zab_password);
		$("#loginModal-zabbixapiurl").val(zabhost);
	}
	$("#loginModal").modal({
      dismissible: false // Modal can be dismissed by clicking outside of the modal
    });
    
    $("#loginModal").modal("open");
}

function clickedLogin() {
	// Get the username and password
	// initialize the zabbixServer
	$("#loginModal").modal("close");
	
	// Pull data
	zab_username = $("#loginModal-login").val();
	zab_password = $("#loginModal-password").val();
	zabhost = $("#loginModal-zabbixapiurl").val();
	
	// Open the status screen
	loginToZabbix_screen();
	
	// Make the calls
	zabServer = new $.jqzabbix({
	    url: zabhost,  // URL of Zabbix API
	    username: zab_username,   // Zabbix login user name
	    password: zab_password,  // Zabbix login password
	    basicauth: false,    // If you use basic authentication, set true for this option
	    busername: '',       // User name for basic authentication
	    bpassword: '',       // Password for basic authentication
	    timeout: 5000,       // Request timeout (milli second)
	    limit: 1000,         // Max data number for one request
	});
	
	zabServer.getApiVersion(null, zabbixAPICheckSuccess, null);
	zabServer.userLogin(null, zabbixAuthResponseSuccess, zabbixAuthResponseFail);
}

function getWirelessAPHostGroups() {
	// This will use the data in the Settings modal to find the host group ID(s)
	var params = {};
	params["search"] = {"name":apsearchterm};
	if (searchtype === "startSearch") {
		params["startSearch"] = 1;	
	}
	method = "hostgroup.get";
	zabServer.sendAjaxRequest(method, params, getHostgroupSuccess, getHostgroupFail);
 }
 
 function getHostgroupSuccess(response, status) {
 	
	// Now get the AP List(s)
	apgrouplists = response.result;
	
	// Did I get any data back?
	if (apgrouplists.length == 0) {
		openFailModal("No host group data was found.  Please check search settings or rename host groups in Zabbix");
		return;
	}
	
	groupids = [];
	$.each(apgrouplists, function (key, value) {
		// Collate all of the groupids
		groupids.push(value.groupid);
	});
	
	// Make call for all hosts in these groupids
	var params = {};
	params["groupids"] = groupids;
	params["selectInventory"]=["location_lat", "location_lon"]
	method = "host.get";
	zabServer.sendAjaxRequest(method, params, getHostsSuccess, getHostsFail);	
 }
 
 function getHostgroupFail() {
	// Open a fail modal?
	openFailModal("Failed to get host group data:  " + zabServer.isError());	
 }

function getHostsSuccess(response, status) {
	hostlist = response.result;
	

	if (hostlist.length == 0) {
		openFailModal("No wireless access points were found.  Please check search settings or the Zabbix database.");
		return;	
	}
	
// Debug step
	//console.log(hostlist);
	//return;	
	
	// Blow away current AP list (yikes)
	APList = [];
	$.each(hostlist, function (key, ahost) {
		// examine the lat long data
		theseCoords = false;
		if (ahost.inventory.length != 0) {
			if ("location_lat" in ahost.inventory) {
				if (ahost.inventory.location_lat) {
					if ("location_lon" in ahost.inventory) {
						if (ahost.inventory.location_lon) {
							theseCoords = [Number(ahost.inventory.location_lat), Number(ahost.inventory.location_lon)];						
						}					
					}				
				}
			}		
		}
		
		hostClientCount = 0
		// Getting accurate client count not implemented yet
		APList.push({id:ahost.hostid, host:ahost.host, mapCoord:theseCoords, currentClientCount:hostClientCount, notes:"Getting accurate client count not implemented yet"});
		
	});
	
	// update the info
	newAPdata();
	
}

function getHostsFail() {
	openFailModal("Failed to get host data:  " + zabServer.isError());
}

function openFailModal(msg) {
	$("#failMessage").text(msg);
	$("#failModal").modal("open");
}
