var Chat = Backbone.Model.extend({
  urlRoot: 'http://localhost:8080/classes/messages',
  defaults: {
    roomname: "main"
  },
  parse: function(response) {
    response.id = response._id;
    if (response.text === undefined) {
      response.text = null;
    }
    if (response.username === undefined) {
      response.username = "anonymous";
    }
    if (response.roomname === undefined) {
      response.roomname = null;
    }

    if (this.collection && _.contains(this.collection.friends, response.username)) {
      response.isFriend = true;
    } else {
      response.isFriend = false;
    }
    return response;
  }
});