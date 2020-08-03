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

    {
      //detect darkmode set by user
      const t = $("#userDarkMode");
      self.darkByUser = window.getComputedStyle(t).color !== "rgb(0, 0, 0)";
    }

    //Data
    {
      self.year = new Date().getFullYear();
      self.state = ko.observable({});
      self.darkEnabled = ko.observable(
        self.darkByUser || JSON.parse(localStorage.getItem("darkmode")) || false
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

    //reveal site
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

//guid
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const guid = uuidv4();

//sse
/*let evtSource = (window.evtSource = {});
const join = force => {
  force && evtSource.close();
  evtSource = new EventSource(
    `//${window.TGB_HOST}/events/${window.BRIDGE_TOKEN}`
  );
  evtSource.addEventListener(
    "event",
    evt => {
      const payload = JSON.parse(evt.data);
      const data = payload.data;
      switch (payload.type) {
        case "msg":
          {
            console.log(1)
          }
          break;
      }
    },
    false
  );
};
join();

const rejoiner = setInterval(() => {
  const rejoin = () => join(true);
  evtSource.readyState === EventSource.CLOSED
    ? [console.warn("No connection, rejoining..."), rejoin()]
    : console.debug(
        `Connection ${evtSource.readyState === 0 ? "waiting..." : "ok :)"}`
      );
}, 9999);*/

fetch(`/con/${guid}`, { method: "POST" }).then(() => {
  console.log("something happened...", "reloading page!");
  setTimeout(() => location.reload(true), 39999);
});

fetch(`/lis/${guid}`, { method: "POST" }).then(() => {
  console.log("something happened...", "reloading page!");
  setTimeout(() => location.reload(true), 39999);
});
