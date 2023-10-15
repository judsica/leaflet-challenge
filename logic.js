// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Define a function 
  function getMarkerSize(magnitude) {
    return magnitude * 5; 
  }

  // Define a function for marker size
  function getMarkerColor(depth) {
    if (depth < 10) return "#00FF00"; 
    else if (depth < 30) return "#FFFF00"; 
    else return "#FF0000"; 
  }

  // Define a function to make popups
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]}`);
  }

  // Create a GeoJSON layer 
  let earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: getMarkerSize(feature.properties.mag),
        fillColor: getMarkerColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      });
    },
    onEachFeature: onEachFeature,
  });

  createMap(earthquakes);
}

function createMap(earthquakes) {
  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold the earthquake data.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the street map and earthquake layers to display on load.
  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [street, earthquakes] 
  });

  // Legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5, 6, 7, 8],
      labels = [];

    for (let i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getMarkerColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
  };

  legend.addTo(myMap);


}