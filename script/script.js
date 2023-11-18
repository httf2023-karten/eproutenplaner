// Initialize the platform object
var platform = new H.service.Platform({
	'apikey': 'ywXXgWjZ-a5NCDVW8-8_q_p1RyNyitRGtzubfSBafOQ'
});

// Obtain the default map types from the platform object
var defaultLayers = platform.createDefaultLayers();
var targetElement = document.getElementById('mapContainer')
// Instantiate (and display) the map
var map = new H.Map(
	targetElement,
	defaultLayers.vector.normal.map,
	{
		zoom: 100,
		center: { lng: 48.26888354, lat: 48.26888354 }
	}
);

// Create the default UI:
const ui = H.ui.UI.createDefault(map, defaultLayers);

var routingParameters = {
	"routingMode": "fast",
	"transportMode": "pedestrian",
	"origin": "48.26888354,7.72201145",
	"destination": "48.267849,7.723921",
	"return": "polyline"
}

var onResult = function(result) {
	if (result.routes.length) {
	result.routes[0].sections.forEach((section) => {
			 // Create a linestring to use as a point source for the route line
			let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

			// Create a polyline to display the route:
			let routeLine = new H.map.Polyline(linestring, {
				style: { strokeColor: 'blue', lineWidth: 3 }
			});

			// Create a marker for the start point:
			let startMarker = new H.map.Marker(section.departure.place.location);

			// Create a marker for the end point:
			let endMarker = new H.map.Marker(section.arrival.place.location);

			// Add the route polyline and the two markers to the map:
			map.addObjects([routeLine, startMarker, endMarker]);

			// Set the map's viewport to make the whole route visible:
			map.getViewModel().setLookAtData({bounds: routeLine.getBoundingBox()});
		});
	}
}

var router = platform.getRoutingService(null, 8);
router.calculateRoute(routingParameters, onResult,
function(error) {
	alert(error.message);
});

// MapEvents enables the event system.
// The behavior variable implements default interactions for pan/zoom (also on mobile touch environments).
const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Enable dynamic resizing of the map, based on the current size of the enclosing cntainer
window.addEventListener('resize', () => map.getViewPort().resize());