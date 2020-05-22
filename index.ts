// https://deno.land demo code
import { serve } from "https:/deno.land/std@v0.50.0/http/server.ts";
const env = Deno.env.toObject();
const s = serve({ port: parseInt(env.PORT) });
console.log(`http://localhost:${env.PORT}/`);
for await (const req of s) {
  req.respond({ body: "Hello World\n" });
}