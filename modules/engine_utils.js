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
const chalk = require('chalk');
const log = console.log;

function getRandomGPS(BOUNDS) {    
    var turf = require('@turf/turf');        
    var line = turf.lineString(BOUNDS);
    var bbox1 = turf.bbox(line);
    var points = turf.randomPoint(1, {bbox: bbox1});    
    if (points.features[0]) {
        return points.features[0].geometry.coordinates;
    }
    return [];
}
function calculateFOV(origem,campo,distancia_focal) {
    let turf = require('@turf/turf');
    /*
        1 - Calcular os 3 pontos com 1 origem ( devolve 1 polígono ) se o fov possuir 2 elementos
        1.1 - Calcular os 6 pontos com 1 origem ( devolve 2 polígonos ) se o fov possuir 4 elemetos
        2. - criar um polýgono con a função hull
        3. - Devolver o polígono
    */
   /*log(chalk.yellow('Engine call:') + arguments.callee.name);
   log(chalk.yellow('Origin:'));
   log(origem);
   log(chalk.yellow('FOV:'));
   log(campo);
   log(chalk.yellow('FOD:'));
   log(distancia_focal);*/

   var pontoOrigem = turf.point([origem.long, origem.lat]);
   var pontosDestino = [];
   if (campo.length == 2) {    
       var bearing = 90;
       var options = {units: 'kilometers'};
       for(var bearing=campo[0]; bearing<=campo[1]; bearing+=10) {
           pontosDestino.push(turf.destination(pontoOrigem, distancia_focal/1000, bearing, options));
       }
    }   
    //log(chalk.yellow('Destinantions:')); 
    //log(pontosDestino);
    
    //return JSON.stringify(hull.geometry.coordinates);
    return pontosDestino;        
}
function mapBoxWaypoints(origin,destination,profile) {
    let axios = require('axios'); 
    //log(chalk.yellow('Engine call:') + arguments.callee.name);
    return axios({
        method: 'get',
        //continuar aqui
        url: MAPBOX_API.replace("{M}",profile).replace("{SGPS1}",origin[0]).replace("{EGPS1}",origin[1]).replace("{SGPS2}",destination[0]).replace("{EGPS2}",destination[1]),        
        transformResponse: [(data) => {
            //console.log(data);
            var dt = JSON.parse(data);            
            if (dt.routes && dt.routes[0].legs[0].steps) {                
                dt = dt.routes[0].legs[0].steps;
                var pontos = [];

                dt.forEach(element => {
                    /*delete element.name; 
                    delete element.intersections; 
                    delete element.weight;
                    delete element.mode;
                    delete element.driving_side;
                    //limpar maneuver
                    delete element.maneuver.type; 
                    delete element.maneuver.instruction; 
                    delete element.maneuver.modifier; 
                    delete element.maneuver.location; */              
                    //usar as coordenadas passo a passo do geometry como os waypoints que precisamos
                    pts = element.geometry.coordinates;
                    ptd = 1; //1 segundo de duração por defeito
                    if (element.geometry.coordinates.length > 0) {
                        ptd = Math.floor(element.duration / element.geometry.coordinates.length)
                    }                    
                    pts.forEach(e => {
                        pontos.push({'long':e[0],'lat':e[1],'duration':ptd});
                    });
                    //console.log(element.geometry);
                });                
                return pontos;
            }            
            return [];         
        }]
    }).then((response) => {        
        //log(chalk.yellow('Engine:') + ' got response from Mapbox: ');
        if (response.status == 200) {
            return response.data;
        }
    }, (error) => {
        return null;
    });     
}

function playerToPol(pol) {
    /* Converter as coordenadas do jogador para um polígono */
    
}
module.exports = {    
    'MAPBOX_API' : MAPBOX_API,
    'MAPBOX_GEOCODER' : MAPBOX_GEOCODER,
    'FARO_BOUNDS' : FARO_BOUNDS,
    'getRandomGPS' : getRandomGPS,
    'mapBoxWaypoints' : mapBoxWaypoints,
    'calculateFOV' : calculateFOV
}