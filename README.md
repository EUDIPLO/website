# eudiplo.dev

Source of [eudiplo.dev](https://eudiplo.dev), the website and blog of [EUDIPLO](https://github.com/EUDIPLO/eudiplo). The documentation at [docs.eudiplo.dev](https://docs.eudiplo.dev) lives in the EUDIPLO repository under `apps/docs`.

The site is built with [Astro](https://astro.build) as static HTML. Fonts are self-hosted (`public/fonts/`, no requests to Google), and no page loads anything from another origin. It moved out of `apps/website` in the EUDIPLO repository; its history came along.

## Layout

| Path | Content |
| --- | --- |
| `src/layouts/Base.astro` | Head, header, navigation and footer of every page. The navigation is the `NAV` list in `src/site.ts`. |
| `src/pages/` | One file per page: home, `use-cases/`, `self-hosting`, `about`, `blog/` (list, post, tag pages, RSS feed) and `404`. |
| `src/home/body.html`, `src/scripts/home.js` | The home page. Its markup is plain HTML that is inserted as is, because the code samples contain braces. |
| `src/content/blog/*.md` | Blog posts. |
| `src/content/use-cases/*.md` | One use case per file; the front matter fills the cards, the body the detail page. |
| `src/styles/site.css`, `src/styles/pages.css` | Design tokens and home page sections; subpages and blog. |
| `public/` | Files copied as they are: fonts, images, icons, `_headers`, `_redirects`, `robots.txt`. |

### Write a blog post

Add `src/content/blog/<slug>.md`; the file name becomes the URL `/blog/<slug>/`.

```markdown
---
title: What 10.1 changes
description: One or two sentences, at most 200 characters. Shown in the list, the feed and link previews.
date: 2026-12-01
tags: [release]
---

Text in Markdown.
```

Optional fields: `author` (default "The EUDIPLO maintainers"), `updated` (date) and `draft: true`, which shows the post in `npm run dev` only. `src/content.config.ts` holds the schema; a post that does not match it fails the build. The list, the tag pages, the RSS feed (`/blog/rss.xml`) and the sitemap pick up the post on their own.

## What is published

`npm run build` runs `astro build`, which writes the pages and `public/` to `dist/`, and then `scripts/build.mjs`, which adds the files that come from an EUDIPLO checkout:

| Path on eudiplo.dev | Source |
| --- | --- |
| Pages, `/blog/rss.xml`, `/sitemap-index.xml`, images, fonts, `_headers`, `_redirects`, `404.html` | this repository |
| `/.well-known/security.txt` | `security.txt` here; the build adds `Expires` (build date + 360 days) and fails if a `Contact` is missing from `SECURITY.md` of the same EUDIPLO commit as the schemas, so the contacts follow `main` and not the latest release |
| `/install.sh` | `apps/cli/install.sh` in EUDIPLO: in production always from the latest release, in preview from the deployed commit |
| `/schemas/v*/…`, `/schemas/index.json` | `schemas/v*/` in EUDIPLO; the build checks every `$id` and cross-schema `$ref` |

The schema URLs are the `$schema` ids of EUDIPLO configuration files, so they must stay stable. `_headers` serves them cross-origin with the JSON Schema content type, and `404.html` keeps unknown versions from falling back to the home page. No page or file in `public/` may use `/install.sh`, `/.well-known/` or `/schemas/`; the build fails if one does.

## Local build

```bash
npm ci
git clone --depth 1 https://github.com/EUDIPLO/eudiplo.git eudiplo
npm run serve
```

`npm run dev` starts Astro's development server with live reload for work on pages and posts; it does not need the EUDIPLO checkout and does not serve the installer, the schemas or `security.txt`. Both scripts turn off Astro's telemetry.

`EUDIPLO_DIR` points the build at another EUDIPLO checkout, for example `EUDIPLO_DIR=../eudiplo npm run build`. `EUDIPLO_INSTALLER_DIR` takes the installer from a different checkout, as production does with the latest release.

## Deployment

`.github/workflows/deploy.yml` deploys to the `eudiplo-website` Cloudflare Pages project:

| Trigger | Environment | EUDIPLO commit |
| --- | --- | --- |
| Push to `main` here | production | head of `main` |
| `eudiplo-production` dispatch (EUDIPLO's *Versioned Release*, also with `deploy_site_only`) | production | the released commit |
| Monthly schedule | production | head of `main` (keeps `security.txt` from expiring) |
| `eudiplo-preview` dispatch (every push to EUDIPLO `main`) | preview | that commit |
| Pull request | build only | head of `main` |
| Manual run | chosen | chosen commit or tag, default head of `main` |

Schema versions are append-only: EUDIPLO's CI refuses changes to a snapshot once a release shipped it, and never removes one. So `main` serves every released version. It can also serve a version that no release has shipped yet; such a snapshot may still change before its release, exactly like the files the `main` pre-release of the CLI writes with it. Production already served v4 and v5 when the site moved here, although no release had shipped them yet, so building the schemas from the latest release would take them offline. Every EUDIPLO commit the workflow builds from must be on `main`; the installer never comes from an unreleased commit in production.

Required secrets: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` here (a Cloudflare API token with only *Account → Cloudflare Pages → Edit* on the EUDIPLO account; Cloudflare cannot narrow it to one Pages project), and `WEBSITE_APP_PRIVATE_KEY` in the `website-deploy` environment of EUDIPLO/eudiplo (deployments limited to `main`). EUDIPLO sends its dispatch events with a short-lived token of the org-owned GitHub App `eudiplo-website-deploy`, which is installed on this repository only with *Contents: write*. That permission could also push to `main`, which deploys production, so `main` is protected by a ruleset (pull request and review) that the App cannot bypass.

## Contributing

Same rules as EUDIPLO: see its [contributing guide](https://github.com/EUDIPLO/eudiplo/blob/main/CONTRIBUTING.MD). Commits are signed off (`git commit -s`, DCO). Keep claims on the page verifiable in EUDIPLO's code or documentation.

## License

[Apache License 2.0](LICENSE). The fonts are under the SIL Open Font License; see `fonts/OFL-*.txt`.
