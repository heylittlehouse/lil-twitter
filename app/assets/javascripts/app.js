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

  Handlebars.registerPartial('singleTweet', singleSource);
  Handlebars.registerHelper('timeStamp', timeStamp)
  $.get("/tweets/recent")
  .then(function(response){

    // var source = $("#tweet-template").html();
    // var template = Handlebars.compile(source);
    // var output = template({tweets: response});
    // $("#tweets-container ul").append(output);
    var output = riverTemplate({tweets: response});
    $('#tweets-container ul#tweets').html(output);

  });

  $.get("/hashtags/popular")
  .then(function(response){
    for (var i = 0; i < response.length; i++) {
      var html = ""
      html += "<li>"
      html += response[i]
      html += "</li>"
      $('#top-hash-tags').append(html);
    }
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
    content = content.trim().replace(/\s+/, " ");
    var params = $.param({
      tweet: {
        content: content,
      },
      hashtags: hashtags.map(function(tag){tag = tag.replace("#", ""); return tag})
    })
    $.ajax({
      method: 'post',
      url: "/tweets",
      data: params,
      datatype: "json"
    }).done(function(response){
      $(singleTemplate(response)).hide().prependTo('#tweets-container ul#tweets').fadeIn("slow");
      // $('#tweets-container ul#tweets').prepend(newTweet);


    }).fail(function(error){
      console.log(error)
    })
  })

  $('#search-form').on('submit', function(event){
    event.preventDefault();
    var keyword = $('#search').val()
    $.ajax({
      method: 'get',
      url: '/tweets/search/' + keyword,
      datatype: 'json'
    }).done(function(response){
      $('#tweets-container ul li').fadeOut()
      var output = riverTemplate({tweets: response});
      $('#tweets-container').append(output);
    }).fail(function(error){
      console.log(error);
    })
  })

});
