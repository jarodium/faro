const MAPBOX_API = 'https://api.mapbox.com/directions/v5/mapbox/{M}/{SGPS1},{EGPS1};{SGPS2},{EGPS2}?steps=true&geometries=geojson&access_token=pk.eyJ1IjoiamFyb2RpdW0iLCJhIjoiY2lzamNuZnZjMDAycjJzcGszNjA0eTlydyJ9.3bF3q_X9X8hX8tRJI6KXng';
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

function mapBoxWaypoints(origin,destination,profile) {
    let axios = require('axios');        
    return axios({
        method: 'get',
        //continuar aqui
        url: MAPBOX_API.replace("{M}",profile).replace("{SGPS1}",origin[1]).replace("{EGPS1}",origin[0]).replace("{SGPS2}",destination[1]).replace("{EGPS2}",destination[0]),        
        transformResponse: [(data) => {
            //console.log(data);
            var dt = JSON.parse(data);            
            if (dt.routes && dt.routes[0].legs[0].steps) {                
                dt = dt.routes[0].legs[0].steps;
                dt.forEach(element => {
                delete element.name; 
                delete element.intersections; 
                delete element.weight;
                delete element.mode;
                delete element.driving_side;
                //limpar maneuver
                delete element.maneuver.type; 
                delete element.maneuver.instruction; 
                delete element.maneuver.modifier; 
                //limpar geometry -> para já fica a geometry para efeitos de visualização no mapa                   
                //console.log(element.geometry);
                });
                return dt;
            }            
            return [];         
        }]
    }).then((response) => {        
        if (response.status == 200) {
            return response.data;
        }
    }, (error) => {
        return null;
    });     
}
module.exports = {    
    'MAPBOX_API' : MAPBOX_API,
    'MAPBOX_GEOCODER' : MAPBOX_GEOCODER,
    'FARO_BOUNDS' : FARO_BOUNDS,
    'getRandomGPS' : getRandomGPS,
    'mapBoxWaypoints' : mapBoxWaypoints
}