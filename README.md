# Shadowdark GTMods

A personal Foundry VTT module containing modular gameplay additions for the Shadowdark system.

## Version

0.5.2

## Foundry Package ID

`shadowdark-gtmods`

The local Foundry module directory should also be named:

`shadowdark-gtmods`

## Repository

`https://github.com/Nike-bit/shadowdark-GTMods`

## Current Features

- Armor Padding
- Quickslots

## Groundwork

- `scripts/main.js` — single ES-module entry point
- `scripts/core/constants.js` — shared constants
- `scripts/core/dom.js` — common Shadowdark sheet/DOM helpers
- `scripts/features/armor-padding.js` — Armor Padding mechanics
- `scripts/features/quickslots.js` — Quickslot mechanics
- `styles/gtmods.css` — shared styling

## v0.5.2 Hotfix

- Fixes Quickslots failing to render when legacy GTMods module namespaces are no longer active.
- Reads legacy Quickslot values directly from stored item flags instead of calling `getFlag()` with an inactive module scope.
- Continues writing all new Quickslot state only to `shadowdark-gtmods`.

## Legacy ID Compatibility

Previous development builds used:

- `shadowdark-armor-padding`
- `shadowdark-gt-adds`

Version 0.5.2 uses the canonical package ID:

- `shadowdark-gtmods`

Existing Quickslot assignments stored under either former namespace are still recognized.
New Quickslot changes are stored under `shadowdark-gtmods`.
