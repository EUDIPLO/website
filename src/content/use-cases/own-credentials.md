---
title: Your own credentials
headline: Issue your own credentials into the same wallet.
description: Employee IDs, student cards, memberships or tickets, issued from your systems and revocable when you need it.
order: 3
kind: issue
who: Employers, universities, associations
summary: Issue employee IDs, student cards, memberships or tickets into the same wallet. Claims can come from your login or your own API, and you can revoke each credential later.
facts:
  - label: Issues
    text: SD-JWT VC or mdoc, bound to the holder's device
  - label: Login
    text: Keycloak or any OpenID Connect provider
cta:
  text: Issue your first credential
  href: https://docs.eudiplo.dev/cookbooks/first-credential
---

## The idea

The wallet is not only for government IDs. Any organization can issue credentials into it: an employee ID, a student card, a membership, a ticket. The holder then presents them the same way as the Personal ID, online or to another organization.

## How it works with EUDIPLO

1. You define the credential: its type, its claims, and how it looks in the wallet (name, colors, logo, per language).
2. Your backend creates an offer through the API. The user scans the QR code or opens the link.
3. The wallet fetches the credential from EUDIPLO, which signs it with your key.

EUDIPLO issues SD-JWT VC and mdoc over OpenID4VCI.

## Where the claims come from

- **From your backend:** pass the claims when you create the offer.
- **From your own API:** EUDIPLO calls an endpoint of yours when the wallet collects the credential.
- **From a login:** the user signs in at your identity provider first, such as Keycloak or another OpenID Connect provider, and the credential is filled from that account.

The [claims guide](https://docs.eudiplo.dev/issuance/claims) explains the order in which these apply, and the cookbook [Issue after login](https://docs.eudiplo.dev/cookbooks/issue-after-login) walks through the login case.

## Bound to the holder

A credential can be bound to a key in the holder's wallet, so a copy of it is useless on another device. mdoc credentials are always bound; for SD-JWT VC it is one setting.

## Revocation

Turn on status management and every credential gets an entry in a Token Status List. You can revoke or suspend it later with one API call. The cookbook [Revocable credentials](https://docs.eudiplo.dev/cookbooks/revocable-credentials) shows the full cycle.

## Your signing keys

Keys can live in the database, encrypted, or in HashiCorp Vault, AWS KMS or an HSM over PKCS#11. The [key management page](https://docs.eudiplo.dev/operate/kms) lists every provider and what it supports.
