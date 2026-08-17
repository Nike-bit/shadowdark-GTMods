# Shadowdark GTMods

A personal Foundry VTT module containing modular gameplay additions for the Shadowdark system.

## Version

0.5

## Foundry Package ID

`shadowdark-gtmods`

The local Foundry module directory should also be named:

`shadowdark-gtmods`

## Repository

`https://github.com/Nike-bit/Shadowdark-GTMods`

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

## Legacy ID Compatibility

Previous development builds used:

- `shadowdark-armor-padding`
- `shadowdark-gt-adds`

Version 0.5 uses the canonical package ID:

- `shadowdark-gtmods`

Existing Quickslot assignments stored under either former namespace are still recognized.
New Quickslot changes are stored under `shadowdark-gtmods`.
