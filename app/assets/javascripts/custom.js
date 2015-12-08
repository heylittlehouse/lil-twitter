function fiftyTweets(){
  var delayed_response=$.get('/tweets/recent').then(function(response){
    return response;
  });
  return delayed_response;
}

function displayFiftyTweets(){
  return fiftyTweets().then(function(data){
    data.forEach(function(ele){
      var date = new Date(ele.created_at);
      ele.created_at=date.toDateString();
    });
    var source=$("#tweets-item").html();
    var template=Handlebars.compile(source);
    var output=template({tweets:data});
    $("#tweets-container").html(output);
  });
}

function tenHashTags(){
  var delayed_response=$.get("/hashtags/popular").then(function(response){
    return response;
  });
  return delayed_response;
}

function displayTenHashTags(){
  return tenHashTags().then(function(data){
    var source=$("#tenHashTags").html();
    var template=Handlebars.compile(source);
    var output=template({hashTags:data});
    $("#trends-container").html(output);
  });
}
function postNewTweet(){
  $("#tweet-form").on("submit",function(event){
    event.preventDefault();
    var hashTagArray=parseHashTag();
    var content=$("#new-tweet-field").val();
    var data= {"tweet":{"content": content},"hashtags":hashTagArray};
    $.ajax({
      method:"post",
      url:"/tweets",
      data:data
    }).done(function(result){
      var source=$("#new-tweet").html();
      var template=Handlebars.compile(source);
      var output=template({tweet:result})
      // $("#tweets-container ul").prepend(output);
      $(output).hide().prependTo("#tweets-container ul").slideDown('slow');
      ouput="";
      $("#new-tweet-field").val("");
    }).fail(function(error){
      console.log(error);
    });
  });
}
function parseHashTag(){
  var content=$("#new-tweet").val();
  var startIndex;
  var endIndex;
  var hashArray=[];
  for(var i=0;i<content.length;i++){
    if(content[i]=="#"){
      startIndex=i;
      for(var j=i+1;j<content.length;j++){
        if(content[j]==" " || content[j]=="#"){
          endIndex=j;
          break;
        }
      };
      var hash=content.substring(startIndex+1,endIndex);
      hashArray.push(hash);
    }
  }
  return hashArray;
}
function handleSearch(searchPhrase){
    var delayed_response=$.get('/tweets/search/'+searchPhrase)
    .then(function(response){
      var source=$("#search-result").html();
      var template=Handlebars.compile(source);
      var output=template({tweets:response});
      $("#tweets-container").html(output);
    })
    .fail(function(error){
      $('#search').css("border","1px solid red");
    });
}

$(document).ready(function(){
  displayFiftyTweets().then(function(){
    postNewTweet();

    $("#search-form").on("submit",function(event){
      event.preventDefault();
      var searchPhrase=$('#search').val();
      handleSearch(searchPhrase);
    });
  });
  displayTenHashTags().then(function(){
    $("#trends-container").on("click",function(event){
      event.preventDefault();
      var searchPhrase=$(event.target).attr("href");
      // console.log(searchPhrase);
      handleSearch(searchPhrase);
    });
  });
  $("#brand").on("click",function(event){
    displayFiftyTweets();
  });
});
