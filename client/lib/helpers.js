Handlebars.registerHelper('canEdit', function (obj, prop) {
  var owner = Meteor.users.findOne(obj[prop]);
  return owner._id === Meteor.userId();
});

Handlebars.registerHelper('displayName', function (user) {
  return WeFi.displayName(user);
});

Handlebars.registerHelper('array_of_posts', function (user) {
  var view = WeFi.view[Session.get("routed_template")];
  if ( view && view.constraints ) {
    var pc = view.constraints();
    Pagination.currentPage(Session.get('page')); 
    return Pagination.collection(Posts.find(pc[0], pc[1]).fetch());
  }
});

Handlebars.registerHelper('pager', function (user) {
  var view = WeFi.view[Session.get("routed_template")];
  if ( view && view.constraints ) {
    var pc = view.constraints();
    var count = Posts.find(pc[0], pc[1]).count();
    Pagination.currentPage(Session.get('page'));
    if (count && Pagination.totalPages(count, Pagination.perPage()) > 1)
      return Pagination.links(view.link, count);
  }
});

Handlebars.registerHelper('page_description', function (user) {
  var view = WeFi.view[Session.get("routed_template")];
  if ( view && view.description )
    return view.description();
});

WeFi.root_post_popup = function (event, template) {
  if($(event.target).hasClass('active')) {
    Session.set('showPostit', false);
  } else {
    Session.set('postit_id', null);
    Session.set('postit_mode', 'reply');
    Session.set("postit_body", null);
    WeFi.postit_target = $(template.find(".post"));
    Session.set('showPostit', true);
    Session.set('createError', null);
  }
};

WeFi.set_head = function(o) {
  o = o || {};
  var site_name = "Weekday Filler";
  $('title').text(o.title ? o.title + ' - ' + site_name : site_name);
  if (o.tags) {
    var kw = $('meta[name=keywords]');
    kw.attr("content", [o.tags, kw.attr('content')].join(', '));
  }
  if (o.description) {
    var kw = $('meta[name=description]');
    kw.attr("content", o.description);
  }
};

WeFi.scroll_to_post = function(selector) {
  var par = $(selector);
  if (par.length > 0) {
    par.scrollintoview({ topPadding: 60 })
      .animate({ backgroundColor: "#c0f5c0" }, 100 )
      .animate({ backgroundColor: "#f5f5f5" }, 8000 );
    return true;
  }
  return false;
};

WeFi.displayName = function (user) {
  if (_.isString(user))
    user = Meteor.users.findOne(user)
  if (!user)
    return null;
  if (user.username)
    return user.username;
  if (user.profile && user.profile.name)
    return user.profile.name;
};
