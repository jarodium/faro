/**
 * Classe que irá monitorizar os eventos da criatura vindos do motor
 * e fazer interface com o mapa
 */
class Creature extends Dispatcher {
    constructor() {
        super();
    }

    init(stats) {
        this.creature = {
            _position : [stats.lat,stats.long],
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
        this.creature._leafMarker = L.marker(this.creature._position, { icon: this.creature._leafIcon }).addTo(window.map);
    }

}