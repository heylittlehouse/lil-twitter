$(document).ready(function(){
  var Tweet = function(args){
    this.avatarURL = args.avatar_url;
    this.content = args.content;
    this.handle = args.handle;
    this.tagNames = args.hashtag_names;
    this.username = args.username;
    this.timeAgo = args.timeAgo || " 0 seconds";
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
      $('#trends-container').find('ul').append('<li>' + formatTags[i] + '</li>')
    }
  });

$('#tweet-form').on('submit', function(event){
  event.preventDefault();

  $.ajax({
    method: "post",
    url: "/tweets",
    data: $(event.target).serialize()
  }).done(function(response){
    var tweet = new Tweet(response)
    var listItem = Tweet.buildListItem(tweet)
    $('#tweets-container').find('ul').prepend(listItem);
  }).fail(function(error){
    console.log(error);
  })
})
});
