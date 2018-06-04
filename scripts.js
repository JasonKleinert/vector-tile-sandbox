// require('../../../scss/data-download.scss');
// define mapbox map
const map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
    center: [-99.341389, 31.330000],
    zoom: 6.1
});

map.addControl(new mapboxgl.NavigationControl(), 'top-left')

// add the layers to the mapbox gl map
map.on('load', function() {
  const cartoLayers = ['usgs_doq_names_wgs84', 'county_extended'];
  const tileUrls = {};

  // define county layer and add it to the map
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
    // console.log("url template is ", result.tiles[0]);

    var tiles = result.tiles.map(function (tileUrl) {
      return tileUrl
        .replace('{s}', 'a')
        .replace(/\.png/, '.mvt');
    });

    map.addSource('county_extended_source', { type: 'vector', tiles: tiles });
    map.addLayer({
        id: 'county_extended',
        'type': 'fill',
        'source': 'county_extended_source',
        'source-layer': 'layer0',
        'paint': {
          'fill-color': 'rgba(100,100,100,0)',
          'fill-outline-color': '#969696'
        }
    });

    map.addLayer({
        id: 'county_extended_hover',
        'type': 'fill',
        'source': 'county_extended_source',
        'source-layer': 'layer0',
        'maxzoom': 9,
        'paint': {
          'fill-color': 'rgba(100,100,100,0.3)',
          'fill-outline-color': '#969696'
        },
        'filter': ['==', 'name', '']
    }, 'county_extended');
  });

  // define quad layer and add it to the map
  var layerData = {
      user_name: 'tnris-flood',
      sublayers: [{
              sql: "SELECT * FROM usgs_doq_names_wgs84",
              cartocss: '{}'
          }],
      maps_api_template: 'https://tnris-flood.carto.com'
  };

  cartodb.Tiles.getTiles(layerData, function (result, error) {
    if (result == null) {
      console.log("error: ", error.errors.join('\n'));
      return;
    }
    // console.log("url template is ", result.tiles[0]);

    var tiles = result.tiles.map(function (tileUrl) {
      return tileUrl
        .replace('{s}', 'a')
        .replace(/\.png/, '.mvt');
    });

    map.addSource('usgs_doq_names_wgs84_source', { type: 'vector', tiles: tiles });
    map.addLayer({
        id: 'usgs_doq_names_wgs84',
        'type': 'fill',
        'source': 'usgs_doq_names_wgs84_source',
        'source-layer': 'layer0',
        'minzoom': 9,
        'maxzoom': 24,
        'paint': {
          'fill-color': 'rgba(100,100,100,0)',
          'fill-outline-color': '#faafee'
        }
    }, 'county_extended_hover');

    map.addLayer({
        id: 'usgs_doq_names_wgs84_hover',
        'type': 'fill',
        'source': 'usgs_doq_names_wgs84_source',
        'source-layer': 'layer0',
        'minzoom': 9,
        'maxzoom': 11.5,
        'paint': {
          'fill-color': 'rgba(100,100,100,0.3)',
          'fill-outline-color': '#faafee'
        },
        'filter': ['==', 'usgs_doq_n', '']
    }, 'usgs_doq_names_wgs84');
  });

// define qquad layer and add it to the map
var layerData = {
    user_name: 'tnris-flood',
    sublayers: [{
            sql: "SELECT * FROM usgs_doq_names_wgs84_qquads",
            cartocss: '{}'
        }],
    maps_api_template: 'https://tnris-flood.carto.com'
};

cartodb.Tiles.getTiles(layerData, function (result, error) {
  if (result == null) {
    console.log("error: ", error.errors.join('\n'));
    return;
  }
  // console.log("url template is ", result.tiles[0]);

  var tiles = result.tiles.map(function (tileUrl) {
    return tileUrl
      .replace('{s}', 'a')
      .replace(/\.png/, '.mvt');
  });

  map.addSource('usgs_doq_names_wgs84_qquads_source', { type: 'vector', tiles: tiles });
  map.addLayer({
      id: 'usgs_doq_names_wgs84_qquads',
      'type': 'fill',
      'source': 'usgs_doq_names_wgs84_qquads_source',
      'source-layer': 'layer0',
      'minzoom': 11.5,
      'maxzoom': 24,
      'paint': {
        'fill-color': 'rgba(100,100,100,0)',
        'fill-outline-color': '#00f2ff'
      }
  }, 'usgs_doq_names_wgs84_hover');

  map.addLayer({
      id: 'usgs_doq_names_wgs84_qquads_hover',
      'type': 'fill',
      'source': 'usgs_doq_names_wgs84_qquads_source',
      'source-layer': 'layer0',
      'minzoom': 11.5,
      'maxzoom': 24,
      'paint': {
        'fill-color': 'rgba(100,100,100,0.3)',
        'fill-outline-color': '#00f2ff'
      }
  }, 'usgs_doq_names_wgs84_qquads');
});


  map.on('click', 'county_extended', function (e) {
    console.log(e.features[0].properties.name);
    console.log(e.lngLat);
    // updateCountyPopup(e);
    // map.flyTo({center: e.lngLat});
  });

  // Change the cursor to a pointer when it enters a feature in the 'county-extended' layer
  // highlight the county polys on hover if the zoom range is right
  map.on('mousemove', 'county_extended', function (e) {
    console.log(map.getZoom());
    map.getCanvas().style.cursor = 'pointer';
    if (map.getZoom() < 9) {
      map.setFilter('county_extended_hover', ['==', 'name', e.features[0].properties.name]);
    } else {
      map.setFilter('county_extended_hover', ['==', 'name', '']);
    }
  });

  // Change it back to a karate when it leaves 'county_extended'
  // remove the hover effect on mouseleave
  map.on('mouseleave', 'county_extended', function () {
    map.getCanvas().style.cursor = '';
    map.setFilter('county_extended_hover', ['==', 'name', '']);
  });

  // Change the cursor to a pointer when it enters a feature in the 'usgs_doq_names_wgs84' layer
  // // highlight the doq polys on hover if the zoom range is right
  map.on('mousemove', 'usgs_doq_names_wgs84', function (e) {
    if (map.getZoom() >= 9 || map.getZoom() < 11) {
      map.setFilter('usgs_doq_names_wgs84_hover', ['==', 'usgs_doq_n', e.features[0].properties.usgs_doq_n]);
    } else {
      map.setFilter('usgs_doq_names_wgs84_hover', ['==', 'usgs_doq_n', '']);
    }
  });

  // Change it back to a karate when it leaves 'usgs_doq_names_wgs84'
  map.on('mouseleave', 'county_extended', function () {
    map.setFilter('usgs_doq_names_wgs84_hover', ['==', 'usgs_doq_n', '']);
  });

  // Change the cursor to a pointer when it enters a feature in the 'usgs_doq_names_wgs84' layer
  // // highlight the doq polys on hover if the zoom range is right
  map.on('mousemove', 'usgs_doq_names_wgs84_qquads', function (e) {
    if (map.getZoom() >= 11.5) {
      map.setFilter('usgs_doq_names_wgs84_qquads_hover', ['==', 'cartodb_id', e.features[0].properties.cartodb_id]);
    } else {
      map.setFilter('usgs_doq_names_wgs84_qquads_hover', ['==', 'cartodb_id', '']);
    }
  });

  // Change it back to a karate when it leaves 'usgs_doq_names_wgs84_qquads'
  map.on('mouseleave', 'county_extended', function () {
    map.setFilter('usgs_doq_names_wgs84_qquads_hover', ['==', 'name', '']);
  });
});

console.log(map);

// define mapbox popup
// const popup = new mapboxgl.Popup({
//     closeButton: false,
//     closeOnClick: true
//   });
//
// function updateCountyPopup(e) {
//   popup.setLngLat(e.lngLat).setHTML(`
//   <div>
//     <h3 class ="h3">${e.features[0].properties.name}</h3>
//   </div>
//   `);
//   if (!popup.isOpen()) {
//     popup.addTo(map);
//   } else {
//     popup.remove();
//   }
// }
