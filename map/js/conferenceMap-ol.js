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

var map;
var APMarkerLayer = false;
var origMapSize = [];
var mode = "monitor";

function initializeMap() {
	 // Map views always need a projection.  Here we just want to map image
      // coordinates directly to map coordinates, so we create a projection that uses
      // the image extent in pixels.
      var extent = [0, 0, 735, 675];
      var projection = new ol.proj.Projection({
        //code: 'xkcd-image',
        units: 'pixels',
        extent: extent
      });

      map = new ol.Map({
        layers: [
          new ol.layer.Image({
            source: new ol.source.ImageStatic({
              attributions: 'APMap by Michael R. Rich',
              url: 'images/pasadena-convention-center-map-full.jpg',
              projection: projection,
              imageExtent: extent
            })
          })
        ],
        target: 'map',
        view: new ol.View({
          projection: projection,
          center: ol.extent.getCenter(extent),
          zoom: 1,
          maxZoom: 5
        })
      });
	
	// Activate the mode buttons
	$("#monitor_mode").click( function (event) {
		clickedOnMonitorMode();
	});
	
	$("#configure_mode").click( function (event) {
		clickedOnConfigureMode();
	});
      
	// Map starts on Monitor mode
	$("#save_placement").show().addClass("disabled");
	clickedOnMonitorMode();
	
	// Map does funny things when screen resized.  Let's grab the original size to restore it later
	origMapSize = map.getSize();
	
	// Establish a resize listener
	$(window).resize(function() {
		// Get current width
		var currSize = map.getSize();
		map.setSize([currSize[0], origMapSize[1]]);
	});
	
	// Establish map click
	map.on('click', function (event) {
		//var coord = map.getCoordinateFromPixel(event.pixel);
		mapClick(event.pixel);
	});	
	
}

function clickedOnMonitorMode() {
	$("#monitor_mode").addClass("disabled");
	$("#configure_mode").removeClass("disabled");
	$("#unplacedAPDetailedData").hide();
	$("#save_placement").hide();
	$("#activeAPDetailedData").show();
	mode = "monitor";
	console.log("Monitor mode activated");
} 

function clickedOnConfigureMode() {
	$("#monitor_mode").removeClass("disabled");
	$("#configure_mode").addClass("disabled");
	$("#unplacedAPDetailedData").show();
	$("#save_placement").show();
	$("#activeAPDetailedData").hide();
	mode = "configure";
	console.log("configure mode activated");
} 

function mapClick(pixelCoords) {
	if (mode=="monitor") {
		mapClickMonitor(pixelCoords);
	} else if (mode == "configure") {
		mapClickConfigure(pixelCoords);
	}
}

function mapClickConfigure(pixelCoords) {
	// Check if there is an unplaced AP already selected
	console.log("mapClickConfigure.. click.");
	if (selectedAPid = $(".active", $("#unplacedAPDetailedData")).data("origID")) {
		// Then we place a marker at the map location
		// Just make it green.  Data will update eventually
		coord = map.getCoordinateFromPixel(pixelCoords);	
		addAPMarker(coord, selectedAPid);
		// Update the AP List
		thisAP = _.find(APList, ['id', selectedAPid]);
		thisAP["mapCoord"]=coord;
		newAPdata();
		$("#save_placement").removeClass("disabled");
	} else if (map.hasFeatureAtPixel(pixelCoords)) {
		// Pop open edit AP modal
		// Set ID of feature found
		var thisFeature = map.getFeaturesAtPixel(pixelCoords)[0];
		$("#editAPModal").data("id", thisFeature.getId());
		$("#editAPModal").modal("open");	
	}
}
	
function mapClickMonitor(pixelCoords) {
	// Basically trigger the accordian in the data display
	if (map.hasFeatureAtPixel(pixelCoords)) {
		console.log("mapClickMonitor.. click.");
		var thisFeature = map.getFeaturesAtPixel(pixelCoords)[0];
		// get the Id
		var id = thisFeature.getId();
		var queryid = id.split(" ").join("_");
		var headerid = queryid+"_header";
		$("#"+headerid).click();
	}
}	

function newAPdata() {
	// Goes through all APs
	var clientCount = [];
	$.each(APList, function (key, APItem) {
		if (APItem["mapCoord"]) {
			clientCount.push(APItem["currentClientCount"]);
		}
	});
	// Calculates mean and std dev for colorization, only drawing from positioned AP
	var stat = jStat(clientCount);
	var mean = stat.mean();
	var stddev = stat.stdev();
		
	// Goes through all APs
	// If AP is in feature list already, then updates color as needed
	// Also sends AP object to the collection item code
	var yellowThreshold = mean + stddev + 1;  // Harmless hack to prevent AP from turning red if no actual data
	var redThreshold = mean + (2*stddev) + 2;
	$.each(APList, function (key, APItem) {
		if (! APMarkerLayer) {
			// This is the first marker!
			if (coord = APItem["mapCoord"]) {
				var statusColor = "green";
				if (APItem["currentClientCount"] >= yellowThreshold) {
					statusColor = "yellow";
				}
				if (APItem["currentClientCount"] >= redThreshold) {
					statusColor = "red";
				}
				addAPMarker(coord, APItem["id"], statusColor);
			}
		} else {
			// Look for this APItemID in the features list
			if ( thisFeature = APMarkerLayer.getSource().getFeatureById(APItem["id"])) {
				var statusColor = "green";
				if (APItem["currentClientCount"] >= yellowThreshold) {
					statusColor = "yellow";
				}
				if (APItem["currentClientCount"] >= redThreshold) {
					statusColor = "red";
				}
				// Set the feature
				thisFeature.setStyle(getAPIconStyle(statusColor));
			} else if (coord = APItem["mapCoord"]) {
				// Then this isn't in our feature list AND it has map coords
				// add it to the layer
				var statusColor = "green";
				if (APItem["currentClientCount"] >= yellowThreshold) {
					statusColor = "yellow";
				}
				if (APItem["currentClientCount"] >= redThreshold) {
					statusColor = "red";
				}
				addAPMarker(coord, APItem["id"], statusColor);
			}
		}
	});
	// Trigger the update to the collections
	updateCollections(yellowThreshold, redThreshold);	
}

function monitorClick(pixelCoords) {
	// Clicked on the map in monitor mode
	
}

function removeAPMarker(id) {
	if (thisAPMarker = APMarkerLayer.getSource().getFeatureById(id)) {
		// delete it
		APMarkerLayer.getSource().removeFeature(thisAPMarker);
		// Reset map coords
		thisAP = _.find(APList, ['id', id]);
		thisAP["mapCoord"] = false;
		newAPdata();	
	}
}

function addAPMarker(mapCoord, id, statusColor="green") {
	var iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(mapCoord)
      });
      
      iconFeature.setId(id);
      iconFeature.setStyle(getAPIconStyle(statusColor));
      
      if (! APMarkerLayer) {
			var vectorSource = new ol.source.Vector({
				features: [iconFeature]
			});
			APMarkerLayer = new ol.layer.Vector({
			   source: vectorSource
			});
			map.addLayer(APMarkerLayer);
		} else {
			APMarkerLayer.getSource().addFeature(iconFeature);		
		}
}

function markerTest(coord) {
// [513.0956804752351, 269.67467397451395]
//APMarkerLayer.getSource().getFeatures()[0].getStyle().getImage()

	if (map.hasFeatureAtPixel(coord)) {
		// Turn it yellow
		var thisFeature = map.getFeaturesAtPixel(coord)[0];
		
		// Set new style
		thisFeature.setStyle(getAPIconStyle("yellow"));
		return;
	}
	coord = map.getCoordinateFromPixel(coord);
	console.log("Coords: "+coord);
	
	var iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(coord),
        name: 'AP Point',
      });

    iconFeature.setStyle(getAPIconStyle("green"));

      

		if (! APMarkerLayer) {
			var vectorSource = new ol.source.Vector({
				features: [iconFeature]
			});
			APMarkerLayer = new ol.layer.Vector({
			   source: vectorSource
			});
			map.addLayer(APMarkerLayer);
		} else {
			APMarkerLayer.getSource().addFeature(iconFeature);		
		}

}

function getAPIconStyle(color="green") {
	// returns a ol-styled AP Icon
	var iconStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src: 'images/wifi-ap.png',
          scale: 0.1,
          color: color
         }))});

	return iconStyle;
}