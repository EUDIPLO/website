import type { APIContext } from "astro";
import type { CollectionEntry } from "astro:content";
import { renderOgImage } from "../../../og";
import { getPosts } from "../../../posts";
import { formatDate } from "../../../site";

// One link preview image per blog post: /og/blog/<slug>.png
export async function getStaticPaths() {
  const posts = await getPosts();
  return posts.map((post) => ({ params: { id: post.id }, props: { post } }));
}

export async function GET({ props }: APIContext<{ post: CollectionEntry<"blog"> }>) {
  const { title, description, date, tags } = props.post.data;
  const png = await renderOgImage({
    section: "Blog",
    title,
    description,
    meta: [formatDate(date), ...tags.slice(0, 2)],
    address: "eudiplo.dev/blog",
  });
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
}
