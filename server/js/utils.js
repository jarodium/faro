Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians) {
    return radians * 180 / Math.PI;
};

var R = 6378.1 //Radius of the Earth
    
function getPoint(centro,distancia,direccao) {
    distancia = distancia / 1000;
    direccao = Math.radians(direccao);
    
    console.log(centro+"--"+distancia+" - "+direccao);
    let lat1 = Math.radians(centro[0]) //Current lat point converted to radians
    let lon1 = Math.radians(centro[1]) //Current long point converted to radians

    let lat2 = Math.asin( Math.sin(lat1)*Math.cos(distancia/R) + Math.cos(lat1)*Math.sin(distancia/R)*Math.cos(direccao));
    let lon2 = lon1 + Math.atan2(Math.sin(direccao)*Math.sin(distancia/R)*Math.cos(lat1),Math.cos(distancia/R)-Math.sin(lat1)*Math.sin(lat2))
    
    lat2 = Math.degrees(lat2)
    lon2 = Math.degrees(lon2)
    return new Array(lat2,lon2);
}

function addEvent(el, type, handler) {
   if (el.attachEvent) el.attachEvent('on'+type, handler); else el.addEventListener(type, handler);
}