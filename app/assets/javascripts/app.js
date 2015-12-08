var timeStamp = function(timeString){
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

var renderTweetPartial = function(data){
  console.log(data);
  data.timestamp = timeStamp(data.created_at);
  var output = template(data);
  $("#tweets-container ul").prepend(output);
}


$(document).ready(function(){

  var riverSource = $("#tweet-river").html();
  var riverTemplate = Handlebars.compile(riverSource);
  var singleSoure =  $('#tweet-template').html();
  var singleTemplate = Handlebars.compile(singleSoure);

  Handlebars.registerPartial('singleTweet', $('#tweet-template').html());

  $.get("/tweets/recent")
  .then(function(response){

    // var source = $("#tweet-template").html();
    // var template = Handlebars.compile(source);
    // var output = template({tweets: response});
    // $("#tweets-container ul").append(output);
    console.log(response);
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
    var tag = content.match(/#[a-z]+/)
    while (tag != null) {
      hashtags.push(tag[0]);
      content.replace(tag[0], "");
      tag = content.match(/#[a-z]+/);
    }
    content = content.trim();
    // var params = $.param({
    //   tweet: {
    //     content: content,
    //     hashtags: hashtags
    //   }
    // })
    debugger
    $.ajax({
      method: 'post',
      url: "/tweets",
      data: $(event.target).serialize(),
      datatype: "json"
    }).done(function(response){
      console.log(response)
      $('#tweets-container ul#tweets').prepend(singleTemplate(response));
    }).fail(function(error){
      console.log(error)
    })
  })

});
