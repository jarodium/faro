const { Dragon } = require("./modules/criatura");

/**
     * id - melhorar a geração
     * name - invocar um processo para dar nomes ao animal
     * spawn_points - parametrizado?
 */
let stats = {
    "id": "DRGN"+Math.random().toString(36).substring(7),    
    "name" : "Dragon",    
    "speed" : 50, //será transformado em percentagem da duracção
    "fov" : [-180,180], //[-180,-140,140,180] igual a visão de um lagarto ( presa ) [-180,180] (predador)
    "fovd" : 100,
    "_mapbox_profile" : "walking"
}
const drogon = new Dragon(stats);
//drogon.debug();
drogon.__connect(); 
drogon.__bringmetolife();