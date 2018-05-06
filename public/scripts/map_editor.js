// Initialize the Map view
// Callback after loading the Maps JS API from <script> at bottom of the viewer partial
var map;
var mapData = {}
var mapMarkers = [];
var mapPoints = [];
var ClickEventHandler;
var userIsOwner;
var contributorLookup = {};


// --------- Fetch from/update to database -----------
function getMapData() {
  return $.get(`/api/maps/${mapId}`)
}

function getMapPoints() {
  return $.get(`/api/maps/${mapId}/points`)
}

function getMapContributors() {
  return $.get(`/api/maps/${mapId}/contributors`)
}

function updateMapData(data) {
  return $.ajax({
    method: 'PUT',
    url: `/api/maps/${mapId}`,
    data: data
  })
}

function updatePointData(data, pointId) {
  return $.ajax({
    method: 'PUT',
    url: `/api/maps/${mapId}/points/${pointId}`,
    data: data
  })
}

function deletePoint(pointId) {
  return $.ajax({
    method: 'DELETE',
    url: `/api/maps/${mapId}/points/${pointId}`
  })
}

function addNewPoint(title, lat, lng, image_url) {
  var ownerApproved = false;
  if (mapData.owner_id === userId) {
    ownerApproved = true;
  }
  return $.ajax({
    method: 'POST',
    url: `/api/maps/${mapId}/points`,
    data: {
      title: title,
      latitude: lat.toString(),
      longitude: lng.toString(),
      contributor_id: userId,
      owner_approved: ownerApproved,
      image_url: image_url
    }
  })
}

// --------- Render to screen ------------

function renderHeaderMaster(mapData) {
  $('#header-img').attr('src', mapData.thumbnail_url);
  $('#header-text-input')
    .removeClass('header-point')
    .addClass('header-master')
    .val(mapData.title);
  $('#img-url-input')
    .val(mapData.thumbnail_url || '')
    .data('target', 'master');
  
  // Disabled editing for non-owner
  if (!userIsOwner) {
    $('#header-text-input').attr('disabled', true);
    $('button#img-change').attr('disabled', true);
  } else {
    $('#header-text-input').attr('disabled', false);
    $('button#img-change').attr('disabled', false);
  }
}

function renderDescription(mapData) {
  $('#description-input').val(mapData.description);

  // Disabled editing for non-owner
  if (!userIsOwner) {
    $('#description-input').attr('disabled', true);
  } else {
    $('#description-input').attr('disabled', false);
  }
}

function renderHeaderPointDetail(point, pointIndex) {
  $('#header-img').attr('src', point.image_url);
  $('#header-text-input')
    .removeClass('header-master')
    .addClass('header-point')
    .data('point-index', pointIndex)
    .val(point.title);
  $('#img-url-input')
    .val(point.image_url || '')
    .data('target', pointIndex);
}

function renderPointsToList(mapPoints) {
  var $pointsList = $('#points-list ul');
  $pointsList.empty();

  // Append each point to the list
  mapPoints.forEach(function (point, pointIndex) {
    $('<li>')
      .addClass('list-group-item point-entry')
      .data('point-index', pointIndex)
      .text(point.title)
      .appendTo($pointsList);
  })
}

// Set the 'approved' checkbox to checked or unchecked
function renderApprovedCheckboxState(isApproved) {
  $('#approved-checkbox').attr('checked', isApproved)
}

// Display a point's details in the window
function renderPointDetail(pointIndex) {
  var point = mapPoints[pointIndex];
  // Display the correct screen in the pane
  $('#map-details').hide();
  $('#points-list').hide();
  $('#point-details').show();

  // Render the pane header (title, image)
  renderHeaderPointDetail(point, pointIndex);
  // Render the point description
  $('#point-description-input')
    .val(point.description)
    .data('point-index', pointIndex);
  // Assign the delete button to the current point
  $('#point-delete')
    .data('point-index', pointIndex);
  // Set the checkbox state
  renderApprovedCheckboxState(point.owner_approved)
  $('#approved-checkbox').data('point-index', pointIndex);
    
  // Set contributor name
  var contributorString = ''
  if (point.contributor_id === userId) {
    contributorString = 'me'
  } else {
    contributorString = contributorLookup[point.id].firstName
  }
  $('#contributor-name').text(contributorString);

  // Users can only edit their own contributed points, OR map owner can edit all
  if (userId === point.contributor_id || userIsOwner) {
    $('#header-text-input').attr('disabled', false);
    $('#point-description-input').attr('disabled', false);
    $('button#img-change').attr('disabled', false);
    $('button#point-delete').attr('disabled', false).addClass('btn-outline-danger');
  } else {
    $('#header-text-input').attr('disabled', true);
    $('#point-description-input').attr('disabled', true);
    $('button#img-change').attr('disabled', true);
    $('button#point-delete').attr('disabled', true).removeClass('btn-outline-danger');
  }

  // Only owner can 'approve' a point
  if (userIsOwner) {
    $('#approved-checkbox').attr('disabled', false)
  } else {
    $('#approved-checkbox').attr('disabled', true)
  }
  panMap(point.latitude, point.longitude)
}

// --------- Map functions -------------

// Create a single map marker from a data point
function makeMapMarker(point, pointIndex) {
  // Store lat/lng
  var position = new google.maps.LatLng(Number(point.latitude), Number(point.longitude))
  // Create a 'pin' marker on the map
  var marker = new google.maps.Marker({
    map: map,
    draggable: false,
    position: position
  });

  // Add click listener to reveal point details in panel
  marker.addListener('click', function () {
    renderPointDetail(pointIndex);
  })
  // Track this marker in the master list
  mapMarkers.push(marker);
}

// Transform the list of point data into map markers
function makeAllMapPoints(mapPoints) {
  mapMarkers = [];
  mapPoints.forEach(function (point, pointIndex) {
    makeMapMarker(point, pointIndex)
  })
}

// Zoom and recenter the map to show all points
function zoomToAllPoints() {
  // Initialize map boundaries
  var bounds = new google.maps.LatLngBounds();
  mapMarkers.forEach(function (marker) {
    bounds.extend(marker.position);
  });
  map.fitBounds(bounds);
}

// Pan the map to a specific lat/lng
function panMap(lat, lng) {
  map.panTo(new google.maps.LatLng(Number(lat), Number(lng)));
  map.setZoom(13)
}

// Delete a marker from the map
function removeMapMarker(pointIndex) {
  mapMarkers[pointIndex].setMap(null)
}

// Get a click's info
// https://developers.google.com/maps/documentation/javascript/examples/event-poi
function ClickEventHandler(map) {
  this.map = map
  this.placesService = new google.maps.places.PlacesService(map);
  this.infoWindow = new google.maps.InfoWindow;
  this.infoWindowContent = document.getElementById('infowindow-content');
  this.infoWindow.setContent(this.infoWindowContent);
  
  // Click handler for clicking on Point Of Interest
  this.handleClick = function (event) {
    if (event.placeId) {
      this.getPlaceInfo(event.placeId)
      event.stop()
    } else {
      this.openInfoWindow(event.latLng);
      event.stop()
    }
  }
  this.map.addListener('click', this.handleClick.bind(this));

  // Open the info window
  this.openInfoWindow = function (place) {
    var placeName = 'New point';
    var placeDetails = 'Click "Add" to add this point to your map';
    var placePosition;
    var placeImageUrl = '';
    var me = this

    // If this was passed a 'place' (with name, address, etc), render the place info
    if (place && place.geometry) {
      placeName = place.name;
      placeDetails = place.adr_address;
      placePosition = place.geometry.location
      placeImageUrl = place.photos[0].getUrl({maxWidth: 500, maxHeight: 500})

      // Otherwise, only a lat/lng position was passed
    } else {
      placePosition = place
    }

    // Close existing window
    this.infoWindow.close();

    // Set new info
    this.infoWindow.setPosition(placePosition);
    this.infoWindowContent.children['infowindow-name'].textContent = placeName;
    this.infoWindowContent.children['infowindow-address'].innerHTML = placeDetails;
    $('#infowindow-content').show();
    
    // Set *single* click handler for 'Add' button
    // Note: using $().off() and elem.removeEventListener() did NOT work to clear old listener.
    this.infoWindowContent.children['infowindow-btn'].onclick = function () {
      me.infoWindow.close();
      addNewPoint(placeName, placePosition.lat(), placePosition.lng(), placeImageUrl)
        .then(function(){
          return getMapPoints()
        }).then(function (data) {
          mapPoints = data;
          makeAllMapPoints(data);
          renderPointsToList(mapPoints)
        })
    }

    // Open infowindow
    this.infoWindow.open(this.map);
  }

  // Get place info from PlacesService API
  this.getPlaceInfo = function (placeId) {
    var me = this;
    this.placesService.getDetails({
      placeId: placeId
    }, function (place, status) {
      if (status === 'OK') {
        me.openInfoWindow(place)
      }
    })
  }
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
    renderHeaderMaster(mapData);
    renderDescription(mapData);
  })
  $('#points-list').on('click', '.point-entry', function () {
    var pointIndex = $(this).data('point-index');
    renderPointDetail(pointIndex);
  })

  // Handlers for updating data to database

  // Update info in the panel header's textarea
  $('#header-text-input').on('change', function (event) {
    // Check for master map title change
    if ($(event.target).hasClass('header-master')) {
      // Update the map's title in the local data object
      mapData.title = $(this).val()

      updateMapData({
        title: $(this).val()
      }).then(function () {
        console.log('saved title')
      })

      // Check for Point title change
    } else if ($(event.target).hasClass('header-point')) {
      // Get the point from the point list
      var pointIndex = $(event.target).data('point-index');
      var point = mapPoints[pointIndex];
      var pointId = point.id

      // Update the point's title in the local point array
      point.title = $(this).val();

      // Update the data
      updatePointData({
          title: $(this).val()
        }, pointId)
        .then(function () {
          console.log('saved point', pointIndex)
          renderPointsToList(mapPoints)
        })
    } else {
      console.log('Error setting title');
    }
  })

  // Update the map's description
  $('#description-input').on('change', function (data) {
    // Update the map's description in the local data object
    mapData.description = $(this).val();

    updateMapData({
      description: $(this).val()
    }).then(function () {
      console.log('saved description')
    })
  })

  // Update a point's description
  $('#point-description-input').on('change', function (event) {
    var pointIndex = $(event.target).data('point-index');
    var point = mapPoints[pointIndex];
    var pointId = point.id

    // Update the point's description in the local point array
    point.description = $(this).val();
    updatePointData({
        description: $(this).val()
      }, pointId)
      .then(function () {
        console.log('saved point description', pointIndex)
      })
  })

  // Delete a point
  $('#point-delete').on('click', function (event) {
    var pointIndex = $(event.target).data('point-index');
    var point = mapPoints[pointIndex];
    var pointId = point.id

    // Update the point's description in the local point array
    deletePoint(pointId)
      .then(function () {
        console.log('Deleted point', pointIndex)
        return getMapPoints()
      }).then(function (data) {
        // Remove marker from map
        removeMapMarker(pointIndex)
        // Rerender points to map
        mapPoints = data;
        makeAllMapPoints(data);
        zoomToAllPoints()
        renderPointsToList(mapPoints)
        // Go back to the points list
        $('#point-show-list').trigger('click');
      })
  })

  // Approve a point for display
  $('#approved-checkbox').on('change', function() {
    var pointIndex = $(this).data('point-index')
    var pointId = mapPoints[pointIndex].id;

    updatePointData({
      owner_approved: this.checked
    }, pointId).then()
  })

  // Change an image url
  $('#img-url-save').on('click', function() {
    var target = $('#img-url-input').data('target');
    var url = $('#img-url-input').val();

    // Close the image url modal
    $('#img-url-modal').modal('hide');

    // Force rerender of header image (calling master renderer not working)
    $('#header-img').attr('src', url);
    
    // Update the map's thumbnail
    if (target === 'master') {
      mapData.thumbnail_url = url
      updateMapData({thumbnail_url: url}).then()
    } else {
      var pointId = mapPoints[target].id
      updatePointData({image_url: url}, pointId).then()
    }
  })
})

function initMap() {
  // Initialize map
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: new google.maps.LatLng(43.7, -79.4)
  })
  map.panMap(map.center);
  
  clickHandler = new ClickEventHandler(map)
  getMapData()
    .then(function (data) {
      mapData = data[0];
      // Check if current user is owner to determine collaborator permissions
      userIsOwner = (userId === mapData.owner_id)
      renderHeaderMaster(mapData)
      renderDescription(mapData)
    });

  getMapPoints()
    .then(function (data) {
      mapPoints = data;
      makeAllMapPoints(data);
      zoomToAllPoints();
      renderPointsToList(mapPoints)
    })

  getMapContributors()
    .then(function(contributors) {
      for (i in contributors) {
        var point = contributors[i]
        // Construct a dictionary of pointId: {fname, lname, userId}
        contributorLookup[point.id] = {
          firstName: point.first_name,
          lastName: point.last_name,
          userId: point.contributor_id
        }
      }
    })
}
