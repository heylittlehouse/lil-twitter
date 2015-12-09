describe("Setup of MVC framework", function() {
   var model;
   var view;
   var controller;
    beforeEach(function(){
      model = new Model();
      view = new View();
      controller = new Controller(model,view);
    });

  it("Will create a valid Model", function() {
    expect(model instanceof Model).toBe(true);
  });

  it("Will create a valid View", function() {
    expect(view instanceof View).toBe(true);
  });

  it("Will create a valid Controller", function() {
    expect(controller instanceof Controller).toBe(true);
  });

});

describe("Model functions", function(){
  var model
  beforeEach(function(){
      model = new Model();}

  it("Will return a tweet html block when passed in an array of tweets", function(){
    expect(model.formatOutputForRiver([{avatar_url : "http://www.this", username: "John J", handle: "A", content: "aa", hashtag_names: ""}]))

  });


});
