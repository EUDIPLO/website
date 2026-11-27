---
title: Age verification
headline: Ask for "over 18" and nothing else.
description: Platforms that must protect minors get a yes or no from the user's wallet, without a name or a birth date.
order: 1
kind: verify
who: Online platforms, shops
summary: Ask for "over 18" and nothing else. Platforms that must protect minors under DSA Article 28 get a yes or no, without a name or birth date.
facts:
  - label: Asks for
    chips: [age_over_18]
  - label: Runs at
    href: https://www.espuni.com/
    linkText: espuni
    text: age verification as a service
cta:
  text: Verify your first credential
  href: https://docs.eudiplo.dev/cookbooks/first-presentation
---

## The problem

An age gate that asks for a photo of an ID card collects far more than it needs: name, address, document number and a face. A checkbox collects nothing and proves nothing. The EU Digital Identity Wallet makes a third option possible. The user shares one attribute, and the platform learns only that.

## How it works with EUDIPLO

1. Your backend asks EUDIPLO for a presentation request. The request names the claims you want, in this case a single age attribute of the Personal ID.
2. The user opens the request in the wallet: by scanning a QR code, through a link on the same device, or in the browser through the Digital Credentials API.
3. The wallet shows what is asked for, and the user approves.
4. EUDIPLO checks the answer: the issuer's signature and certificate chain, whether the issuer is on a trust list you accept, that the credential belongs to this wallet, and that it has not been revoked.
5. Your backend receives the result as JSON, by webhook or by asking for the session.

The [query language](https://docs.eudiplo.dev/presentation/dcql) decides what the wallet may share. A query for the age attribute alone returns the age attribute alone. You can also name the value you accept, so a wallet that answers "not over 18" fails the check.

## Formats and wallets

The Personal ID exists as SD-JWT VC and as mdoc, and one request can accept either. For browsers that speak ISO 18013-7 Annex C, EUDIPLO supports that flow as well. It has been tested with the European Commission's Age Verification app; the [wallet compatibility page](https://docs.eudiplo.dev/reference/wallet-compatibility) lists what was tested and when.

## What you store

EUDIPLO keeps a session so your backend can fetch the result. Sessions are deleted after a retention period you set, 24 hours by default. Instead of deleting, you can keep the session and clear the presented data. Details are on the [self-hosting and privacy page](/self-hosting/).

## Running it for others

EUDIPLO is multi-tenant. [espuni](https://www.espuni.com/) runs age verification as a service for online platforms this way: one installation, and a separate tenant with its own keys and settings per customer.
