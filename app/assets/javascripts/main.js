$(document).ready(function(){
  var Tweet = function(args){
    this.avatarURL = args.avatar_url;
    this.content = args.content;
    this.handle = args.handle;
    this.tagNames = args.hashtag_names;
    this.username = args.username;
    this.timeAgo;
  };

  Tweet.formatTags = function(tweet){
    var tags = "";
    for(var i=0; i < tweet.tagNames.length; i++){
      tags += "#" + tweet.tagNames[i] + " "
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
    html += '<p>' + Tweet.formatTags(tweet) + '</p>'
    html += '</div>'
    html += '</li>'
    return html
  };

  $.get('/tweets/recent').then(function(response){
    var tweets = [];
    for(var i=0; i < response.length; i++){
      tweets.push(new Tweet(response[i]));
    };
     return tweets
  }).then(function(tweets){
    listItems=[];
    for(var i=0; i < tweets.length; i++){
      listItems.push(Tweet.buildListItem(tweets[i]))
    };
    return listItems
  }).then(function(htmlItems){
    for(var i=0; i<htmlItems.length; i++){
      $('#tweets-container').find('ul').append(htmlItems[i])
    };
  });
});
