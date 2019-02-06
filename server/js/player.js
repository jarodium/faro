/*global L*/
/*global map*/
/*global socket*/
class Player extends Dispatcher {
    constructor() {
        super();
        
        this.device = {
            _position : [0,0],
            _heading : 0,
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
            //fov : [-45,-135,45,135], //field of vision 
            fov : [-45,45], //field of vision 
            dov : 10 //distance of vision
        }
        
        //this.init();
    }
    
    estado() {
        /* returns state veriables */
        return { 
            pos : this.device._position,
            hea : this.device._heading,
            _fov_pol : typeof this._fov_pol != 'undefined' ? this._fov_pol.getLatLngs() : [],
            _fov_pol2 : typeof this._fov_pol2 != 'undefined' ? this._fov_pol2.getLatLngs() : []
        }
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
            
            /*if (window.DeviceOrientationEvent) {
                // Listen for the deviceorientation event and handle the raw data
                  window.addEventListener('deviceorientation', function(eventData) {
                      var compassdir;
                      if(event.webkitCompassHeading) {
                          // Apple works only with this, alpha doesn't work
                          compassdir = event.webkitCompassHeading;  
                      }
                      else compassdir = event.alpha;
                      console.log("heading :"+compassdir);
                  });
                }*/
            
        } else {
            alert("Geolocation is not supported by this browser.");
        }
        this.device._leafMarker = L.marker(this.device._position, { icon: this.device._leafIcon }).addTo(window.map);
        
    }
    
    updatePosition(position) {
        //console.log(position);
        
        this.device._position = [ position.coords.latitude, position.coords.longitude ];
        //this.device._heading = position.heading;
        
        //updates self marker
        this.device._leafMarker.setLatLng(this.device._position);
        
        //clears previous polys before new update
        if (typeof this._fov_pol == 'object') window.map.removeLayer(this._fov_pol);
        if (typeof this._fov_pol2 == 'object') window.map.removeLayer(this._fov_pol2);
        
        //updates self field of vision
        if (this.stats.fov.length == 2) {
            /**
             * This object has "frontal sight"
             * */
            
            let latlngs = [
                getPoint(
                    this.device._position ,0,0
                ),
                getPoint(
                    this.device._position ,this.stats.dov,this.device._heading+this.stats.fov[0]
                ),
                getPoint(
                    this.device._position ,this.stats.dov,this.device._heading+this.stats.fov[1]
                )
            ];
            this._fov_pol = L.polygon(latlngs, {color: 'red'}).addTo(window.map);
        }
        if (this.stats.fov.length == 4) {
            /**
             * This object has "side sight"
             * */
            let latlngs = [
                getPoint(
                    this.device._position ,this.stats.dov,this.device._heading+this.stats.fov[0]
                ),
                getPoint(
                    this.device._position ,this.stats.dov,this.device._heading+this.stats.fov[1]
                ),
                getPoint(
                    this.device._position ,0,0
                )
            ];
            
            let latlngs2 = [
                getPoint(
                    this.device._position ,this.stats.dov,this.device._heading+this.stats.fov[2]
                ),
                getPoint(
                    this.device._position ,this.stats.dov,this.device._heading+this.stats.fov[3]
                ),
                getPoint(
                    this.device._position ,0,0
                )
            ];
            
            this._fov_pol = L.polygon(latlngs, {color: 'red'}).addTo(window.map);
            this._fov_pol2 = L.polygon(latlngs2, {color: 'red'}).addTo(window.map);
        }
        //window.socket.emit('updatePlayer', this.estado() );
        if (this.events["move"]) {
            this.dispatch("move",this.estado());
        }
    }
    
   //elem.addEventListener('build', function (e) { /* ... */ }, false);
}