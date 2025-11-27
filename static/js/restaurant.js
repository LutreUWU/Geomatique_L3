
var map = new maplibregl.Map({
        container: 'map', // container id
        center: [0, 0], // starting position [lng, lat]
        zoom: 1, // starting zoom
    });

let hoveredStateId = null;
 map.setStyle('https://tiles.openfreemap.org/styles/bright', {
            transformStyle: (previousStyle, nextStyle) => {
                nextStyle.projection = {type: 'globe'};
                nextStyle.sources = {
                    ...nextStyle.sources,
                    satelliteSource: {
                        type: 'raster',
                        tiles: [
                            'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg'
                        ],
                        tileSize: 256
                    },
                    terrainSource: {
                        type: 'raster-dem',
                        url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
                        tileSize: 256
                    },
                    hillshadeSource: {
                        type: 'raster-dem',
                        url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
                        tileSize: 256
                    }
                }
                nextStyle.terrain = {
                    source: 'terrainSource',
                    exaggeration: 1
                }

                nextStyle.sky = {
                    'atmosphere-blend': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0, 1,
                        2, 0
                    ],
                }

                nextStyle.layers.push({
                    id: 'hills',
                    type: 'hillshade',
                    source: 'hillshadeSource',
                    layout: { visibility: 'visible' },
                    paint: { 'hillshade-shadow-color': '#473B24' }
                })

                const firstNonFillLayer = nextStyle.layers.find(layer => layer.type !== 'fill' && layer.type !== 'background');
                nextStyle.layers.splice(nextStyle.layers.indexOf(firstNonFillLayer), 0, {
                    id: 'satellite',
                    type: 'raster',
                    source: 'satelliteSource',
                    layout: { visibility: 'visible' },
                    paint: { 'raster-opacity': 1 }
                });

                return nextStyle;
            }
});
 map.on('load', async () => {
        map.addSource("my-geojson-source", {
            type: 'geojson',
            data: './static/file/restaurants.geojson'
        })

        map.addLayer({
            id: 'restaurants',
            type: 'circle',
            source: 'my-geojson-source',
            paint: {
                'circle-radius': [
                                  'interpolate',
                                 ['linear'],
                                 ['zoom'],
                                 2, 4,   
                                 6, 6, 
                                 12, 9  
                                 ],
                'circle-color': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    '#ff0000', // rouge si hover
                    'blue'     // bleu sinon
                ]
            },
        });

        // Create a popup, but don't add it to the map yet.
        const popup = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false
        });

         let currentFeatureCoordinates = undefined;
        map.on('mousemove', 'restaurants', (e) => {
            if (e.features.length > 0) {
                if (hoveredStateId) {
                    map.setFeatureState(
                        {source: 'my-geojson-source', id: hoveredStateId},
                        {hover: false}
                    );
                }
                hoveredStateId = e.features[0].id;
                map.setFeatureState(
                    {source: 'my-geojson-source', id: hoveredStateId},
                    {hover: true}
                );
            }

            const featureCoordinates = e.features[0].geometry.coordinates.toString();
            if (currentFeatureCoordinates !== featureCoordinates) {
                currentFeatureCoordinates = featureCoordinates;

                map.getCanvas().style.cursor = 'pointer';

                const coordinates = e.features[0].geometry.coordinates.slice();
                const description = e.features[0].properties.name;

                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                popup.setLngLat(coordinates).setHTML(description).addTo(map);
            }
        });

        map.on('mouseleave', 'restaurants', () => {
            if (hoveredStateId) {
                map.setFeatureState(
                    {source: 'my-geojson-source', id: hoveredStateId},
                    {hover: false}
                );
            }

            hoveredStateId = null;
            currentFeatureCoordinates = undefined;
            map.getCanvas().style.cursor = '';
            popup.remove();
        });
});


