$(document).ready(function(){

  $.get("tweets/recent").then(function(response){
    console.log(response);
    // debugger
    var source = $("#tweet-template").html();
    var template = Handlebars.compile(source);
    var output = template({tweets: response});
    $("#tweets-container ul").html(output);
  });

  $.get("hashtags/popular").then(function(trends){
    console.log(trends);

    var source = $("#trends-template").html();
    var template = Handlebars.compile(source);
    var output = template({trends: trends});
    $("#trends-container ul").html(output);
  });

  $("#tweet-form").on("submit", function(event){
    event.preventDefault();
    var log = $(event.target).children("#new-tweet").val();
    var hashtags = log.match(/(#[a-z0-9][a-z0-9\-_]*)/ig);
    $.ajax({
      method: "post",
      url: "/tweets",
      data: {tweet:{content: log}, hashtags: hashtags},
      datatype: "json"
    }).done(function(response){
      var source = $("#tweet-template").html();
      var template = Handlebars.compile(source);
      var output = template({tweets: [response]});
      $("#tweets-container ul").prepend(output);
      $("#tweet-form, textarea").val("");
    });
  });

});
