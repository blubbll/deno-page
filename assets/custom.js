//selectors
const $ = document.querySelector.bind(document),
  $$ = document.querySelectorAll.bind(document);

//get
const { ko, page } = window;
//set
let { model, ruru } = window;

//custom routing extension
ruru = args => {
  if (args.ctx && args.ctx.state.path === model.state().path) return false;

  for (const v of $$("view")) $("views").classList.remove("loading");

  const _view = $(`[path="${args.ctx.state.path}"]`);
  _view && _view.classList.add("loading");

  if (model.firstrouted || !args.first) {
    //only if we aren't here already
    if (args.ctx.state.path !== model.state().path) {
      console.log("%c Routing to", "background: #222; color: lime", {
        path: args.ctx.path,
        param: args.param || null
      });

      args.cb && args.cb(args.param, true);
    }
    model.state({ path: args.ctx.state.path });

    if (!model.routed) {
      args.cb && args.cb(args.param, true);
      model.routed = true;
    }
  } else {
    console.log("%c Routing VIA FIRST to", "background: #222; color: lime", {
      path: model.state().path
    });
    model.firstrouted = true;
    page.replace(model.state().path);
  }
  setTimeout(() => $("views").classList.remove("loading"), 999);
};

//inherited path from server
const initialpath = $("meta[name=path").getAttribute("content");

//apparently page.js doesn't work without this lol
page.configure({ window: window });

ko.bindingHandlers.view = {
  init: (element, valueAccessor) => {
    element.style.display =
      element.getAttribute("path") === model.state().path ? "flex" : "none";
  },
  update: (element, valueAccessor) => {
    element.style.display =
      element.getAttribute("path") === model.state().path ? "flex" : "none";
  }
};

//setup knock model
ko.applyBindings(
  new (function() {
    // proxyfying
    var self = this;
    //Data
    {
      self.year = new Date().getFullYear();
      self.state = ko.observable({});
    }

    // Behaviours
    {
      self.goToIndex = () => {};
    }

    //expose model func
    model = this;

    $("body").classList.remove("loading");
  })()
);

//setup Routes
{
  page("/", (ctx, next) => {
    ruru({ ctx });
  });
  page("/click", (ctx, next) => {
    ruru({ ctx });
  });
  page("/sub/dir", (ctx, next) => {
    ruru({ ctx });
  });
  page("/*", (ctx, next) => {
    ruru({ ctx: { state: { path: "404" } } });
  });
}

//execute route from server (or default route)
{
  const _path = initialpath === "/" ? "/" : initialpath;
  model.state({ path: _path });
  ruru({
    ctx: { state: { path: "" } },
    cb: model.goToFolder,
    param: _path,
    first: true
  });
}
