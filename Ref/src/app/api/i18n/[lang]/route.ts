import { createBlocksClient } from "@seliseblocks/client";
import { languages, modules, type Dictionary, type ModuleName } from "@/lib/i18n/dictionaries";

/*
 * Serves one language's dictionaries from SELISE Blocks Localization.
 * The browser can't call the Blocks API directly (CORS only admits the project's
 * own domains), so the site's server reads it through the SDK and caches it.
 */

export const dynamic = "force-dynamic";

const TTL_MS = 10 * 60 * 1000;

const blocks = createBlocksClient({
  apiUrl: "https://api.seliseblocks.com",
  xBlocksKey: "D131af0901e624699947cc659557b247a",
});

const cache = new Map<string, { at: number; data: Promise<Partial<Record<ModuleName, Dictionary>>> }>();

async function loadAll(culture: string) {
  const entries = await Promise.all(
    modules.map(async (m) => {
      try {
        return [m, await blocks.localization.translations(m, culture)] as const;
      } catch (err) {
        console.error(`[i18n] could not load ${m} (${culture})`, err);
        return [m, {}] as const;
      }
    }),
  );
  return Object.fromEntries(entries) as Partial<Record<ModuleName, Dictionary>>;
}

export async function GET(_req: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const language = languages.find((l) => l.code.toLowerCase() === lang.toLowerCase());
  if (!language) return Response.json({ error: "Unknown language" }, { status: 404 });

  let hit = cache.get(language.culture);
  if (!hit || Date.now() - hit.at > TTL_MS) {
    hit = { at: Date.now(), data: loadAll(language.culture) };
    cache.set(language.culture, hit);
  }
  const data = await hit.data;
  // don't keep a failed load around for the full TTL
  if (Object.values(data).every((d) => !d || Object.keys(d).length === 0)) cache.delete(language.culture);

  return Response.json(data, {
    headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" },
  });
}
