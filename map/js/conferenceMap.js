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

var currentMap;

function initializeMap() {
	// Only show the overview map at first
	$("#mainMapShow").hide();
	$("#confcentermap").hide();	
	$("#exhibithallmap").hide();	
	$("#mainMapShow").hide();	
	
	// Activate the return to overview button
	$("#mainMapShow_button").click(function (event) {
		clickMainMapShow(event.target);	
	});
	
	// Activate the click spots
	$("#confcenter-click").click(function (event) {
		clickConfCenter(event.target);	
	});
	
}

function clickConfCenter (tgt) {
	// hide the main map
	$("#overviewmap").hide();
	
	// show the conf center map
	$("#confcentermap").show(400);
	$("#mapName").text("Conference Center Detail");
	
	// Show the back button
	currentMap = "#confcentermap";
	$("#mainMapShow").show();
	
}

function clickMainMapShow(tgt) {
	// hide the currentMap
	$(currentMap).hide();
	$("#mapName").text("Convention Center Overview");
	
	// hide the button
	$("#mainMapShow").hide();
	
	
	// show the map
	$("#overviewmap").show(400);
}
