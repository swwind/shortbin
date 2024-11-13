import { ORIGIN } from "./configs.ts";

function escapeHtml(html: string) {
  return html
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const templateIndex = (await Deno.readTextFile("./templates/index.html"))
  .replaceAll("<!-- origin -->", escapeHtml(ORIGIN));
const templatePasta = (await Deno.readTextFile("./templates/pasta.html"))
  .replaceAll("<!-- origin -->", escapeHtml(ORIGIN));
const templateError = (await Deno.readTextFile("./templates/error.html"))
  .replaceAll("<!-- origin -->", escapeHtml(ORIGIN));

export function renderPasta(id: string, pasta: string) {
  return templatePasta
    .replaceAll("<!-- id -->", id)
    .replaceAll("<!-- pasta -->", escapeHtml(pasta));
}

export function renderError(msg: string) {
  return templateError
    .replaceAll("<!-- error-message -->", msg);
}

export function renderIndex() {
  return templateIndex;
}
