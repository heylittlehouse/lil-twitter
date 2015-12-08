$(document).ready(function(){

  $.get("tweets/recent").then(function(response){
    // console.log(response);
    var source = $("#tweet-template").html();
    var template = Handlebars.compile(source);
    var output = template({tweets: response});
    $("#tweets-container ul").html(output);
  });

  $.get("hashtags/popular").then(function(trends){
    var source = $("#trends-template").html();
    var template = Handlebars.compile(source);
    var output = template({trends: trends});
    $("#trends-container ul").html(output);
  });

  $("#top-nav #brand").on("click", ".header-link", function(event){
    event.preventDefault();
    $.ajax({
      url: "/tweets/recent",
    }).done(function(response){
      var source = $("#tweet-template").html();
      var template = Handlebars.compile(source);
      var output = template({tweets: response});
      $("#tweets-container ul").html(output);
    });
  });

  $("#tweet-form").on("submit", function(event){
    event.preventDefault();
    var log = $(event.target).children("#new-tweet").val();
    var hashtags = log.match(/(#[a-z0-9][a-z0-9\-_]*)/ig) || []
    log = log.replace(/(#[a-z0-9][a-z0-9\-_]*)/ig, "")
    for(var i=0; i < hashtags.length; i++){
      hashtags[i] = hashtags[i].replace('#', '');
    }
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

  $("#search-form").on("click keypress", "input",function(event){
    $("#search-form #search").css("background-color", "white");
  });

  $("#search-form").on("submit", function(event){
    event.preventDefault();
    var content = $(event.target).children("#search").val();
    var url = "/tweets/search/" + content;
    $.ajax({
      method: "get",
      url: url
    }).done(function(response){
      var source = $("#tweet-template").html();
      var template = Handlebars.compile(source);
      var output = template({tweets: response});
      $("#tweets-container ul").html(output);
      $("#search-form #search").val("");
    }).fail(function(){
      $("#search-form #search").css("background-color", "red").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    });
  });

  $("#trends-container").on("click",".hashtag-link", function(event){
    event.preventDefault();
    var content = $(event.target).text();
    var url = "/tweets/search/" + content;
    $.ajax({
      method: "get",
      url: url
    }).done(function(response){
      var source = $("#tweet-template").html();
      var template = Handlebars.compile(source);
      var output = template({tweets: response});
      $("#tweets-container ul").html(output);
    });
  });
});
