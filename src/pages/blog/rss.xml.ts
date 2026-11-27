import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts } from "../../posts";

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: "EUDIPLO blog",
    description:
      "News from the EUDIPLO project: releases, guides and notes on building for the EU Digital Identity Wallet.",
    site: context.site!,
    trailingSlash: true,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      categories: post.data.tags,
      link: `/blog/${post.id}/`,
    })),
    customData: "<language>en</language>",
  });
}
