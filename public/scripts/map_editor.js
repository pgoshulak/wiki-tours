// Initialize the Map view
// Callback after loading the Maps JS API from <script> at bottom of the viewer partial
var map;
var mapData = {}
var mapMarkers = [];
var mapPoints = [];


// --------- Fetch info from database -----------
function getMapData() {
  return $.get(`/api/maps/${mapId}`)
}

function getMapPoints() {
  return $.get(`/api/maps/${mapId}/points`)
}

// --------- Render to screen ------------

function renderHeaderMaster(mapData) {
  $('#header-img').attr('src', mapData.thumbnail_url);
  $('#header-text').text(mapData.title);
}

function renderHeaderPointDetail(point) {
  $('#header-img').attr('src', point.image_url);
  $('#header-text').text(point.title);
}

// Display a point's details in the window
function renderPointDetail(pointIndex) {
  var point = mapPoints[pointIndex];
  $('#map-details').hide();
  $('#points-list').hide();
  $('#point-details').show();
  renderHeaderPointDetail(point);
  $('#point-description').text(point.description);
  panMap(point.latitude, point.longitude)
}

// --------- Map functions -------------

// Create a single map marker from a data point
function makeMapMarker(point) {
  // Store lat/lng
  var position = new google.maps.LatLng(Number(point.latitude), Number(point.longitude))
  // Create a 'pin' marker on the map
  var marker = new google.maps.Marker({
    map: map,
    draggable: false,
    animation: google.maps.Animation.DROP,
    position: position
  });

  // Add click listener to reveal point details in panel
  marker.addListener('click', function () {
    showPointDetail(pointIndex);
  })
  // Track this marker in the master list
  mapMarkers.push(marker);
}

// Transform the list of point data into map markers
function makeAllMapPoints(mapPoints) {
  mapMarkers = [];
  mapPoints.forEach(function(point) {
    makeMapMarker(point)
  })
}

// Zoom and recenter the map to show all points
function zoomToAllPoints() {  
  // Initialize map boundaries
  var bounds = new google.maps.LatLngBounds();
  mapMarkers.forEach(function(marker) {
    bounds.extend(marker.position);
  });
  map.fitBounds(bounds);
}

// Pan the map to a specific lat/lng
function panMap(lat, lng) {
  map.panTo(new google.maps.LatLng(Number(lat), Number(lng)));
  map.setZoom(13)
}

$(document).ready(function () {

  // Handlers for swapping between window views
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
  $('#points-list').on('click', '.point-entry', function () {
    var pointIndex = $(this).data('point-index');
    showPointDetail(pointIndex);
  })
})

function initMap() {
  // Initialize map
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: new google.maps.LatLng(43.7, -79.4)
  })
  getMapData()
    .then(function (data) {
      mapData = data[0];
      renderHeaderMaster(data[0])
    });

  getMapPoints()
    .then(function(data) {
      mapPoints = data;
      makeAllMapPoints(data);
      zoomToAllPoints();
    })
}
