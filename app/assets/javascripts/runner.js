$(document).ready(function(){

  var river = $("#tweets-container").children()[1];
  var trends = $("#trends-container").children()[1];

  $("#tweet-form").on("submit", function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var tweetContent = $($(e.target).children()[0]).val();
    var data = $.param( { tweet: {content: tweetContent} } );
    data += "&"+$.param( { hashtags: getHashTags(tweetContent) } );
    $.ajax({
      url: "/tweets",
      method: "post",
      dataType: "json",
      data: data
    }).done(function(res){
      var el = outputToRiver([res]);
      $(river).prepend(el);
      $($(river).children()[0]).hide();
      $($(river).children()[0]).slideDown();
    });


  });

  $.get("/tweets/recent").then(function(res){
    $(river).html(outputToRiver(res));
  });

  $.get("/hashtags/popular").then(function(res){
    outputToTrends(res);
  });


  var getHashTags = function(content) {
    var temp_hashes = [];
    var content = content.split(" ");
    for (var i=0; i < content.length; i++) {
      if (content[i][0] == "#")
        temp_hashes.push(content[i].substring(1).trim());
    }
    return temp_hashes;
  }

  var outputToRiver = function(data) {
    var html = "";
    for (var i=0; i< data.length; i++){
     html += '<li class="tweet">';
     html += '<img class="avatar" src="'+data[i].avatar_url+'" alt="">';
     html += '<div class="tweet-content">';
     html += '<p>';
     html += '<span class="full-name">'+data[i].username+'</span>';
     html += '<span class="username">'+data[i].handle+'</span>';
     // html += '<span class="timestamp">'+(data[i].created_at - (new Date())) +'</span>';
     html += '</p>';
     html += '<p>'+data[i].content+" "+ getTags(data[i].hashtag_names) +'</p>';
     html += '</div>';
     html += '</li>';
 }
  return html;
  // $(river).html(html);
  };

 var getTags =function(tagnames) {
  var tags = "";
  tagnames.forEach(function(el,ind,arr){tags += "<a href=''>#"+el+"</a> "});
  return tags;
 };


 var outputToTrends = function(data) {
  var html = "";
  data.forEach(function(el,index,ar){
    html += "<li>"+el+"</li>";
  });
  $(trends).html(html);
 }








});
