//bind listeners
/*global socket*/
/*global markers*/



window.socket.on('critterDestroy', function (data) {
    /*console.log("critterDestroy");
    console.log(data);*/
    var id = data.id;
    
    if (markers[id]) {
        //console.log("movendo");
        //markers[id].setLatLng([man.ori,man.des]).setRotationAngle(man.bea);
        map.removeLayer(markers[id]);
        markers.splice(markers.findIndex(v => v.id === id), 1);
        
    }
    //window.socket.emit('my other event', { my: 'data' });
});

window.socket.on('coordsUpdated', function (data) {
    console.log("PlayerUpdated");
    console.log(data);
    //window.socket.emit('my other event', { my: 'data' });
});