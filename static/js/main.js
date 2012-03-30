var chat = new function () {

  var Chat = Backbone.Model.extend({
    idAttribute: '_id',
    initialize: function () {
      _.bindAll(this);
    },
    url: function () {
      if (this.isNew()) {
        return '/ws/chat';
      } else {
        return '/ws/chat/' + this.get('_id');
      }
    }
  });

  var Chats = Backbone.Collection.extend({
    model: Chat,
    url: '/ws/chat',
    comparator: function (chat) {
      return chat.get('timestamp');
    }
  });

  var HistoryView = Backbone.View.extend({
    el: '.history',
    events: {
      'click li': 'rmChat'
    },
    initialize: function () {
      _.bindAll(this);
      Backbone.Events.on('newChat', this.addChat);
      this.collection = new Chats();
      this.collection.fetch({
        success: this.render
      });
    },
    render: function () {
      var self = this;
      var liTemplate = _.template($('#chat-li').html());
      $(this.el).html('');
      _(this.collection.models).each(function (chat) {
        $(self.el).append(liTemplate(chat.toJSON()));
      });
    },
    addChat: function (chat) {
      var self = this;
      chat.save({}, {
        success: function (chat, res) {
          self.collection.add(chat);
          self.render();
          var $hist = $(self.el);
          $hist.animate({ scrollTop: $hist.prop("scrollHeight") - $hist.height() }, 'slow');
        }
      });
    },
    rmChat: function (evt) {
      var index = $('.history li').index($(evt.currentTarget));
      this.collection.at(index).destroy({
        success: this.render
      });
    }
  });

  this.ClientView = Backbone.View.extend({
    el:'.client',
    events: {
      'click .chat': 'chat',
      'keyup .text': 'typity'
    },
    initialize: function () {
      _.bindAll(this);
      $(this.el).find('.text').focus();
      new HistoryView();
    },
    chat: function () {
      var chat = new Chat();
      chat.set('text', $(this.el).find('.text').val());
      Backbone.Events.trigger('newChat', chat);
      $(this.el).find('.text').val('').focus();
    },
    typity: function (evt) {
      if (evt.which === 13) {
        this.chat();
      }
    }
  });
};

$(function () {
  new chat.ClientView();
});