mapkit.init({ authorizationCallback: function(done) { done("your-token"); }});
mapkit.addEventListener("configuration-change", function(event) {
    switch (event.status) {
    case "Initialized":
        // MapKit JS initializes and configures.
        new mapkit.Map(
            "map"
        );
        console.log("MapKit JS init");
        break;
    case "Refreshed":
        // The MapKit JS configuration updates.
        break;
    }
});
