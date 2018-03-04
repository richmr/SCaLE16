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

function initializeAPCollections() {
	// Not sure what needs to be done here
	// There is some initialization, but needs to be done as lines are added
	$("#unplacedAPDetailedData").hide();
}

function updateCollections(yellowThreshold, redThreshold) {
	// first alphabatize the AP List
	var sortedAPList = _.sortBy(APList, ['id']);
	
	// Delete the current info in collections
	// Add the "last rows" first
	$("#activeAPDetailedData").html('<div id="lastPlacedAP"></div>');
	$("#unplacedAPDetailedData").html('<div id="lastUnplacedAP"></div>');
		
	// iterate over the AP list and "before" them into the list
	$.each(sortedAPList, function (key, thisAP) {
		// If it has a coord, it is active
		if (thisAP["mapCoord"]) {
			addActiveAP(thisAP, yellowThreshold, redThreshold);
		} else {
			addUnplacedAP(thisAP);		
		}
	});
	
	// Activate clicking for the unplaced AP
	$(".collection-item", $("#unplacedAPDetailedData")).click(function (event) {
		// look for a current active element
		console.log("Unplaced AP click event");
		if (activeAP = $(".active", $("#unplacedAPDetailedData"))) {
			$(activeAP).removeClass("active");
		}
		$(this).addClass("active");
	});
}

function addActiveAP(thisAP, yellowThreshold, redThreshold) {
	// Returns a new collapsible html string
	var htmlstring = "<li>";
	
	var id = thisAP["id"].split(" ").join("_");
	var headerid = id+"_header";
	var bodyid = id+"_body";
	
	var textcolor = "green-text";
	if (thisAP["currentClientCount"] >= yellowThreshold) {
		textcolor = "yellow-text";
	}
	if (thisAP["currentClientCount"] >= redThreshold) {
		textcolor = "red-text";
	}
	
	// header
	htmlstring += '<div id="'+headerid+'" class="collapsible-header '+textcolor+'">'+thisAP["id"]+' ------ Current Client Count: '+thisAP["currentClientCount"]+'</div>';
	
	// body
	htmlstring += '<div class="collapsible-body"><span>'+thisAP["notes"]+'</span></div>';
	
	htmlstring += '</li>'
	
	// Add it and add some needed data
	$("#lastPlacedAP").before(htmlstring)
	$("#"+headerid).data("origID", thisAP["id"]);
	
	// Activate the collapsibles
	$("#"+headerid).collapsible();
	$("#"+bodyid).collapsible();
	
	// Activate the click response
	$("#"+headerid).click(function () {
		// Find the AP associated with this line
		var id = $(this).data("origID");
		var APdata = _.find(APList, ["id", id]);
		var coord = APdata["mapCoord"];
		map.getView().setCenter(coord);
	});	
}

function addUnplacedAP(thisAP) {
	// Returns a new collapsible html string
	var htmlstring = "";
	
	var id = thisAP["id"].split(" ").join("_");
	
	// entry
	htmlstring += '<a href="#!" id="'+id+'" class="collection-item">'+thisAP["id"]+' (Select and then click map to place)</a>';
	
	// Add it and add needed data
	$("#lastUnplacedAP").before(htmlstring);
	$("#"+id).data("origID", thisAP["id"]);
	
	
}