// require('../../../scss/data-download.scss');
// define mapbox map
const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
    center: [-99.341389, 31.330000],
    zoom: 6.1
});

var layerData = {
    user_name: 'tnris-flood',
    sublayers: [{
            sql: "SELECT * FROM county_extended",
            cartocss: '{}'
        }],
    maps_api_template: 'https://tnris-flood.carto.com'
};

cartodb.Tiles.getTiles(layerData, function (result, error) {
  if (result == null) {
    console.log("error: ", error.errors.join('\n'));
    return;
  }
  console.log("url template is ", result.tiles[0]);

  var tiles = result.tiles.map(function (tileUrl) {
    return tileUrl
      .replace('{s}', 'a')
      .replace(/\.png/, '.mvt');
  });
  console.log(tiles);
  map.addSource('counties_source', { type: 'vector', tiles: tiles });
  map.addLayer({
      id: 'counties-extended',
      'type': 'fill',
      'source': 'counties_source',
      'source-layer': 'layer0',
      'paint': {
        'fill-color': 'rgba(100,100,100,0.2)',
        'fill-outline-color': '#faafee'
      }
  });
});



// Carto Vl way of doing things
const countySource = new carto.source.Dataset('county_extended');

const countyViz = new carto.Viz({
  color: s.rgba(255,255,255,0.1),
  strokeColor: s.rgb(0,0,0),
  strokeWidth: 10,
  variables: {name: s.prop('name'), fips_code: s.prop('fips_code')}
});

const countyLayer = new carto.Layer('countyLayer', countySource, countyViz);

const countyInteractivity = new carto.Interactivity(countyLayer);

countyInteractivity.on('featureHover', event => {
  map.getCanvas().style.cursor = event.features.length ? 'pointer' : ''
});

countyInteractivity.on('featureEnter', event => {
  if (event.features.length) {
    let feature = event.features[0];
    feature.color.blendTo('opacity(DeepPink, 0.5)', delay);
  }
});

countyInteractivity.on('featureLeave', event => {
  if (event.features.length) {
    let feature = event.features[0];
    feature.color.reset(delay);
  }
});

// countyLayer.addTo(map, 'floodLayer');
// map.setLayerZoomRange('floodLayer', 8, 15);
