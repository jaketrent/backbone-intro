var express = require('express');
var chat = require('./lib/chat.js');

var app = express.createServer(express.logger());

app.configure(function () {
  app.use(express.logger());
  app.use(express.static(__dirname + '/static'));
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.methodOverride());
});

app.configure('development', function () {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack:true
  }));
});
app.configure('production', function () {
  app.use(express.errorHandler());
});

app.set('views', __dirname + '/views');

app.set('view options', { layout: false });

app.register('.html', {
  compile: function(str, options){
    return function(locals){
      return str;
    };
  }
});

app.get('/', function(req, res) {
  res.render('index.html');
});

function error(err, data) {
  console.log("ERROR: " + err);
  console.log("DATA: " + data);
}

app.get('/ws/chat', function(req, res) {
  chat.get(function (chats) {
    res.send(chats);
  }, error);
});

app.post('/ws/chat', function(req, res) {
  chat.add(req.body, function (chat) {
    res.send(chat);
  }, error);
});

app.put('/ws/chat/:id', function(req, res) {
  chat.save(req.params.id, req.body, function (chat) {
    res.send(chat);
  }, error);
});

app.del('/ws/chat/:id', function(req, res) {
  chat.remove(req.params.id, function () {
    res.send();
  }, error);
});

var port = 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});