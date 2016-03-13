
$(function(){

 //  _ __ ___   __ _(_)_ __
 // |  _   _ \ / _  | |  _ \
 // | | | | | | (_| | | | | |
 // |_| |_| |_|\__,_|_|_| |_|

  // NOTE: ------- NAVIGATION -------

  var hideSections = function(){
    $('body').children('section').hide();
  };

  var updateNavTabs = function(tab){
    $('.header-tab').removeClass('is-active');
    tab.addClass('is-active');
  };


  // NOTE: initial state
  hideSections();
  $('#_hello').show();


  $('#tab_500px').on('click', function(){
    hideSections();
    $('#_500px').show();
    updateNavTabs($(this));
  });

  $('#tab_mapbox').on('click', function(){
    hideSections();
    $('#_mapbox').show();
    updateNavTabs($(this));
    // map.invalidateSize();
  });

  $('#tab_500maps').on('click', function(){
    hideSections();
    $('#_500maps').show();
    updateNavTabs($(this));
    pic_map.invalidateSize();
  });

  $('#tab_settings').on('click', function(){
    hideSections();
    $('#_settings').show();
    updateNavTabs($(this));
  });

//   ___   ___  ___
// | __| /   \/   \  ___ __
// `__ \|  O    O  || . \\ \/
// |___/ \___/\___/ |  _//\_\
//                  |_|

  // NOTE: ------- LOGISTICS -------

  var myParams = {
    feature: 'highest_rated',
    page: 1,
    image_size: '3,1080',
    rpp: 24 //NOTE: 20 pics per page/request
  };

  // - HELPER FOR PLACEHOLD.IT IMAGES -
  var rand = function(){
    return Math.floor(Math.random() * (1440 - 400 + 1)) + 400;
  };

  // - NUKE RESULTS -
  function nuke (){
    $('#result-col').children().remove();
    $('.modal').removeClass('is-active').find('img').remove();
    $('.modal').append('<img>').attr('src', 'http://placehold.it/800x600');
    myParams.page = 0;
  }

  // NOTE: ------- BUTTONS -------

  $('#nuke').on('click', nuke);

  var col2Text = 'Use local server to inject API key and fetch images';
  $('#col-2').find('p').first().remove();
  $('#col-2').prepend($('<p>').text(col2Text));

  $('#btn-2').addClass('is-primary').on('click', function(){
    var thisButton = $(this);
    thisButton.addClass('is-loading');

    $.getJSON('/500px', myParams, function(result){
      thisButton.removeClass('is-loading');
      myParams.page++; // NOTE: updates page count to get new images

      var photoArray = result.photos;
      photoArray.forEach(function(photoObj){
        var url = photoObj.images[0].url; // NOTE: Arr[0] is the first image size, [1] is the second image size
        var attributes = {
          class: 'column',
          'data-id': '500px-' + photoObj.id,
          'data-large-url': photoObj.images[1].url
        };
        var div = $('<div>').attr(attributes).addClass('is-3');
        var img = $('<img>').attr('src', url);
        div.append(img);
        $('#result-col').prepend(div);
      });
    });
  });

  // NOTE: ------- MODAL --------

  $("#result-col").on('click', 'img', function(){
    var url = $(this).closest('div').data('large-url');
    // console.log(output);
    var modal = $('.modal').find('p');
    modal.children('img').remove();
    var img = $('<img>').attr('src', url);
    modal.append(img);
    $('.modal').addClass('is-active');
  });

  $('.modal-background, .image-custom').on('click', function(){
    $('.modal').removeClass('is-active');
  });

  //                        _
  //  _ __ ___   __ _ _ __ | |__   _____  __
  // |  _   _ \ / _  |  _ \|  _ \ / _ \ \/ /
  // | | | | | | (_| | |_) | |_) | (_) >  <
  // |_| |_| |_|\__,_| .__/|_.__/ \___/_/\_\
  //                 |_|

  L.mapbox.accessToken = 'pk.eyJ1IjoiZnJlY2hkYWNoc3RlciIsImEiOiJjaWxwenoxYXkwOG1kdjZseWY2ZjdmeHhvIn0.vW1oq4fVhJwS-l4OFDtTQw';

  // var map = L.mapbox.map('map', 'mapbox.light').setView([59.325, 18.071], 13);

  // L.mapbox.featureLayer({ //NOTE: geojson
  //   type: 'Feature',
  //   geometry: {
  //       type: 'Point',
  //       coordinates: [ 18.071, 59.325 ] // NOTE: long, lat as per geojson spec
  //   },
  //   properties: {
  //       title: 'Dummy Title',
  //       description: 'Dummy description 123 hello hello',
  //       'marker-size': 'small',
  //       'marker-color': '#1fc8db',
  //       'marker-symbol': 'camera'
  //   }
  // }).addTo(map);


//  ____   ___   ___
// | ___| / _ \ / _ \ _ __ ___   __ _ _ __  ___
// |___ \| | | | | | |  _   _ \ / _  |  _ \/ __|
//  ___) | |_| | |_| | | | | | | (_| | |_) \__ \
// |____/ \___/ \___/|_| |_| |_|\__,_| .__/|___/
//                                   |_|

var geoParams = {
  geo: '59.325,18.071,1000km',
  feature: 'highest_rated',
  page: 1,
  image_size: '3,1080',
  rpp: 100 //NOTE: 20-100 pictures per page/request
};

var col1Text = 'Fetches pictures to console';
$('#col-1').find('p').first().remove();
$('#col-1').prepend($('<p>').text(col1Text));

$('#btn-1').addClass('is-primary').on('click', function(){
  var thisButton = $(this);
  thisButton.addClass('is-loading');

  $.getJSON('/500px', geoParams, function(result){
    thisButton.removeClass('is-loading');
    geoParams.page++; // NOTE: updates page count to get new images

    var photoArray = result.photos;
    var geoArray = photoArray.filter(function(photo){return photo.longitude;});
    console.log(geoArray);
    update_map(geoArray);
  });
});

var pic_map = L.mapbox.map('pic_map', 'mapbox.light').setView([59.325, 18.071], 3);


var geoPhotos = {};
function update_map(arr) {
  arr.forEach(function(photoObj){
    if (geoPhotos[photoObj.id] === undefined){
      geoPhotos[photoObj.id] = L.marker(
        [photoObj.latitude, photoObj.longitude],
        {
          icon: L.mapbox.marker.icon({
              'marker-size': 'small',
              'marker-symbol': 'camera',
              'marker-color': '#1fc8db'
          }),
          opacity: 0.5
        }
      );
      geoPhotos[photoObj.id].addTo(pic_map);
    } else {
      geoPhotos[photoObj.id].setLatLng([photoObj.latitude, photoObj.longtitude]).update();
    }
  });
}


// L.mapbox.featureLayer({ //NOTE: geojson
//   type: 'Feature',
//   geometry: {
//       type: 'Point',
//       coordinates: [ 18.071, 59.325 ] // NOTE: long, lat as per geojson spec
//   },
//   properties: {
//       title: 'Dummy Title',
//       description: 'Dummy description 123 hello hello',
//       'marker-size': 'small',
//       'marker-color': '#1fc8db',
//       'marker-symbol': 'camera'
//   }
// }).addTo(map);







});
