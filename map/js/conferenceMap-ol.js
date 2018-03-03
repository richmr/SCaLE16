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
              //attributions: '© <a href="http://xkcd.com/license.html">xkcd</a>',
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
	
	map.on('click', function (event) {
		//var coord = map.getCoordinateFromPixel(event.pixel);
		markerTest(event.pixel);
	});
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