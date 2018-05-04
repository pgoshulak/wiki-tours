var map;
var mapData;
var mapPointsData = [];
var mapMarkers = [];

$.get(`/api/maps/${mapId}`)
  .then((result) => {
    mapData = result;
  })
$.get(`/api/maps/${mapId}/points`)
  .then((results) => {
    results.forEach((point) => {
      mapPointsData.push(point);
    })
  })

// Initialize the Map view
// Callback after loading the Maps JS API from <script> at bottom of the viewer partial
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: new google.maps.LatLng(43.7, -79.4)
  })

  // Temporary timeout until mapdata is loaded server-side and we don't need to wait for $.get()
  setTimeout(() => {
    if (mapPointsData.length) {
      mapPointsData.forEach((point, pointIndex) => {
        setTimeout(()=> {

          mapMarkers.push(new google.maps.Marker({
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: {lat: Number(point.latitude), lng: Number(point.longitude)}
          }));
        }, 300 * pointIndex);
      })
    } else {
      console.log('no markers loaded')
    }
  }, 500);
}