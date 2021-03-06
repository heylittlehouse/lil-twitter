$(document).ready(function(){
  var Tweet = function(args){
    this.avatarURL = args.avatar_url;
    this.content = args.content;
    this.handle = args.handle;
    this.tagNames = args.hashtag_names;
    this.username = args.username;
    this.timeAgo = " "+(new Date - new Date(args.created_at))+ " seconds ago" || " 0 seconds ago";
  };

  Tweet.formatTags = function(tagNames){
    var tags = "";
    for(var i=0; i < tagNames.length; i++){
      tags += "#" + tagNames[i] + " "
    };
    return tags
  };

  Tweet.buildListItem = function(tweet){
    html = "<li class='tweet'>"
    html += "<img class='avatar' src=" + tweet.avatarURL + " alt=''>"
    html += '<div class="tweet-content">'
    html += '<p>'
    html += '<span class="full-name">' + tweet.username + '</span>'
    html += '<span class="username">' + tweet.handle + '</span>'
    html += '<span class="timestamp">' + tweet.timeAgo + '</span>'
    html += '</p>'
    html += '<p>' + tweet.content + '</p>'
    html += '<p>' + Tweet.formatTags(tweet.tagNames) + '</p>'
    html += '</div>'
    html += '</li>'
    return html
  };

  Tweet.parseTagsFromSubmit = function(params){
    splitContent = params.content.split(" #");
    params.content = splitContent.shift();
    params.hashtag_names = splitContent;
    return params
  };

/* populate the recent tweet board */
  $.get('/tweets/recent').then(function(response){
    var tweets = [];
    for(var i=0; i < response.length; i++){
      tweets.push(new Tweet(response[i]));
    };
     return tweets
  }).then(function(tweets){
    htmlItems=[];
    for(var i=0; i < tweets.length; i++){
      htmlItems.push(Tweet.buildListItem(tweets[i]))
    };
    return htmlItems
  }).then(function(htmlItems){
    for(var i=0; i<htmlItems.length; i++){
      $('#tweets-container').find('ul').append(htmlItems[i])
    };
  });

/* populate the trending hashtags */
  $.get('/hashtags/popular').then(function(response){
    var formatTags = Tweet.formatTags(response).split(" ") //bc it returns each hashtag as a string
    for(var i=0; i<response.length; i++){
      $('#trends-container').find('ul').append('<li><a href="/tweets/search/' + response[i] + '">' + formatTags[i] + '</a></li>')
    }
  });

/* recompose the URI serialized data */
function recomposeURI(serializedData){
  var splitArr = serializedData.split("+%23");
  return hashtagsArr = splitArr.slice(1);
}

/* ajax new tweet to the top of the river...and it FADES! */
  $('#tweet-form').on('submit', function(event){
    event.preventDefault();
    var hashtagsArr = recomposeURI($(event.target).serialize())
    var params = $.param({
        tweet: {content: $('#new-tweet').val()},
        hashtags: hashtagsArr
      });

    $.ajax({
      method: "post",
      url: "/tweets",
      data: params
    }).done(function(response){
      var parsedResponse = Tweet.parseTagsFromSubmit(response);
      var tweet = new Tweet(parsedResponse);
      var listItem = Tweet.buildListItem(tweet);
      $('#new-tweet').val("");
      $('#tweets-container').find('ul').prepend($(listItem).fadeIn(1000));
    }).fail(function(error){
      console.log(error);
    });
  })

/* ajax in hashtag */
  var hashtagAjax= function(event){
    event.preventDefault();

    if(event.target.tagName == "FORM"){
      var myURL = '/tweets/search/' + $(event.target).find("#search").val();
    }else{
      var myURL = $(event.target).attr("href");
    };

    $.ajax({
      method: "get",
      url: myURL,
      data: $(event.target).serialize(),
      dataType: "json"
    }).then(function(response){
      var tweets = [];
      for(var i=0; i < response.length; i++){
        tweets.push(new Tweet(response[i]));
      };
       return tweets
    }).then(function(tweets){
      htmlItems=[];
      for(var i=0; i < tweets.length; i++){
        htmlItems.push(Tweet.buildListItem(tweets[i]))
      };
      return htmlItems
    }).done(function(htmlItems){
        $('#tweets-container').find('ul').find('li').remove();
      for(var i=0; i<htmlItems.length; i++){
        $('#tweets-container').find('ul').append(htmlItems[i])
      };
    }).fail(function(error){
      $("#search").css({
        'background-color': "red",
        'border-color': "red"
      });
      $("#search").animate({
        'background-color': "white",
        'border-color': "white"
      }, 3000);
    })
  };

/* ajax for the search bar */
  $("#search-form").on('submit', hashtagAjax);

/* ajax for the trending tags ul */
  $("#trends-container").on('click', 'a', hashtagAjax);

/* call the hashtag ajax method above for click */
});
