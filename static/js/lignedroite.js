var map = L.map('map').setView([0, 0], 2);

// Créer la map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 10,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var Paris = [48.864716, 2.349014];
var Vancouver = [49.246292, -123.116226];
let trajLayer = L.geoJSON().addTo(map)

var mark1 = L.marker(Paris, {draggable : true}).bindPopup("Paris").addTo(map);     // Paris
var mark2 = L.marker(Vancouver, {draggable : true}).bindPopup("Vancouver").addTo(map); // Vancouver

// Trajectoire entre Paris et Vancouver
var start = turf.point([Paris[1], Paris[0]]);
var end = turf.point([Vancouver[1], Vancouver[0]]);
var greatCircle = turf.greatCircle(start, end);
trajLayer.addData(greatCircle);

function get_traj(mark1, mark2){
    trajLayer.clearLayers()
    var start = turf.point([mark1.lng, mark1.lat]);
    var end = turf.point([mark2.lng, mark2.lat]);
    var greatCircle = turf.greatCircle(start, end);
    trajLayer.addData(greatCircle);
}

mark1.on('drag', function() {
    get_traj(mark1.getLatLng(), mark2.getLatLng());
});

mark2.on('drag', function() {
    get_traj(mark1.getLatLng(), mark2.getLatLng());
});