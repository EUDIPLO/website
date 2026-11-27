---
title: Interoperability testing
headline: Test a wallet against a real issuer and verifier.
description: One installation gives wallet makers and national programs an issuer and a verifier with real certificates, trust lists and status lists.
order: 4
kind: test
who: Wallet makers, national programs
summary: Test a wallet against a conformant issuer and verifier with real certificates, trust lists and status lists, in one installation.
facts:
  - label: Runs at
    href: https://playground.eudi-wallet.org/
    linkText: EUDI Wallet Playground
    text: of the German EUDI ecosystem
  - label: Tested with
    text: 4 wallets, with versions and dates in the docs
cta:
  text: See wallet compatibility
  href: https://docs.eudiplo.dev/reference/wallet-compatibility
---

## The problem

A wallet has to work with issuers and verifiers it has never seen. Testing that needs a counterpart that follows the specifications and lets you change every setting: formats, flows, trust lists, revocation.

## What EUDIPLO gives you

One installation is both sides. It issues credentials to the wallet under test and then asks for them back, with:

- SD-JWT VC and mdoc
- QR code, same-device, Digital Credentials API and ISO 18013-7 Annex C flows
- Certificates, trust lists and status lists that you create and control
- A web client to set all of this up and to follow each session, including the reason a session failed

## Checked against the specifications

Pull requests to EUDIPLO run the OpenID Foundation conformance suite, with its test plans for an OpenID4VCI issuer and an OpenID4VP verifier. The [testing guide](https://docs.eudiplo.dev/contributing/testing) describes the setup.

## Tested with real wallets

The maintainers test by hand against the EU Reference Wallet, Paradym Wallet, Multipaz and the EU Age Verification app. The [wallet compatibility page](https://docs.eudiplo.dev/reference/wallet-compatibility) lists each wallet with its version, the date, and which features worked. These results are not a certification.

## In use

The [EUDI Wallet Playground](https://playground.eudi-wallet.org/) of the German EUDI ecosystem runs EUDIPLO for testing wallets and their interoperability.
