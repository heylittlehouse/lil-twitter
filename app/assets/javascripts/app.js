function timeStamp(timeString) {
  var timeSinceCreate;
  var now = moment();
  var created = moment(timeString);
  if (now.diff(created, 'seconds') < 60){
    return "< 1m";
  } else if (now.diff(created, 'minutes') < 60){
    return now.diff(created,'minutes') + 'm';
  } else if (now.diff(created, 'hours') < 24) {
    return now.diff(created, 'hours') + "h";
  } else if (now.diff(created, 'days') < 30) {
    return now.diff(created, 'days') + "D";
  }
}



$(document).ready(function(){

  var riverSource = $("#tweet-river").html();
  var riverTemplate = Handlebars.compile(riverSource);
  var singleSource =  $('#tweet-template').html();
  var singleTemplate = Handlebars.compile(singleSource);
  var tagSource = $("#hash-tag-template").html();
  var tagTemplate = Handlebars.compile(tagSource);

  Handlebars.registerPartial('singleTweet', singleSource);
  Handlebars.registerHelper('timeStamp', timeStamp)

  function poll(){
    setTimeout(function(){
      $.ajax({
        method: 'get',
        url: '/tweets/recent',
        datatype: 'json'
      }).done(function(response){

        $('#tweets li').fadeOut('slow')
        $('#tweets').append(riverTemplate({tweets: response}))
        poll();
      }).fail(function(error) {
        console.log(error);
      });
    }, 10000);
  }
  poll();


  $.get("/tweets/recent")
  .then(function(response){
    var output = riverTemplate({tweets: response});
    $('#tweets-container ul#tweets').html(output);
  });

  $.get("/hashtags/popular")
  .then(function(response){
    var output = tagTemplate({tags: response});
    $("#top-hash-tags").html(output);
  });

  $('#tweet-form').on('submit', function(event){
    event.preventDefault();
    var content = $(event.target).children("#new-tweet").val();
    var hashtags = [];
    var tag = content.match(/#[a-zA-Z]+/);

    while (tag != null) {
      content = content.replace(tag, "")
      hashtags.push(tag[0]);
      tag = content.match(/#[a-zA-Z]+/);
    }

    content = $(event.target).children("#new-tweet").val();
    var params = $.param({
      tweet: {
        content: content,
      },
      hashtags: hashtags.map(function(tag){tag = tag.replace("#", ""); return tag})
    });
    $.ajax({
      method: 'post',
      url: "/tweets",
      data: params,
      datatype: "json"
    }).done(function(response){
      $(singleTemplate(response)).hide().prependTo('#tweets-container ul#tweets').fadeIn("slow");
    }).fail(function(error){
      console.log(error);
    });
  });

  $('#search-form').on('submit', function(event){
    event.preventDefault();
    var keyword = $('#search').val();
    $.ajax({
      method: 'get',
      url: '/tweets/search/' + keyword,
      datatype: 'json'
    }).done(function(response){
      $('#search').css('background-color', 'white');
      $('#tweets-container .tweet').fadeOut();
      var output = riverTemplate({tweets: response});
      $('#tweets-container').append(output);
    }).fail(function(error){
      $('#search').css('background-color', '#ff4d4d');
    })
  });

  $('#trends-container').on('click', 'a', function(event){
    event.preventDefault();
    $.ajax({
      method: 'get',
      url: $(event.target).attr('href'),
      datatype: 'json'
    }).done(function(response){
      $('#tweets-container .tweet').fadeOut('slow');
      var output = riverTemplate({tweets: response});
      $('#tweets-container').append(output);
    }).fail(function(error){
      console.log(error);
    })
  });

  $('#brand').on('click', function(){
    $.get("/tweets/recent")
    .then(function(response){
      console.log(response);
      $('#tweets-container .tweet').fadeOut('slow');
      var output = riverTemplate({tweets: response});
      $('#tweets-container ul#tweets').append(output);
    });
  })
});


