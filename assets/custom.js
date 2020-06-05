//selectors
const $ = document.querySelector.bind(document),
  $$ = document.querySelectorAll.bind(document);

//get
const { ko, page } = window;
//set
let { model, ruru } = window;

//custom routing extension
ruru = args => {
  if (!args.first) {
    //only if we aren't here already
    if (args.ctx.state.path !== model.state.path) {
      console.log("%c Routing to", "background: #222; color: lime", {
        path: args.ctx.path,
        param: args.param || null
      });

      args.cb(args.param, true);
    }
    model.state.path = args.ctx.state.path;

    if (!model.routed) {
      args.cb(args.param, true);
      model.routed = true;
    }
  } else {
    console.log("%c Routing VIA FIRST to", "background: #222; color: lime", {
      path: model.state.path
    });
    model.firstrouted = true;
    page.replace(model.state.path);
  }
};

//inherited path from server
const initialpath = $("meta[name=path").getAttribute("content");

//apparently page.js doesn't work without this lol
page.configure({ window: window });

//setup knock model
ko.applyBindings(
  new (function() {
    // proxyfying
    var self = this;
    //Data
    {
      self.year= new Date().getFullYear();
      self.state = {};
    }

    // Behaviours
    {
      self.goToIndex = () => {
        
      };
    }

    //expose model func
    model = this;
  })()
);

//setup Routes
{
  page("/", model.goToIndex);
  page("/folder/:folder", (ctx, next) => {
    ruru({ ctx, cb: model.goToFolder, param: ctx.params.folder });
  });
  page("/mail/:mail", (ctx, next) => {
    ruru({
      ctx,
      cb: model.goToMail,
      param: { id: ctx.params.mail, folder: model.chosenFolderId() }
    });
  });
}

//execute route from server (or default route)
{
  const _path = initialpath === "/" ? "/welcome" : initialpath;
  model.state = { path: _path };
  ruru({ cb: model.goToFolder, param: _path, first: true });
}
