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

function initializeTestData() {
	APList.push({id:1, host:"AP Ballroom 1", mapCoord:[515,327], currentClientCount:0, notes:"Selected log lines go here"});
	APList.push({id:2, host:"AP Ballroom 2", mapCoord:[550,270], currentClientCount:0, notes:"Selected log lines go here"});
	APList.push({id:3, host:"AP Ballroom 3", mapCoord:[623,330], currentClientCount:0, notes:"Selected log lines go here"});
	APList.push({id:4, host:"AP Conference Center 1", mapCoord:[141,108], currentClientCount:0, notes:"Selected log lines go here"});
	APList.push({id:5, host:"AP Conference Center 2", mapCoord:[381,109], currentClientCount:0, notes:"Selected log lines go here"});
	APList.push({id:6, host:"AP Exhibit Hall A 1", mapCoord:[570,408], currentClientCount:0, notes:"Selected log lines go here"});
	APList.push({id:7, host:"AP Exhibit Hall B 1", mapCoord:[505, 542], currentClientCount:0, notes:"Selected log lines go here"});
	APList.push({id:8, host:"AP Exhibit Hall B 2 ", mapCoord:[637,545], currentClientCount:0, notes:"Selected log lines go here"});
	APList.push({id:9, host:"AP Ice Rink 1 ", mapCoord:false, currentClientCount:0, notes:"Selected log lines go here"});
	APList.push({id:10, host:"AP Ice Rink 2 ", mapCoord:false, currentClientCount:0, notes:"Selected log lines go here"});
	
	
	newAPdata();
	
	$("#sim_data").click(function (event) {
		getWirelessAPHostGroups();
		//randomData();
		//newAPdata();
	});
}

function randomData() {
	// Updates the clientCounts randomly
	$.each(APList, function (key, APItem) {
		APItem["currentClientCount"] = _.random(100);
	});
}