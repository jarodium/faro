const { Dragon } = require("./modules/criatura");

/**
     * id - melhorar a geração
     * name - invocar um processo para dar nomes ao animal
     * spawn_points - parametrizado?
 */
let stats = {
    "id": "DRGN"+Math.random().toString(36).substring(7),    
    "name" : "Dragon",
    "spawn_points" : [{
        "lat" : 37.0212903,
        "lng" : -7.9414567
    },{
        "lat" : 37.0189683,
        "lng" : -7.9326587                
    }],
    "speed" : 50,
    "fov" : [-180,-140,140,180],
    "fovd" : 100
}
const drogon = new Dragon(stats);
drogon.debug();
drogon.__connect();