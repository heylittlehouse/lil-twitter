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
      e.target.reset();
    });

  });

  $(".fa.fa-search").on("click", function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    var data = $("[name='query']").val();
    console.log(data);
    if (data != "") {
      $.ajax({
        url: "/tweets/search/"+data,
      }).done(function(res) {
        $("[name='query']").css("background-color","white");
        $("[name='query']").val("");
        $(river).hide();
        $(river).html(outputToRiver(res));
        $(river).slideDown();
      }).fail(function(res) {
        $("[name='query']").css("background-color","red");
      });
    }

  });

  $("#trends-container").on("click", ".trending-tag", function(e){
    // $(e.target).preventDefault();
    // $(e.target).stopImmediatePropagation();
    e.preventDefault();
    e.stopImmediatePropagation();
    console.log($(this).html());
    $.ajax({
        url: "/tweets/search/"+$(this).html(),
      }).done(function(res) {
        $(river).hide();
        $(river).html(outputToRiver(res));
        $(river).slideDown();
      });
  });

  $("#tweets-container").on("click", ".hash-tag", function(e){
    // $(e.target).preventDefault();
    // $(e.target).stopImmediatePropagation();
    e.preventDefault();
    e.stopImmediatePropagation();
    var data = $(this).html();
    data = data.replace("#","");
    $.ajax({
        url: "/tweets/search/"+data,
      }).done(function(res) {
        $(river).hide();
        $(river).html(outputToRiver(res));
        $(river).slideDown();
      });
  });

 $("#brand").on("click", function(e){
  $.get("/tweets/recent").then(function(res){
    $(river).html(outputToRiver(res));
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
     html += '</p>';
     html += '<p>'+ contentSiftForHashTags(data[i].content, data[i].hashtag_names) +'</p>';
     html += '</div>';
     html += '</li>';
 }
  return html;
  // $(river).html(html);
  };


 var contentSiftForHashTags= function(content, hashtags) {
  hashtags.forEach(function(el, ind, ar){
    content = content.replace("#"+el, "<a class='hash-tag' href=''>#"+el+"</a>");
  });
  return content;
 }

 // var getTags =function(tagnames) {
 //  var tags = "";
 //  tagnames.forEach(function(el,ind,arr){tags += "<a href=''>#"+el+"</a> "});
 //  return tags;
 // };


 var outputToTrends = function(data) {
  var html = "";
  data.forEach(function(el,index,ar){
    html += "<li><a class='trending-tag' href=''>"+el+"</a></li>";
  });
  $(trends).html(html);
 }








});
