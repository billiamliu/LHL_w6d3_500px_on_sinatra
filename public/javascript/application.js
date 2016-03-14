
$(function(){

 //  _ __ ___   __ _(_)_ __
 // |  _   _ \ / _  | |  _ \
 // | | | | | | (_| | | | | |
 // |_| |_| |_|\__,_|_|_| |_|

  // NOTE: ------- SETTINGS -------

  // NOTE: needs to be truthy for other mapbox functions
  // but the real key is injected by the server and JSON relayed
  L.mapbox.accessToken = 'abc';

  var myLocation = {
    city: 'Stockholm',
    lng: 59.325,
    lat: 18.071,
    range: 20000 + 'km'
  };

  var myParams = { //500px page
    feature: 'fresh_today',
    image_size: '3,1080',
    sort: 'rating',
    page: 1,
    rpp: 24 //NOTE: 24 pics per request
  };

  var geoParams = { //500maps
    feature: 'fresh_today',
    image_size: '3,1080',
    geo: myLocation.lng + ',' + myLocation.lat + ',' + myLocation.range,
    page: 1,
    rpp: 100, //NOTE: 20-100 pictures per request
    zoom: 2
  };


  // NOTE: ------- HELPERS -------

  $('#set_button').on('click', function(){
    $(this).addClass('is-loading');
    myParams.feature = geoParams.feature = $('#set_feature').val();
    myParams.image_size = geoParams.image_size = '3,' + $('#set_size').val();
    myParams.only = geoParams.only = $('#set_category').val();
    myParams.page = geoParams.page = 1;
    setTimeout(function(){
      $('#set_button').removeClass('is-loading');
    }, 800);
  });

  // custom coordinates currently disabled
  $('#input_city').attr('placeholder', 'City: ' + myLocation.city);
  $('#input_lng').attr('placeholder', 'Longitude: ' + myLocation.lng);
  $('#input_lat').attr('placeholder', 'Latitude: ' + myLocation.lat);
  $('#input_range').attr('placeholder', 'Search Range: ' + myLocation.range);

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
  // end initial state

  // - HELPER FOR PLACEHOLD.IT IMAGES -
  var rand = function(){
    return Math.floor(Math.random() * (1440 - 400 + 1)) + 400;
  };

  // - NUKE RESULTS for 500px page -
  function nuke (){
    $('#result-col').children().remove();
    $('.modal').removeClass('is-active').find('img').remove();
    $('.modal').append('<img>').attr('src', 'http://placehold.it/800x600');
    myParams.page = 0;
  }

  // close modal for both 500px and 500maps
  $('.modal-background, .image-custom').on('click', function(){
    $('.modal').removeClass('is-active');
  });

  // NOTE: ------- NAVIGATION -------

  $('#tab_500px').on('click', function(){
    hideSections();
    $('#_500px').show();
    updateNavTabs($(this));
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

  //  ___   ___  ___
  // | __| /   \/   \  ___ __
  // `__ \|  O    O  || . \\ \/
  // |___/ \___/\___/ |  _//\_\
  //                  |_|

  $('#nuke').on('click', nuke);

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

  // modal
  $("#result-col").on('click', 'img', function(){
    var url = $(this).closest('div').data('large-url');
    var modal = $('.modal').find('p');
    modal.children('img').remove();
    var img = $('<img>').attr('src', url);
    modal.append(img);
    $('.modal').addClass('is-active');
  });


  //  ____   ___   ___
  // | ___| / _ \ / _ \ _ __ ___   __ _ _ __  ___
  // |___ \| | | | | | |  _   _ \ / _  |  _ \/ __|
  //  ___) | |_| | |_| | | | | | | (_| | |_) \__ \
  // |____/ \___/ \___/|_| |_| |_|\__,_| .__/|___/
  //                                   |_|

  $('#btn-1').on('click', function(){
    var thisButton = $(this);
    thisButton.addClass('is-loading');

  $.getJSON('/500px', geoParams, function(result){
      thisButton.removeClass('is-loading');
      geoParams.page++; // NOTE: updates page count to get new images

      var geojson = convertToGeoJSON(result);
      myLayer.setGeoJSON(geojson);
    });
  });

  function convertToGeoJSON(json){
    var arrWithGeo = json.photos.filter(function(photo){return photo.longitude;});
    var result = {
      type: 'FeatureCollection',
      features: []
    };
    // feature constructor
    function feature(id, name, description, lng, lat, sm_url, lg_url){
      this.type = 'Feature';
      this.properties = {
        id: id,
        title: name,
        description: description,
        'marker-size': 'small',
        'marker-symbol': 'camera',
        'marker-color': '#1fc8db',
        small_url: sm_url,
        large_url: lg_url
      };
      this.geometry = {
        type: 'Point',
        coordinates: [lng, lat]
      };
    }
    // feature looper
    arrWithGeo.forEach(function(photo){
      result.features.push(new feature(
        photo.id,
        photo.name,
        photo.description,
        photo.longitude,
        photo.latitude,
        photo.images[0].url,
        photo.images[1].url
      ));
    });
    return result;
  }

  // mapbox interaction
  var pic_map = L.mapbox.map('pic_map', 'mapbox.light').setView([myLocation.lng, myLocation.lat], geoParams.zoom);
  var myLayer = L.mapbox.featureLayer().on('layeradd', function(e) {
      var prop = e.layer.feature.properties;
      e.layer.bindPopup(
        '<img src="' + prop.small_url + '" />',
        {
          minWidth: 300,
          closeButton: false
        });
      }).addTo(pic_map);

  myLayer.on('mouseover', function(e) {
    e.layer.openPopup();
  });
  myLayer.on('mouseout', function(e) {
    e.layer.closePopup();
  });

  // modal
  myLayer.on('click', function(e){
    var prop = e.layer.feature.properties,
        modal = $('.modal'),
        img = $('<img>').attr('src', prop.large_url);
    modal.find('img').remove();
    modal.find('p').append(img);
    modal.addClass('is-active');
  });


});
