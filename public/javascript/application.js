
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

  $('#tab_gmaps').on('click', function(){
    hideSections();
    $('#_gmaps').show();
    updateNavTabs($(this));
  });

  $('#tab_500maps').on('click', function(){
    hideSections();
    $('#_500maps').show();
    updateNavTabs($(this));
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
    image_size: '3,1080'
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
    myParams['page'] = 0;
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
