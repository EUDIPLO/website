// Link preview images (1200 x 630 PNG), drawn at build time with the site's
// own fonts: satori lays out the card as SVG, resvg renders it.
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import wawoff2 from "wawoff2";

export const OG_SIZE = { width: 1200, height: 630 };

const COLOR = {
  paper: "#070f24",
  surface: "#0d1934",
  line: "#1f3159",
  ink: "#e7eefb",
  soft: "#a2b1cd",
  brand: "#bec2ff",
  sun: "#ffc53b",
};

type Node = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, children?: unknown, props = {}): Node => ({
  type,
  props: { style, children, ...props },
});

const publicDir = resolve(process.cwd(), "public");
let assets: Promise<{ fonts: Parameters<typeof satori>[1]["fonts"]; logo: string }> | undefined;

// satori reads TrueType, the site ships WOFF2: decompress once per build.
function loadAssets() {
  assets ??= (async () => {
    const font = async (file: string) =>
      Buffer.from(await wawoff2.decompress(await readFile(resolve(publicDir, "fonts", file))));
    const [display, body, bodyBold, mono, logo] = await Promise.all([
      font("bricolage-grotesque.woff2"),
      font("atkinson-hyperlegible-400.woff2"),
      font("atkinson-hyperlegible-700.woff2"),
      font("martian-mono.woff2"),
      readFile(resolve(publicDir, "logo.svg")),
    ]);
    return {
      fonts: [
        { name: "Display", data: display, weight: 700 as const, style: "normal" as const },
        { name: "Body", data: body, weight: 400 as const, style: "normal" as const },
        { name: "Body", data: bodyBold, weight: 700 as const, style: "normal" as const },
        { name: "Mono", data: mono, weight: 500 as const, style: "normal" as const },
      ],
      logo: `data:image/svg+xml;base64,${logo.toString("base64")}`,
    };
  })();
  return assets;
}

export interface OgCard {
  // Small label at the top right, for example "Blog".
  section: string;
  title: string;
  description: string;
  // Bottom left, for example the date and the tags.
  meta: string[];
  // Bottom right, the address without the scheme.
  address: string;
}

export async function renderOgImage(card: OgCard): Promise<Buffer> {
  const { fonts, logo } = await loadAssets();
  const titleSize = card.title.length <= 34 ? 80 : card.title.length <= 64 ? 66 : 54;
  const mono = { fontFamily: "Mono", fontSize: 20, letterSpacing: 1.6, textTransform: "uppercase" };

  const tree = el(
    "div",
    {
      width: OG_SIZE.width,
      height: OG_SIZE.height,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "56px 64px 48px",
      backgroundColor: COLOR.paper,
      backgroundImage: `linear-gradient(135deg, ${COLOR.surface} 0%, ${COLOR.paper} 60%)`,
      color: COLOR.ink,
      fontFamily: "Body",
    },
    [
      el("div", { display: "flex", alignItems: "center", justifyContent: "space-between" }, [
        el("div", { display: "flex", alignItems: "center", gap: 18 }, [
          el("img", { width: 68, height: 68 }, undefined, { src: logo, width: 68, height: 68 }),
          el("div", { fontFamily: "Display", fontSize: 40, letterSpacing: -0.5 }, "EUDIPLO"),
        ]),
        el(
          "div",
          { ...mono, color: COLOR.paper, backgroundColor: COLOR.brand, padding: "10px 18px", borderRadius: 999 },
          card.section,
        ),
      ]),
      el("div", { display: "flex", flexDirection: "column", gap: 22 }, [
        el(
          "div",
          {
            fontFamily: "Display",
            fontSize: titleSize,
            lineHeight: 1.04,
            letterSpacing: -1.6,
            display: "block",
            lineClamp: 3,
          },
          card.title,
        ),
        el(
          "div",
          { fontSize: 30, lineHeight: 1.35, color: COLOR.soft, display: "block", lineClamp: 2, maxWidth: 980 },
          card.description,
        ),
      ]),
      el(
        "div",
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `2px solid ${COLOR.line}`,
          paddingTop: 24,
          color: COLOR.soft,
          ...mono,
        },
        [
          el(
            "div",
            { display: "flex", alignItems: "center", gap: 16 },
            card.meta.flatMap((text, index) => [
              ...(index ? [el("div", { width: 8, height: 8, borderRadius: 8, backgroundColor: COLOR.sun })] : []),
              el("div", {}, text),
            ]),
          ),
          el("div", { color: COLOR.brand, textTransform: "none", letterSpacing: 0.4 }, card.address),
        ],
      ),
    ],
  );

  const svg = await satori(tree as Parameters<typeof satori>[0], { ...OG_SIZE, fonts });
  return new Resvg(svg, { fitTo: { mode: "width", value: OG_SIZE.width } }).render().asPng();
}
