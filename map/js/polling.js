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

var iAmPolling = false;
var pollrate = 1;

function initializePolling() {
	// Activate select field
	//$('select').material_select();	
	
	// Disable the polling rate
	$("#pollingRate").prop("disabled", true);	
	
	// Activate the switches
	$("#autoPolling").click(function () {
		clickedOnAutoPolling();	
	});
	
	$("#pollingRate").change(function () {
		changedPollRate();	
	});
	
	$("#refresh_data").click(function (event) {
		//console.log("Refresh clicked");
		getWirelessAPHostGroups();
	});
}

function changedPollRate() {
	pollrate = Number($("#pollingRate").val());
	//console.log("Polling rate:" + pollrate);
}

function clickedOnAutoPolling() {
	// If I'm now checked then I activate the polling rate control
 	if ($("#autoPolling").prop("checked")) {
		$("#pollingRate").prop("disabled", false);
		startPolling();
 	} else {
		 $("#pollingRate").prop("disabled", true);
		 stopPolling();	
 	}
}

function startPolling() {
	// 
	//console.log("start poling");
	iAmPolling = true;
	pollForData();
}

function stopPolling() {
	//console.log("stop polling");
	iAmPolling = false;
}

function pollForData() {
	if (iAmPolling) {
		if (mode === "monitor") {
			// Don't poll in Configure mode.
				//console.log("Polling for data");  
				getWirelessAPHostGroups();
				var delayTime = pollrate*60*1000
				setTimeout(pollForData, delayTime);		
		}	else {
			// But I still need to restart the poll
			setTimeout(pollForData, delayTime);	
		}
	}
}