# Shadowdark GTMods

A personal Foundry VTT module containing modular gameplay additions for the Shadowdark system.

## Version

0.5.1

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

## v0.5.1 Hotfix

- Restored Quickslot decoration on Shadowdark Player sheets in Foundry v14.
- Uses the current ApplicationV1 render path while retaining compatibility fallbacks.
- Keeps Quickslots restricted to eligible carried physical gear.
- Preserves Quickslot assignments created under earlier GTMods development IDs.

## Legacy ID Compatibility

Previous development builds used:

- `shadowdark-armor-padding`
- `shadowdark-gt-adds`

Version 0.5.1 uses the canonical package ID:

- `shadowdark-gtmods`

Existing Quickslot assignments stored under either former namespace are still recognized.
New Quickslot changes are stored under `shadowdark-gtmods`.