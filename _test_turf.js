var turf = require('@turf/turf');
//import * as turf from '@turf/helpers'
var t = turf.polygon( [[ [5.39014, 43.279295], [5.390709, 43.278749], [5.3909, 43.2785], [5.39014, 43.279295] ], [ [5.379856, 43.252967], [5.422988, 43.249466], [5.425048, 43.245153], [5.379856, 43.252967] ] ]);
//console.log(t);

var points = turf.randomPoint(1, {bbox: [5.39014, 43.279295, 5.379856, 43.252967]});
console.log(points.features[0].geometry.coordinates);
///var turfpolygon = turf.multiPolygon(this.polygons);