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
    
    //console.log(centro+"--"+distancia+" - "+direccao);
    let lat1 = Math.radians(centro[0]) //Current lat point converted to radians
    let lon1 = Math.radians(centro[1]) //Current long point converted to radians

    let lat2 = Math.asin( Math.sin(lat1)*Math.cos(distancia/R) + Math.cos(lat1)*Math.sin(distancia/R)*Math.cos(direccao));
    let lon2 = lon1 + Math.atan2(Math.sin(direccao)*Math.sin(distancia/R)*Math.cos(lat1),Math.cos(distancia/R)-Math.sin(lat1)*Math.sin(lat2))
    
    lat2 = Math.degrees(lat2)
    lon2 = Math.degrees(lon2)
    return new Array(lat2,lon2);
}

https://stackoverflow.com/questions/34967607/rotate-polygon-around-point-in-leaflet-map

function rotatePoints(center, points, yaw) {
    var res = []
    var angle = yaw * (Math.PI / 180)
    for(var i=0; i<points.length; i++) {
      var p = points[i]
      // translate to center
      var p2 = [ p[0]-center[0], p[1]-center[1] ]
      // rotate using matrix rotation
      var p3 = [ Math.cos(angle)*p2[0] - Math.sin(angle)*p2[1], Math.sin(angle)*p2[0] + Math.cos(angle)*p2[1]]
      // translate back to center
      var p4 = [ p3[0]+center[0], p3[1]+center[1]]
      // done with that point
      res.push(p4)
    }
    return res
  }

function addEvent(el, type, handler) {
   if (el.attachEvent) el.attachEvent('on'+type, handler); else el.addEventListener(type, handler);
}

class DispatcherEvent {
    constructor(eventName) {
        this.eventName = eventName;
        this.callbacks = [];
    }

    registerCallback(callback) {
        this.callbacks.push(callback);
    }

    unregisterCallback(callback) {
        const index = this.callbacks.indexOf(callback);
        if (index > -1) {
            this.callbacks.splice(index, 1);
        }
    }

     fire(data) {
        const callbacks = this.callbacks.slice(0);
        callbacks.forEach((callback) => {
            callback(data);
        });
    }
}

class Dispatcher {
    constructor() {
        this.events = {};
    }

    dispatch(eventName, data) {
        const event = this.events[eventName];
        if (event) {
            event.fire(data);
        }
    }

    on(eventName, callback) {
        let event = this.events[eventName];
        if (!event) {
            event = new DispatcherEvent(eventName);
            this.events[eventName] = event;
        }
        event.registerCallback(callback);
    }

    off(eventName, callback) {
        const event = this.events[eventName];
        if (event && event.callbacks.indexOf(callback) > -1) {
            event.unregisterCallback(callback);
            if (event.callbacks.length === 0) {
                delete this.events[eventName];
            }
        }
    }
}