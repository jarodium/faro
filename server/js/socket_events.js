//bind listeners
/*global socket*/
/*global markers*/
socket.on('critterSpawned', function (data) {
    for (var x in data) {
        var id = data[x].id;
        if (!markers[id]) {
            //markers[id] = L.marker([0,0]).addTo(map);
            markers[id] = L.marker([0,0], {icon: myIcon2}).addTo(map)
        }
        
            markers[id].setLatLng(new L.LatLng(pos[1], pos[0]));
    
    }
});
socket.on('critterMoved', function(data) {
    console.log("critterMoved");
    console.log(data);
    var id = data.id;
    if (markers[id]) {
        //console.log("movendo");
        var man = data.nextpos;
        console.log(man);
        markers[id].setLatLng([man.ori,man.des]).setRotationAngle(man.bea);
        
    }
})

socket.on('critterDestroy', function (data) {
    console.log("critterDestroy");
    console.log(data);
    var id = data.id;
    
    if (markers[id]) {
        //console.log("movendo");
        //markers[id].setLatLng([man.ori,man.des]).setRotationAngle(man.bea);
        map.removeLayer(markers[id]);
        markers.splice(markers.findIndex(v => v.id === id), 1);
        
    }
    //socket.emit('my other event', { my: 'data' });
});
socket.on('coordsUpdated', function (data) {
    console.log("coordsUpdated");
    console.log(data);
    //socket.emit('my other event', { my: 'data' });
});