/**
 * Classe que irá monitorizar os eventos da criatura vindos do motor
 * e fazer interface com o mapa
 */
class Creature /*extends Dispatcher*/ {
    constructor(stats) {
        /*super();*/
        this.init(stats)        
    }

    init(stats) {        
        this.creature = {
            _position : [37.0345300,-7.9504845],
            _heading : 0,       
            _leafIcon : L.icon({                
                iconUrl: 'img/Dragon.png',
                iconSize:     [32, 32], // size of the icon
                iconAnchor:   [11, 7], // point of the icon which will correspond to marker's location
                popupAnchor:  [-3, -5] // point from which the popup should open relative to the iconAnchor
            }),
            _leafMarker : {}, //stores self marker
            _fov_pol : {}, //stores the view polygon1
            _fov_pol2 : {}, //stores the view polygon2
            _observer : 0
        }
        //setup marker
        this.creature._leafMarker = L.marker(this.creature._position, { type: 'creature', alt: stats.id, icon: this.creature._leafIcon }).bindTooltip(stats.name+" / "+stats.id).addTo(window.map);        
    }
    destroy() {
        //falta remover o markador
        //this.creature.observer.disconnect();
    }
    move(lat,long) {
        console.log("moving into position");
        this.creature._position = [lat,long];
        this.creature._leafMarker.setLatLng(this.creature._position);
    }
}