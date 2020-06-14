//selectors
const $ = document.querySelector.bind(document),
  $$ = document.querySelectorAll.bind(document);

function isMobile() {
  var match = window.matchMedia || window.msMatchMedia;
  if (match) {
    var mq = match("(pointer:coarse)");
    return mq.matches;
  }
  return false;
}

fetch("/ty", { method: "POST" }).then(() => {
  console.log("something happened...", "reloading page!");
  setTimeout(() => location.reload(true), 9999);
});

//get
const { ko, page } = window;
//set
let { model, ruru } = window;

//custom routing extension
ruru = args => {
  if (args.ctx && args.ctx.state.path === model.state().path) return false;

  {
    //remove other active
    for (const v of $$("header a")) v.classList.remove("active");
    const _nav = $(`header a[href="${args.param || args.ctx.state.path}"]`);
    _nav && _nav.classList.add("active");
  }

  {
    //clear other loading blurs
    for (const v of $$("view")) v.classList.remove("loading");

    const _view = $(`[path="${args.ctx.state.path}"]`);

    if (!window.chrome || (!window.chrome && isMobile())) {
      setTimeout(() => _view && _view.classList.add("loading"), 0);
      setTimeout(() => _view && _view.classList.remove("loading"), 99);
    } else {
      _view && _view.classList.add("loading");
      setTimeout(() => _view && _view.classList.remove("loading"), 0);
    }
  }

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
  //setTimeout(() => $("views").classList.remove("loading"), 9999);
};

//inherited path from server
const initialpath = $("meta[name=path").getAttribute("content");

//apparently page.js doesn't work without this lol
page.configure({ window: window });

//view handler (shows / hides views)
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
      self.darkEnabled = ko.observable(
        JSON.parse(localStorage.getItem("darkmode")) || false
      );
      self.dark = ko.computed(() => {
        return this.darkEnabled() ? "darkmode" : "";
      });
    }

    // Behaviours
    {
      self.goToIndex = () => {};
      self.toggleDark = () => {
        const val = !self.darkEnabled();
        self.darkEnabled(val);
        localStorage.setItem("darkmode", val);

        $("body").classList.add("loading");
        setTimeout(() => $("body").classList.remove("loading"), 199);
      };
    }

    //expose model func
    model = this;

    setTimeout(() => {
      $("body").classList.remove("loading"),
        $("body").setAttribute("style", "");
    }, 199);
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
