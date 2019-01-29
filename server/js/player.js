/*global L*/
/*global map*/
/*global socket*/
class Player {
    constructor() {
        this.device = {
            _position : [0,0],
            _leafIcon : L.icon({
                iconUrl: 'img/right-arrow2.png',
                iconSize:     [23, 23], // size of the icon
                iconAnchor:   [11, 7], // point of the icon which will correspond to marker's location
                popupAnchor:  [-3, -5] // point from which the popup should open relative to the iconAnchor
            }),
            _leafMarker : {}, //stores self marker
            _fov_pol : {}, //stores the view polygon1
            _fov_pol2 : {} //stores the view polygon2
        }
        
        this.stats = {
            fov : [-45,45], //field of vision 
            dov : 10 //distance of vision
        }
        //this.init();
    }
    
    init() {
        //draw the maker add to map
        let self = this;
        if (navigator.geolocation) {
            let options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };
            
            navigator.geolocation.watchPosition(function(position) {
                self.updatePosition(position);
            }, function(err) {
                console.warn('ERROR(' + err.code + '): ' + err.message);
            }, options);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
        this.device._leafMarker = L.marker(this.device._position, { icon: this.device._leafIcon }).addTo(window.map);
        
    }
    
    updatePosition(position) {
        console.log(position);
        socket.emit('updateCoord', position.coords);
        this.device._position = [ position.coords.latitude, position.coords.longitude ];
        //updates self marker
        this.device._leafMarker.setLatLng(this.device._position);
        
        //updates self field of vision
        if (this.stats.fov.length == 2) {
            
        }
        if (this.stats.fov.length == 4) {
            
        }
    }
    
   
}