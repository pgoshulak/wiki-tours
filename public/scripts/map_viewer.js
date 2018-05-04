// Initialize the Map view
// Callback after loading the Maps JS API from <script> at bottom of the viewer partial
var map;
var mapMarkers = [];

$(document).ready(function () {
  function renderHeaderMaster() {
    $('#header-img').attr('src', mapData.thumbnail_url);
    $('#header-text').text(mapData.title);
  }
  function renderHeaderPointDetail(point) {
    $('#header-img').attr('src', point.image_url);
    $('#header-text').text(point.title);
  }
  function panMap(lat, lng) {
    map.panTo(new google.maps.LatLng(Number(lat), Number(lng)));
    map.setZoom(13)
  }

  $('#details-show-list').on('click', function () {
    $('#map-details').hide()
    $('#points-list').show()
  })
  $('#list-show-details').on('click', function () {
    $('#points-list').hide()
    $('#map-details').show()
  })
  $('#point-show-list').on('click', function () {
    $('#point-details').hide();
    $('#points-list').show();
    renderHeaderMaster();
  })
  $('#points-list').on('click', '.point-entry', function() {
    var pointIndex = $(this).data('point-index');
    var point = mapPoints[pointIndex];

    $('#points-list').hide();
    $('#point-details').show();
    renderHeaderPointDetail(point);
    $('#point-description').text(point.description);
    panMap(point.latitude, point.longitude)

  })
})

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
          draggable: false,
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
