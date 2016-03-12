
$(function(){

 //  _ __ ___   __ _(_)_ __
 // |  _   _ \ / _  | |  _ \
 // | | | | | | (_| | | | | |
 // |_| |_| |_|\__,_|_|_| |_|

  // NOTE: ------- NAVIGATION -------
  $('#tab_500px').on('click', function(){
    $('body').children('section').css('display', 'none');
    $('#_500px').css('display', 'block');
    $('.header-tab').removeClass('is-active');
    $(this).addClass('is-active');
  });

  $('#tab_gmaps').on('click', function(){
    $('body').children('section').css('display', 'none');
    $('#_gmaps').css('display', 'block');
    $('.header-tab').removeClass('is-active');
    $(this).addClass('is-active');
  });

  $('#tab_500maps').on('click', function(){
    $('body').children('section').css('display', 'none');
    $('#_500maps').css('display', 'block');
    $('.header-tab').removeClass('is-active');
    $(this).addClass('is-active');
  });

  $('#tab_settings').on('click', function(){
    $('body').children('section').css('display', 'none');
    $('#_settings').css('display', 'block');
    $('.header-tab').removeClass('is-active');
    $(this).addClass('is-active');
  });


//   ___   ___  ___
// | __| /   \/   \  ___ __
// `__ \|  O    O  || . \\ \/
// |___/ \___/\___/ |  _//\_\
//                  |_|

  // NOTE: ------- LOGISTICS -------

  var savedKey = null;

  $('#btn-0').text('save key until page refresh');
  $('#btn-0').one('click',function(){
    savedKey = $('#consumer_key').val();
    $(this).addClass('is-disabled');
  });

  var myConsumerKey = function(){
    if (savedKey) {
      return savedKey;
    }
    else if ($('#consumer_key').val()){
      return $('#consumer_key').val();
    }
    else {
      return prompt('Enter API key');
    }
  };

  var myParams = {
    consumer_key: myConsumerKey,
    feature: 'highest_rated',
    page: 1,
    image_size: '3,1080'
  };

  // - HELPER FOR PLACEHOLD.IT IMAGES -
  var rand = function(){
    return Math.floor(Math.random() * (1440 - 400 + 1)) + 400;
  };

  // - NUKE ON KEYPRESS -
  function nuke (){
    $('#result-col').children().remove();
    $('.modal').removeClass('is-active').find('img').remove();
    $('.modal').append('<img>').attr('src', 'http://placehold.it/800x600');
  }
  $('#nuke').on('click', nuke);

  // NOTE: ------- TEST BUTTONS -------

  // NOTE: this is a local sandbox button without invoking the API
  var col1Text = 'add random placeholder images to DOM';
  $('#col-1').find('p').first().remove();
  $('#col-1').prepend($('<p>').text(col1Text));
  $('#btn-1').on('click', function(){
    var attributes = {
      class: "column",
      'data-id': "img-1",
      'data-large-url': "http://placehold.it/" + rand() + 'x' + rand()
    };
    var div = $('<div>').attr(attributes).addClass('is-3');
    var img = $('<img>').attr('src', 'http://placehold.it/' + rand() + 'x' + rand());
    div.append(img);
    $('#result-col').append(div);
  });

  // NOTE: button 2 for modal development
  var col2Text = 'modal development';
  $('#col-2').find('p').first().remove();
  $('#col-2').prepend($('<p>').text(col2Text));

  $('#btn-2').addClass('is-primary').on('click', function(){
    var thisButton = $(this);
    thisButton.addClass('is-loading');

    $.getJSON('https://api.500px.com/v1/photos', myParams, function(result){
      thisButton.removeClass('is-loading');
      myParams['page']++; // NOTE: updates page count to get new images

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

  // NOTE: this works
  var col3Text = 'load some images to console';
  $('#col-3').find('p').first().remove();
  $('#col-3').prepend($('<p>').text(col3Text));
  $('#btn-3').addClass('is-warning').on('click', function(){
    var thisButton = $(this);
    thisButton.addClass('is-loading');
    $.getJSON('https://api.500px.com/v1/photos', myParams, function(result){
      thisButton.removeClass('is-loading');
      var photoArray = result.photos;
      photoArray.forEach(function(photoObj){
        console.log('photoObj');
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

  //   __ _ _ __ ___   __ _ _ __  ___
  //  / _  |  _   _ \ / _  |  _ \/ __|
  // | (_| | | | | | | (_| | |_) \__ \
  //  \__, |_| |_| |_|\__,_|  __/|___/
  //  |___/                |_|


});
