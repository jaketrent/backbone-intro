var databaseUrl = 'backbone';
var collections = ['chats'];
var db = require('mongojs').connect(databaseUrl, collections);
var mongo = require('mongodb');
var BSON = mongo.BSONPure;

module.exports.get = function (success, error) {
  db.chats.find(function(err, chats) {
    var result = [];
    if( err || !chats) error(err, chats);
    else chats.forEach(function(chat) {
      result.push(chat);
    });
    success(result);
  });
};

module.exports.add = function (chat, success, error) {
  db.chats.save({
    text: chat.text,
    timestamp: new Date()
  }, function (err, saved) {
    if (err || !saved) {
      error(err, saved);
    } else {
      success(saved);
    }
  });
};

module.exports.save = function (id, chat, success, error) {
  db.chats.update({
    _id: new BSON.ObjectID(id)
  }, {
    $set: {
      text: chat.text
    }
  }, function (err, updated) {
    if (err || !updated) {
      error(err, chat);
    } else {
      success(chat);
    }
  });
};

module.exports.remove = function (id, success, error) {
  db.chats.remove({
    _id: new BSON.ObjectID(id)
  }, function (err, removed) {
    if (err || !removed) {
      error(err);
    } else {
      success();
    }
  });
};
