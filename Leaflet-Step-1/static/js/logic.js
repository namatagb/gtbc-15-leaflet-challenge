var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

d3.json(queryUrl).then(function (data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            radius: feature.properties.mag * 6,
            fillOpacity: 1,
            stroke: true,
            color: 'black',
            weight: 0.85,
            fillColor: getColor(feature.geometry.coordinates[2])
        }
    });

    createMap(earthquakes);
};

function createMap(earthquakes) {
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    var baseMaps = {
        "Street Map": street,
        "Topography": topo
    };

    var overlayMaps = {
        "Earthquakes": Earthquakes
    };

    function getColor(depth) {
        if (depth > 90) {
            return '#EF6641'
        }
        else if (depth < 70) {
            return '#F8C342'
        }
        else if (depth < 50) {
            return '#DAF842'
        }
        else if (depth < 30) {
            return '#A5F842'
        }
        else if (depth < 10) {
            return '#86F067'
        }
        else {
            return '#67F079'
        }
    };



    var myMap = L.map("map", {
    center: [40.73, -74.0059],
    zoom: 3,
    layers: [street, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(myMap);
};


d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson").then(createMarkers);
