var map = L.map('map').setView([0, 0], 5);

// Créer la map
// Pour changer le type de cartographie, aller sur ce site https://leaflet-extras.github.io/leaflet-providers/preview/ choisir la cartographie et copier coller le code
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
}).addTo(map);

// Couleur du cercle en fonction de sa magnitude
function getColor(value){
    return value >= 6 ? '#e20909ff':
           value >= 5 ? '#ff8000ff':
           '#fffb00ff';
}

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";
fetch(url)
.then(r => r.json())
.then(json => { 
        // Ajout des cercles
        var circle = L.geoJSON(json, {
            pointToLayer: function (feature, latlng) {
                var mag = feature.properties.mag;
                return L.circleMarker(latlng, {
                    radius: mag**1.4,
                    fillColor: getColor(mag),
                    fillOpacity: 1, // Optionnelle 
                    stroke:false
                });
            },
        // Ajout des markers
        }).bindPopup(function(layer){
            return `
                    <h3>Magnitude : ${layer.feature.properties.mag}</h3>
                    <p><b>Date</b> : ${new Date(layer.feature.properties.time).getDate()} / 
                                     ${new Date(layer.feature.properties.time).getMonth()} /
                                     ${new Date(layer.feature.properties.time).getFullYear()}
                    </p>
                    <p><b>Place</b> : ${layer.feature.properties.place}</p>
                `
        })
        .addTo(map);
        // Centrer tous les points
        map.fitBounds(circle.getBounds());
    })