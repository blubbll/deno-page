//© by Blubbll

//imports
const { Deno } = window;
import { serve } from "https:/deno.land/std@v0.50.0/http/server.ts";
import { readFileStr } from "https://deno.land/std/fs/read_file_str.ts";
import { readLines } from "https://deno.land/std@v0.51.0/io/bufio.ts";

import {
  Application,
  Router
} from "https://deno.land/x/denotrain@v0.5.0/mod.ts";

//dirname
const __dirname = Deno.env.toObject().PWD;

//setup
const app = new Application(),
  router = new Router(),
  sFinity = 999999999,
  host = Deno.env.toObject().PROJECT_DOMAIN
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
  if (!Deno.env.toObject().PROJECT_DOMAIN) {
    app.post("/melon/:token", async ctx => {
      if (ctx.req.params.token === Deno.env.toObject().MELON_TOKEN) {
        const commit = ctx.req.body.head_commit;
        //console.log(commit.id)

        console.log(
          "refreshing app yo, reason:",
          `"${commit.message}"[#${commit.id}]`
        );
        Deno.exit();
      }
      return "nothing";
    });
  }
}

//serve
app.get(".*", async ctx => {
  //console.debug(ctx.req.path);

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

{
  //socket stuff
  setInterval(async () => {
    const ips = `/app/ips`;

    const p = await Deno.run({
      cmd: ["ss"],
      stdout: "piped"
    });
    //let t = "";
    for await (const line of readLines(p.stdout)) {
      
      if (line.startsWith("tcp")) {
        //console.log(line)
        const state = line.includes(" ESTAB ") ? true : false
        const ip = line.split(":")[line.split(":")[2]=== "ffff" ? 3:2].trim();
        const port = +((line.split(":")[line.split(":")[2]=== "ffff" ? 4:3]||"").trim());

        //t += line;
        port && console.log({state, ip, port})
      }
    }
    //t = t.trim();

    for (const sock of socks) {
      // console.log(t)

      /*if (sock && !t.includes(`::ffff:${sock.prx}`)) {
        //remove sock
        socks.splice(socks.indexOf(sock));
        console.log(`Sock with ip ${sock.ip} disconnected!`);
      }*/
    }
    console.log(`Connected visitors: ${socks.length - 1}`);
  }, 9999);

  const socks = [""];
  //abuse long-polling fetch to reload page when server changes
  app.post("/ty", async ctx => {
    //console.log(ctx.req)
    const _sock = ctx.req.original.conn.remoteAddr;
    const sock = `${_sock.hostname}${_sock.port}`;

    //console.log(ctx.req.original.headers)
    const head = ctx.req.original.headers.get("x-forwarded-for");

    const prx = head.includes(":") ? head.split(",")[2].split(":")[3] : head;
    const ip = head.includes(":") ? head.split(",")[0] : head;
    const promise = new Promise(r => setTimeout(r, sFinity));

    socks.push({ promise, sock, ip, prx });
    console.log(
      `visitor with ip [${ip}] connected via [${prx}] to sock [${sock}]!`
    );
    return await promise;
  });
}

(async () => {
  await app.run();
})();
