function loadUserMaps(location, userMaps){
  userMaps.forEach(function(map){
    $(location).append(createMapElement(map));
  });
}

function createMapElement(map){
  return (`
    <li class="list-group-item">
      <div class="map-info">
        <h3><a href="/map/${map.id}">${map.title}</a></h3>
        <p class="date-text">
          Date Created: ${map.date_created.slice(0, -14)}<br />
          Date Updated: ${map.date_updated.slice(0, -14)}
        </p>
      </div>
      <div class="map-body">
        <div class="row">
          <div class="col-6">
            <span class="map-description">${map.description}</span>
          </div>
          <div class="col-6">
            <span class="map-image"><img src="${map.thumbnail_url}"></span>
          </div>
        </div>
      </div>
    </li>
    `)
}

$( document ).ready(function() {
  loadUserMaps("#all-maps",allMaps);
});
