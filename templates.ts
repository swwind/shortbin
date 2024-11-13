// const templateIndex = await Deno.readTextFile("./templates/index.html");
// const templatePasta = await Deno.readTextFile("./templates/pasta.html");
// const templateError = await Deno.readTextFile("./templates/error.html");

import { ORIGIN } from "./configs.ts";

function escapeHtml(html: string) {
  return html
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function renderPasta(id: string, pasta: string) {
  return (await Deno.readTextFile("./templates/pasta.html"))
    .replaceAll("<!-- origin -->", escapeHtml(ORIGIN))
    .replaceAll("<!-- id -->", id)
    .replaceAll("<!-- pasta -->", escapeHtml(pasta));
}

export async function renderError(msg: string) {
  return (await Deno.readTextFile("./templates/error.html"))
    .replaceAll("<!-- error-message -->", msg);
}

export async function renderIndex() {
  return (await Deno.readTextFile("./templates/index.html"))
    .replaceAll("<!-- origin -->", escapeHtml(ORIGIN));
}
