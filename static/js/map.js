var map = L.map('map').setView([0, 0], 0);

// Créer la map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 10,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Initialisation d'une couche vide
let markers = L.geoJSON().bindPopup(function (layer) {
    return `
        <h3>${layer.feature.properties.label}</h3>
        <p>${layer.feature.properties.context}</p>
    `;
}).addTo(map);


// Pour empêcher le refresh de la balise form
var form = document.getElementById("entete");
function handleForm(event) { event.preventDefault(); }
form.addEventListener('submit', handleForm);

// Requête API à la base de donnée geopf
function request_API(input){
    var url = `https://data.geopf.fr/geocodage/search?q=${input}`;
    fetch(url)
    .then(r => r.json())
    .then(json => { // Centrer la carte sur tout les points obtenus
        markers.addData(json); 
        map.fitBounds(markers.getBounds()); 
    })
}

// Gérer le clique du boutton
var button = document.getElementById("button"); // ID Boutton
button.addEventListener("click", function(){ 
    var input = document.getElementById("recherche").value; // Obtenir la valeur de l'input
    markers.clearLayers();
    request_API(input);
})

