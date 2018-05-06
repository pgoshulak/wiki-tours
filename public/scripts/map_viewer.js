// Initialize the Map view
// Callback after loading the Maps JS API from <script> at bottom of the viewer partial
var map;
var mapMarkers = [];
function showPointDetail() {}

function checkMapIsFavourited() {
  var isFavourite = false;
  for (user of mapFavourites) {
    if (user.user_id === userId) {
      isFavourite = true;
    }
  }
  return isFavourite;
}

function renderHeaderMaster() {
  $('#header-img').attr('src', mapData.thumbnail_url);
  $('#header-text').text(mapData.title);
}
function renderHeaderPointDetail(point) {
  $('#header-img').attr('src', point.image_url);
  $('#header-text').text(point.title);
}

function renderFavouriteState(isFavourite) {
  // Disable the button if user is not logged in
  if (userId === -1) {
    $('#favourite-counter').attr('disabled', true)
    return;
  }
  // Colorize button if user has favourited the map
  if (isFavourite) {
    $('#favourite-counter')
      .removeClass('btn-outline-secondary')
      .addClass('btn-outline-danger');
    } else {
    $('#favourite-counter')
      .removeClass('btn-outline-danger')
      .addClass('btn-outline-secondary');
  }
}

function renderFavouriteCounter(favourites) {
  $('#favourite-counter-text').text(`${favourites.length} likes`)
}

// Toggle the 'favourite' counter
function toggleFavourite() {
  var isFavourite = checkMapIsFavourited();
  var ajaxMethod;

  if (isFavourite) {
    ajaxMethod = 'DELETE'
  } else {
    ajaxMethod = 'POST'
  }

  // Send request
  $.ajax({
    method: ajaxMethod,
    url: `/api/maps/${mapId}/favourites`,
    data: {user_id: userId}
  }).then(function() {
    return $.get(`/api/maps/${mapId}/favourites`)
  }).then(function(result) {
    mapFavourites = result;
    renderFavouriteCounter(mapFavourites)
    renderFavouriteState(checkMapIsFavourited());
  })
  
}

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
  $('#points-list').on('click', '.point-entry', function() {
    var pointIndex = $(this).data('point-index');
    showPointDetail(pointIndex);
  })
  $('#favourite-counter').on('click', toggleFavourite);

  // Display a point's details in the window
  showPointDetail = function(pointIndex) {
    var point = mapPoints[pointIndex];
    $('#map-details').hide();
    $('#points-list').hide();
    $('#point-details').show();
    renderHeaderPointDetail(point);
    $('#point-description').text(point.description);
    panMap(point.latitude, point.longitude)
  }
  
  renderFavouriteState(checkMapIsFavourited());
  renderFavouriteCounter(mapFavourites)
})

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    /* zoom: 11,
    center: new google.maps.LatLng(43.7, -79.4) */
  })

  if (mapPoints.length) {
    // Initialize map boundaries
    var mapInitialBounds = new google.maps.LatLngBounds();

    mapPoints.forEach((point, pointIndex) => {
      // Store lat/lng
      var position = new google.maps.LatLng(Number(point.latitude), Number(point.longitude))
      // Create a 'pin' marker on the map
      var marker = new google.maps.Marker({
        map: map,
        draggable: false,
        animation: google.maps.Animation.DROP,
        position: position
      });

      mapMarkers.push(marker);
      marker.addListener('click', function() {
        showPointDetail(pointIndex);
      })
      // Extend the initial map bounds to visualize the new point
      mapInitialBounds.extend(position);
    })
    // Fit map boundary to all visible points
    map.fitBounds(mapInitialBounds);

  } else {
    console.log('no markers loaded')
  }
}
