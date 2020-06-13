//© by Blubbll

import { serve } from "https:/deno.land/std@v0.50.0/http/server.ts";
import { readFileStr } from "https://deno.land/std/fs/read_file_str.ts";

import {
  Application,
  Router
} from "https://deno.land/x/denotrain@v0.5.0/mod.ts";

const __dirname = window.Deno.env.toObject().PWD;

const app = new Application(),
  router = new Router(),
  host = window.Deno.env.toObject().PROJECT_DOMAIN
    ? "https://deno-page.glitch.me"
    : "http://deno-page.eu-4.evennode.com";
{
  //sitemap
  let sitemap = "";
  const start = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;
  const end = `</urlset>`;
  sitemap += start;
  const dirs = {
    click: {
      path: "/click"
    }
  };

  for (const dir in dirs) {
    sitemap += `<url>
<loc>${host}/${dir}</loc>
<lastmod>${new Date().toISOString()}</lastmod>
<priority>1.0</priority>
</url>`;
  }
  sitemap += end;
  sitemap = sitemap.trim();

  app.get("/sitemap.xml", async ctx => {
    ctx.res.setMimeType("application/xml");
    return sitemap;
  });
}

{
  //[melon deployment]
  if (!window.Deno.env.toObject().PROJECT_DOMAIN) {
    app.post("/melon/:token", async ctx => {
      if (ctx.req.params.token === window.Deno.env.toObject().MELON_TOKEN) {
        console.log("refreshing app yo");
        window.Deno.exit();
      }
      return "nothing";
    });
  }
}

 app.post("/test", async ctx => {
   console.log(JSON.parse(ctx.req.body.payload))
  
 })

//serve
app.get(".*", async ctx => {
  console.debug(ctx.req.path);

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
    }
    if (mime) {
      ctx.res.setMimeType(mime);
      return (await readFileStr(
        `${__dirname}/assets/${ctx.req.path.slice(1)}`
      )).trim();
    } else {
      ctx.res.setMimeType("text/html");
      return (await readFileStr(`${__dirname}/views/index.html`))
        .replace("{{from}}", ctx.req.path)
        .replace(
          "{{base}}",
          //`//${ctx.req.original.headers.get("host")}/`
          `${host}`
        );
    }
  }
});

(async () => {
  await app.run();
})();
