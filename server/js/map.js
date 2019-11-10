/*global L*/
/*global map*/
function initmap(myLat) {
    // set up the map
    window.map = new L.Map('map');

    // create the tile layer with correct attribution
    var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 19, maxZoom: 19, attribution: osmAttrib});		

    // start the map in South-East England
    window.map.setView(myLat,15);
    window.map.addLayer(osm);
    
    //getLocation();
   
    //myPoint = L.marker([37.0214493,-7.9330167], {icon: myIcon}).addTo(map);
    
    /*myMaker = L.marker([37.0214493,-7.9330167], {icon: myIcon2}).addTo(map);
    myMaker2 = L.marker([37.0216033,-7.9345827], {icon: myIcon3}).addTo(map);
    */
    
    
    /*var m1Ang = 0;
    var m1Ang2 = 0;*/
    
    /*$("body").on("keypress",function (e) {
        if (e.which == 97) {
            //a
            m1Ang2 -= 25;
            myMaker2.setRotationAngle(m1Ang2);
        }
        if (e.which == 100) {
            //d
            m1Ang2 += 25;
            myMaker2.setRotationAngle(m1Ang2);
        }
        //console.log(e.which);
        if (e.which == 106) {
            //a
            m1Ang -= 25;
            myMaker.setRotationAngle(m1Ang);
        }
        if (e.which == 108) {
            //d
            m1Ang += 25;
            myMaker.setRotationAngle(m1Ang);
        }
        
        let latlngs = [
            getPoint([37.0214493,-7.9330167],p2.fovd,m1Ang-115),
            [37.0214493,-7.9330167],
            getPoint([37.0214493,-7.9330167],p2.fovd,m1Ang-90)
        ];
         let latlngs2 = [
            getPoint([37.0214493,-7.9330167],p2.fovd,m1Ang+115),
            [37.0214493,-7.9330167],
            getPoint([37.0214493,-7.9330167],p2.fovd,m1Ang+90)
        ];
        if (p2._fov_pol) {
            window.map.removeLayer(p2._fov_pol);
            window.map.removeLayer(p2._fov_pol2);
        }
        p2._fov_pol = L.polygon(latlngs, {color: 'red'}).addTo(map);
        p2._fov_pol2 = L.polygon(latlngs2, {color: 'red'}).addTo(map);
        
        //desenhar polygon
        //getPoint([37.0214493,-7.9330167],50,m1Ang
        
        //myPoint.setLatLng(getPoint([37.0214493,-7.9330167],50,m1Ang));
    });*/
    socket.emit('query-creatures', {} );
    socket.on('query-creatures-reply', function(data) {
        console.log("critterMoved");
        console.log(data);
        var id = data.id;
        /*console.log(id);*/
        if (markers[id]) {
            //console.log("movendo");
            var man = data.nextpos;
            console.log(man);
            markers[id].setLatLng([man.ori,man.des]).setRotationAngle(man.bea);
            
        }
    })

    var player = new Player();
    player.init();
    
    player.on("move", function(data) {
        console.log(data);
        socket.emit('updatePlayer', data );
    });
    
    /*Compass.watch(function (heading) {
        console.log("compass heading "+heading);
        //$('.compass').css('transform', 'rotate(' + (-heading) + 'deg)');
    });
    Compass.init(function (method) {
        console.log('Compass heading by ' + method);
    });*/
    //player.dispatch("NewMessage", "meh");
    //adicionar eventos
    //var el = document.querySelector('#start');
    // attach anonymous function to click event
    /*addEvent(el, 'touchstart', function(){ 
        player.init();
        document.querySelector('#start'); // select the first returned <div> element 
        el.parentNode.removeChild(el);
    })*/
}