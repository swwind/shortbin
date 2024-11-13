import { encodeBase58 } from "@std/encoding";
import { DBFILE } from "./configs.ts";
const kv = await Deno.openKv(DBFILE);

function randomBytes(step: number) {
  const bytes = crypto.getRandomValues(new Uint8Array(step));
  return encodeBase58(bytes);
}

async function randomId() {
  for (let n = 3;; n++) {
    for (let i = 0; i < 32; ++i) {
      const id = randomBytes(n);
      const res = await kv.get(["pasta", id]);
      if (!res.versionstamp) return id;
    }
  }
}

export type PastaType = "pasta" | "redir";

export type Pasta = {
  type: PastaType;
  value: string;
};

export async function getPasta(id: string) {
  return await kv.get<Pasta>(["pasta", id]);
}

export async function createPasta(pasta: Pasta) {
  const id = await randomId();
  const res = await kv.atomic()
    .check({ key: ["pasta", id], versionstamp: null })
    .set(["pasta", id], pasta).commit();
  return { ok: res.ok, id };
}
