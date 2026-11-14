# eudiplo.dev

Source of [eudiplo.dev](https://eudiplo.dev), the landing page of [EUDIPLO](https://github.com/EUDIPLO/eudiplo). The documentation at [docs.eudiplo.dev](https://docs.eudiplo.dev) lives in the EUDIPLO repository under `apps/docs`.

The site is a single static page (`index.html`) with self-hosted fonts (`fonts/`, no requests to Google) and no build step beyond copying files. It moved out of `apps/website` in the EUDIPLO repository; its history came along.

## What is published

`npm run build` stages `dist/` from two sources:

| Path on eudiplo.dev | Source |
| --- | --- |
| `/`, images, fonts, `_headers`, `_redirects`, `404.html` | this repository |
| `/.well-known/security.txt` | `security.txt` here; the build adds `Expires` (build date + 360 days) and fails if a `Contact` is missing from EUDIPLO's `SECURITY.md` (in production: of the latest release) |
| `/install.sh` | `apps/cli/install.sh` in EUDIPLO: in production always from the latest release, in preview from the deployed commit |
| `/schemas/v*/…`, `/schemas/index.json` | `schemas/v*/` in EUDIPLO; the build checks every `$id` and cross-schema `$ref` |

The schema URLs are the `$schema` ids of EUDIPLO configuration files, so they must stay stable. `_headers` serves them cross-origin with the JSON Schema content type, and `404.html` keeps unknown versions from falling back to the home page.

## Local build

```bash
git clone --depth 1 https://github.com/EUDIPLO/eudiplo.git eudiplo
npm run serve
```

`EUDIPLO_DIR` points the build at another EUDIPLO checkout, for example `EUDIPLO_DIR=../eudiplo npm run build`. `EUDIPLO_INSTALLER_DIR` takes the installer and `SECURITY.md` from a different checkout, as production does with the latest release.

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

Required secrets: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` here, and `WEBSITE_DISPATCH_TOKEN` in EUDIPLO/eudiplo: a fine-grained token or GitHub App token for this repository only, with *Contents: write* (needed for repository dispatch events). That permission could also push to `main`, which deploys production, so protect `main` with a ruleset (pull request and review, no bypass for the token's owner) and limit the Cloudflare token to the `eudiplo-website` Pages project.

## Contributing

Same rules as EUDIPLO: see its [contributing guide](https://github.com/EUDIPLO/eudiplo/blob/main/CONTRIBUTING.MD). Commits are signed off (`git commit -s`, DCO). Keep claims on the page verifiable in EUDIPLO's code or documentation.

## License

[Apache License 2.0](LICENSE). The fonts are under the SIL Open Font License; see `fonts/OFL-*.txt`.
