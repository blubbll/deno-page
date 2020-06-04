// https://deno.land demo code
import { serve } from "https:/deno.land/std@v0.50.0/http/server.ts";
import { readFileStr } from "https://deno.land/std/fs/read_file_str.ts";
import { __ } from "https://deno.land/x/dirname/mod.ts";

import {
  Application,
  Router
} from "https://deno.land/x/denotrain@v0.5.0/mod.ts";

const __dirname = eval("Deno.cwd()");

const app = new Application(),
  router = new Router();

app.get("/", async ctx => {
  ctx.res.setMimeType("text/html");
  ctx.res.addHeader("t", "e");
  return await readFileStr(`${__dirname}/views/index.html`);
});

app.get("[/.*.js]|[/.*.css]", async ctx => {
  {
    let mime;
    switch (ctx.req.path.split(".")[ctx.req.path.split(".").length - 1]) {
      case "css":
        {
          mime = "text/css";
        }
        break;
      case "js": {
        mime = "text/javascript";
      }
      default: {
        mime = "unknown";
      }
    }
    mime && ctx.res.setMimeType(mime);
  }

  return await readFileStr(`${__dirname}/assets/${ctx.req.path.slice(1)}`);
});

(async () => {
  await app.run();
})();
