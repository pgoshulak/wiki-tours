


// Initialize the Map view
// Callback after loading the Maps JS API from <script> at bottom of the viewer partial
var map;
var mapMarkers = [];
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: new google.maps.LatLng(43.7, -79.4)
  })


  if (mapPoints.length) {
    mapPoints.forEach((point, pointIndex) => {
      setTimeout(() => {

        mapMarkers.push(new google.maps.Marker({
          map: map,
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: {
            lat: Number(point.latitude),
            lng: Number(point.longitude)
          }
        }));
      }, 500 * pointIndex);
    })
  } else {
    console.log('no markers loaded')
  }
}
