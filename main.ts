import "@std/dotenv/load";
import { Hono } from "@hono/hono";
import { serveStatic } from "@hono/hono/deno";
import { createPasta, getPasta } from "./kv.ts";
import { renderError, renderIndex, renderPasta } from "./templates.ts";
import { AUTH_TOKEN, HOSTNAME, ORIGIN, PORT } from "./configs.ts";

const app = new Hono();

// Get index
app.get("/", (c) => {
  return c.html(renderIndex());
});

// Get pasta
app.get("/:id", async (c) => {
  const id = c.req.param("id");
  const res = await getPasta(id);
  if (!res.versionstamp) {
    return c.html(renderError("Not Found"), 404);
  }
  const raw = c.req.query("raw") != null;
  const pasta = res.value;
  switch (pasta.type) {
    case "redir":
      return c.redirect(pasta.value, 302);
    case "pasta":
      return raw ? c.text(pasta.value) : c.html(renderPasta(id, pasta.value));
    default:
      return c.text("Invalid pasta", 500);
  }
});

// Authorize for POST
app.post(async (c, next) => {
  if (AUTH_TOKEN) {
    const token = c.req.header("Authorization") || "";
    if (token !== `Bearer ${AUTH_TOKEN}`) {
      return c.html(renderError("Access prohibited"), 403);
    }
  }
  await next();
});

// upload text file, use -F "c=@-"
app.post("/", async (c) => {
  const body = await c.req.formData();
  const content = body.get("c");
  const value = (content instanceof File ? await content.text() : content || "")
    .trim();

  if (!value) {
    return c.text("Content is empty", 400);
  }

  const res = await createPasta({ type: "pasta", value });
  if (!res.ok) {
    return c.text("KV error", 500);
  }
  return c.text(`${ORIGIN}/${res.id}\n`);
});

// shorten URL, use -d "@-"
app.post("/u", async (c) => {
  const content = await c.req.text();
  const value = content.trim();

  // validate URL
  try {
    new URL(value);
  } catch {
    return c.text("Invalid URL", 400);
  }

  const res = await createPasta({ type: "redir", value });
  if (!res.ok) {
    return c.text("KV error", 500);
  }
  return c.text(`${ORIGIN}/${res.id}\n`);
});

app.use("/*", serveStatic({ root: "./public" }));
app.get("/*", (c) => {
  return c.html(renderError("404 Not Found"), 404);
});

Deno.serve({ hostname: HOSTNAME, port: PORT }, app.fetch);
