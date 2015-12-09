$(document).ready(function(){

  /* Model */

  var Model = function() {
  }

  Model.prototype.formatOutputForRiver = function(data) {
      var html = "";
      for (var i=0; i< data.length; i++){
        html += '<li class="tweet">';
        html += '<img class="avatar" src="'+data[i].avatar_url+'" alt="">';
        html += '<div class="tweet-content">';
        html += '<p>';
        html += '<span class="full-name">'+data[i].username+'</span>';
        html += '<span class="username">'+data[i].handle+'</span>';
        html += '</p>';
        html += '<p>'+ this.contentSiftForHashTags(data[i].content, data[i].hashtag_names) +'</p>';
        html += '</div>';
        html += '</li>';
      }
      return html;
    };

  Model.prototype.getHashTags = function(content) {
    var temp_hashes = [];
    var content = content.split(" ");
    for (var i=0; i < content.length; i++) {
      if (content[i][0] == "#")
        temp_hashes.push(content[i].substring(1).trim());
    }
    return temp_hashes;
  }

  Model.prototype.contentSiftForHashTags = function(content, hashtags) {
    hashtags.forEach(function(el, ind, ar){
      content = content.replace("#"+el, "<a class='hash-tag' href=''>#"+el+"</a>");
    });
    return content;
 }



 /* Controler */

  var Controller = function() {
    this.init = function(model,view) {
      this.createTweetsCreateRoute(model,view);
      this.createTweetsSearchRoute(model,view);
      this.createTweetsGetTrendingHashtagRoute(model,view);
      this.createTweetsGetHashtagRoute(model,view);
      this.createHashtagsPopularRoute(model,view);
      this.createTweetsRecentRoute(model,view);
    }
  }


  Controller.prototype.createTweetsCreateRoute = function(model,view) {
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
      var el = model.formatOutputForRiver([res]);
      view.outputNewTweetToRiver(el);
      e.target.reset();
    });
    });
  }

  Controller.prototype.createTweetsSearchRoute = function(model,view) {
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
        view.outputToRiverWithSliding(model.formatOutputForRiver(res));
      }).fail(function(res) {
        $("[name='query']").css("background-color","red");
      });
    }
  });
  }

  Controller.prototype.createTweetsGetTrendingHashtagRoute = function(model,view) {
    $("#trends-container").on("click", ".trending-tag", function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    $.ajax({
        url: "/tweets/search/"+$(this).html(),
      }).done(function(res) {
        view.outputToRiverWithSliding(model.formatOutputForRiver(res));
      });
    });
  }

  Controller.prototype.createTweetsGetHashtagRoute = function(model,view) {
     $("#tweets-container").on("click", ".hash-tag", function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    var data = $(this).html();
    data = data.replace("#","");
    $.ajax({
        url: "/tweets/search/"+data,
      }).done(function(res) {
        view.outputToRiverWithSliding(model.formatOutputForRiver(res));
      });
    });
  }

  Controller.prototype.createHashtagsPopularRoute = function(model,view) {
    $.get("/hashtags/popular").then(function(res){
      view.outputToTrends(res);
    });
  }

  Controller.prototype.createTweetsRecentRoute = function(model,view) {
    $("#brand").on("click", function(e){
      $.get("/tweets/recent").then(function(res){
        view.outputToRiver(model.formatOutputForRiver(res));
      });
    });

    $("#brand").trigger("click");
  }


/* View */


var View = function() {
  this.river = "";
  this.trends = "";
  this.init = function() {
    river = $($("#tweets-container").children()[1]);
    trends = $($("#trends-container").children()[1]);
  }

}

View.prototype.outputToTrends = function(content) {
  var html = "";
  content.forEach(function(el,index,ar){
    html += "<li><a class='trending-tag' href=''>"+el+"</a></li>";
  });
  this.trends.html(html);
 }

View.prototype.outputToRiverWithSliding = function(content) {
  this.river.hide();
  this.river.html(content);
  this.river.slideDown();
}

View.prototype.outputToRiver = function(content) {
  this.river.html(content);
}

View.prototype.outputNewTweetToRiver = function($el){
    this.river.prepend($el);
    $(this.river.children()[0]).hide();
    $(this.river.children()[0]).slideDown();
}




/* Runner */
var firstPage = new View();
view.init();
var tweets = new Model();
var ctrl = new Controller();
ctrl.init(tweets,firstPage);

});
