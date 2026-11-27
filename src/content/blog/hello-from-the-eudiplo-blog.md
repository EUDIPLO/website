---
title: Hello from the EUDIPLO blog
description: eudiplo.dev grows from one page into a website with use cases, a page on self-hosting, and this blog. Here is where the project stands.
date: 2026-11-27
tags: [project]
---

Until today, eudiplo.dev was a single page. It now has a few more: [use cases](/use-cases/) in detail, a page on [self-hosting and privacy](/self-hosting/), one [about the project](/about/), and this blog.

## What EUDIPLO is

EUDIPLO is open-source middleware between your application and the EU Digital Identity Wallet. Your backend makes an API call to ask for a credential or to issue one. EUDIPLO runs the protocols, checks trust and revocation, and returns a JSON result.

It is software you run yourself. What users share from their wallets is decrypted on your server and reaches nobody else.

## Where the project stands

- **Version 10.1** is the current release. Version 10.0 came out on 20 November 2026. It checks trust lists, certificates, wallet attestations and presented credentials more strictly, as the specifications require. The [upgrade guide](https://docs.eudiplo.dev/upgrade/9.x-to-10.0) lists what changes for you.
- **Protocols:** OpenID4VCI and OpenID4VP, with SD-JWT VC and mdoc, and the Token Status List for revocation. The [protocol reference](https://docs.eudiplo.dev/reference/protocols) has the full list, including what is not supported.
- **Tested:** pull requests run the OpenID Foundation conformance suite. Four wallets are tested by hand, with the results on the [wallet compatibility page](https://docs.eudiplo.dev/reference/wallet-compatibility).
- **In use:** the EUDI Wallet Playground of the German EUDI ecosystem and espuni's age verification service run EUDIPLO. The [showcase](https://docs.eudiplo.dev/showcase) lists who uses it.
- **Home:** EUDIPLO is an LF Decentralized Trust project under the Apache 2.0 license.

## What to expect here

- Release notes in plain language: what a new version changes and why
- Guides that are too long or too specific for the documentation
- Notes on the specifications and the ecosystem, when something changes that affects people who build for the wallet

Posts will be occasional. There is an [RSS feed](/blog/rss.xml) if you want to follow along.

## Try it

```bash
curl -fsSL https://eudiplo.dev/install.sh | bash
eudiplo demo
```

This starts EUDIPLO and its web client with sample data on your machine. It needs Docker or Podman. From there, the [cookbooks](https://docs.eudiplo.dev/cookbooks) take you to a credential in a real wallet.

Questions and feedback are welcome in the EUDIPLO channel on the [LF Decentralized Trust Discord](https://discord.gg/5Q4bgBQABa).
