document.getElementById("body").style.height = window.screen.availHeight/2;
document.getElementById("body").style.width = window.screen.availWidth/2;

function filter(){
  var coastertypes = [];
  var checkcoastertypes=["watercoaster","rollercoaster","themecoaster","transport"]
  for(type of checkcoastertypes){
    if(document.getElementById(type).checked){coastertypes.push(type)};
  }
  filterData = {
		"age":document.getElementById("age").value,
		"height":document.getElementById("height").value,
		"parents":(document.getElementById("parents").value == "ja"),
		"coastertype":coastertypes,
		"onlypregnant":(document.getElementById("pregnant").value == "ja"),
		"gastronomy": (document.getElementById("gastronomy").value == "ja")
  }
  filteredData = [];
  possibleData = [];

  for(i of data){
		if(filterData.gastronomy && i.type == "gastronomy"){
			filteredData.push(i);
		}
    if(filterData.coastertype.includes(i.typeofcoaster) && (!filterData.onlypregnant || i.pregnant == "yes")){
	    if(!filterData.parents){
	      if((i.minAge != null && i.minAge <= filterData.age) && (i.minHeight != null && i.minHeight <= filterData.height)){
	        filteredData.push(i)
	      }
	    }else{
	      if((i.minAgeAdult != null && i.minAgeAdult <= filterData.age) && (i.minHeightAdult != null && i.minHeightAdult <= filterData.height)){
	        filteredData.push(i)
	      }
	    }
    }
  }
  //console.log(JSON.stringify(filteredData));
  map.removeAnnotations(map.annotations)
  addFilteredAnnotations()
}
mapkit.init({
  authorizationCallback: function(done) {
    fetch("https://fast-otter-58.deno.dev/")
      .then(res => res.text())
      .then(done);
  },
  language: "de"
});
function route(){
  map.removeOverlays(map.overlays)
  destination = map.selectedAnnotation.coordinate
  directions.route({
    origin: map.userLocationAnnotation.coordinate,
    destination: destination,
    transportType: mapkit.Directions.Transport.Walking
  }, showRouteCallback)
}
function showRouteCallback(error, data) {
  if (error != null) {
    console.error(error)
  } else {
    map.addOverlay(data.routes[0].polyline)
  }
}
var map;
var directions;
var calloutDelegate = {
  // Return a div element and populate it with information from the
  // annotation, including a link to a review site.
  calloutContentForAnnotation: function(annotation) {
    var element = document.createElement("div");
    element.className = "attraction-callout";
    var title = element.appendChild(document.createElement("b"));
    title.textContent = annotation.title;
    var area = element.appendChild(document.createElement("p"))
    area.textContent = annotation.data.area
    var routing = element.appendChild(document.createElement("button"))
    routing.textContent = "Route"
    routing.onclick = function() {route(annotation.item)}
    // Add more content.
    element.style.width = "240px";
    element.style.height = "120px";
    return element;
  },
};

mapkit.addEventListener("configuration-change", function(event) {
  switch (event.status) {
  case "Initialized":
    defaultRegion = new mapkit.CoordinateRegion(new mapkit.Coordinate(48.265289, 7.721272), new mapkit.CoordinateSpan(0.008, 0.008))
    directions = new mapkit.Directions({language: "de-DE"})
    // MapKit JS initializes and configures.
    console.info("Showing map")
    map = new mapkit.Map('mapContainer', { region: defaultRegion, showsScale: mapkit.FeatureVisibility.Adaptive, mapType: mapkit.Map.MapTypes.Hybrid, showsPointsOfInterest: false, showsUserLocation: true, showsUserLocationControl: true });
    break;
  case "Refreshed":
    // The MapKit JS configuration updates.
    addFilteredAnnotations()
    break;
  }
});
var pinColor;
function addFilteredAnnotations() {
  filteredData.forEach(item => {
  // your code here
      //console.info(`Adding annotation for ${item.name}.`)
      if (item.type == "gastronomy") {
        pinColor = "teal"
      } else {
        switch (item.typeofcoaster) {
          case "transport":
            pinColor = "lightskyblue"
            break;
          case "themecoaster":
            pinColor = "purple"
            break;
          case "rollercoaster":
            pinColor = "pink"
            break;
          case "playground":
            pinColor = "green"
            break;
          default:
            pinColor = "#ff5b40"
        }
      }
      annot = new mapkit.MarkerAnnotation(new mapkit.Coordinate(item.latitude, item.longitude), { color: pinColor, title: item.name, callout: calloutDelegate, data: item })
      map.addAnnotation(annot)
  });
}