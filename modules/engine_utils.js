const MAPBOX_API = 'https://api.tiles.mapbox.com/v4/directions/{profile}/{waypoints}.json?instructions=html&geometry=polyline&access_token=pk.eyJ1IjoiamFyb2RpdW0iLCJhIjoiY2lzamNuZnZjMDAycjJzcGszNjA0eTlydyJ9.3bF3q_X9X8hX8tRJI6KXng';
const MAPBOX_GEOCODER = 'https://api.tiles.mapbox.com/v4/geocode/mapbox.places/{query}.json?proximity={proximity}&access_token=pk.eyJ1IjoiamFyb2RpdW0iLCJhIjoiY2lzamNuZnZjMDAycjJzcGszNjA0eTlydyJ9.3bF3q_X9X8hX8tRJI6KXng'
const FARO_BOUNDS = [
    [-7.9963859,37.0138077],
    [-7.9554464,37.0100746],
    [-7.9493506,37.0255263],
    [-7.9341391,37.0089947],
    [-7.918014,37.0100995],
    [-7.9060061,37.0239502],
    [-7.9236872,37.0422444],
    [-7.939523,37.0429306],
    [-7.9550154,37.0423815],
    [-7.964371,37.0471084],
    [-7.9735981,37.0497115],
    [-7.9758082,37.0457381],
    [-7.9756148,37.0383393],
    [-7.9778464,37.0255948],
    [-7.9905494,37.0225797],
    [-7.9963859,37.0138077],
];

function getRandomGPS(BOUNDS) {    
    var turf = require('@turf/turf');        
    var line = turf.lineString(BOUNDS);
    var bbox1 = turf.bbox(line);
    var points = turf.randomPoint(1, {bbox: bbox1});    
    if (points.features[0]) {
        return points.features[0].geometry.coordinates.reverse();
    }
    return [];
}

function mapBoxWaypoints(origin,destination) {
    axios({
        method: 'post',
        url: '/login',
        data: {
          firstName: 'Finn',
          lastName: 'Williams'
        }
    }).then((response) => {
        //console.log(response);
        if (response.status == 200) {
            console.log(response.data);
        }
    }, (error) => {
        console.log("could not get routes from mapbox");
    });
}
module.exports = {    
    'MAPBOX_API' : MAPBOX_API,
    'MAPBOX_GEOCODER' : MAPBOX_GEOCODER,
    'FARO_BOUNDS' : FARO_BOUNDS,
    'getRandomGPS' : getRandomGPS,
    'mapBoxWaypoints' : mapBoxWaypoints
}