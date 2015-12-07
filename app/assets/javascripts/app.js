$(document).ready(function(){
  $.get("/tweets/recent")
  .then(function(response){

    var source = $("#tweet-template").html();
    var template = Handlebars.compile(source);
    var output = template({tweets: response})
    $("#tweets-container ul").append(output)

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

});
