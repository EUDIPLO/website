---
title: Customer onboarding
headline: Fill in sign-up and KYC forms from the Personal ID.
description: Take verified identity data from the ID that a Member State issued, instead of photos of ID cards and typed-in forms.
order: 2
kind: verify
who: Banks, insurers, telecoms
summary: Fill in sign-up and KYC forms from the Personal ID that a Member State issued. No photo of an ID card, no manual review of typed-in data.
facts:
  - label: Asks for
    chips: [given_name, family_name, birthdate, address]
  - label: Formats
    text: SD-JWT VC and mdoc, in one request
cta:
  text: Integrate into your backend
  href: https://docs.eudiplo.dev/cookbooks/integrate-backend
---

## The problem

Opening an account today often means a video call, a photo of an ID card, or a form that someone has to check by hand. Each of these is slow for the customer and expensive for you, and the data you end up with is still typed in or read from a picture.

The Personal ID in the EU Digital Identity Wallet is issued by a Member State. Your systems can verify its signature, so the name and date of birth you receive are the ones on record.

## How it works with EUDIPLO

1. You describe once which claims you need, for example name, date of birth and address.
2. For each customer, your backend creates a presentation request through the API or the TypeScript SDK, and shows the QR code or link that comes back.
3. The customer approves the request in the wallet.
4. EUDIPLO verifies the answer and delivers the claims to your backend as JSON. You fill in your form from them.

With the SDK (`@eudiplo/sdk-core`) the backend side is two calls: `createPresentationRequest` and `waitForSession`. Results can also arrive by webhook. The [receive results guide](https://docs.eudiplo.dev/presentation/receive-results) compares the options.

## What EUDIPLO checks for you

- The issuer's signature and certificate chain
- Whether the issuer is one you trust, from a trust list you choose
- That the credential is bound to the wallet that presents it
- Whether the credential has been revoked or suspended
- That the answer contains the claims you asked for

The [verification pipeline](https://docs.eudiplo.dev/concepts/presentation#verification-pipeline) describes each step.

## Showing who you are

A wallet tells its user who is asking. EUDIPLO signs each request with your access certificate, and can attach a registration certificate that states which data you are registered to ask for. For the German ecosystem, the [EUDI Hub cookbook](https://docs.eudiplo.dev/cookbooks/eudi-hub-certificates) shows how to obtain both.

## Where the data goes

The wallet encrypts its answer to a key that your EUDIPLO instance created for this one request. It is decrypted on your server and nowhere else. See [self-hosting and privacy](/self-hosting/).
