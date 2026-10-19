# Shadowdark GTMods

A personal Foundry VTT module containing modular gameplay additions for the Shadowdark system.

## Version

0.6.4

## Foundry Package ID

`shadowdark-gtmods`

## Current Features

- Armor Padding
- Quickslots / Quickstash

## v0.6.0 Inventory Update

- Quickslot bolts now remain available on eligible equipped gear.
- Equipped Quickslot items continue to count as Quick access items, effectively providing a Quickstash option.
- Stashed items do not consume active Quickslot capacity, but retain their stored Quickslot flag for when they are unstashed.
- Inventory lists are rendered in a stable order: active Quick items first, then remaining items, alphabetically within each group.
- Adds a `Quick` summary box above Coins showing used Quickslots / total Quickslots.
- Inventory-specific styling now lives in `styles/inventory.css` instead of a general catch-all stylesheet.

## Legacy ID Compatibility

Previous development builds used:

- `shadowdark-armor-padding`
- `shadowdark-gt-adds`

Existing Quickslot assignments stored under either former namespace are still recognized.
New Quickslot changes are stored under `shadowdark-gtmods`.


## v0.6.4 Module Options

In a running world, a GM can open **Configure Settings → Module Settings → Shadowdark GTMods → Configure GTMods**.

The dedicated GTMods Options menu currently has one checkbox: **Enable Quickslots** (enabled by default).
Disabling the feature hides its bolts and Quick counter and disables Quickslot-based sorting.
Existing item flags are preserved, so switching the feature back on restores assignments.
Open Player sheets are refreshed when the setting changes.

Settings are registered on Foundry's `init` hook via `scripts/core/settings.js`.
The menu is implemented as an ApplicationV2 form in `scripts/apps/options.js` with a template in `templates/options.hbs`.
The form's CSS is kept separately in `styles/options.css`.


## v0.6.4 Settings Registration and Release Fix

- Restores `registerGTModsSettings()` in the module entry point.
- Adds an ordinary **Enable Quickslots** checkbox in Configure Settings as a fallback alongside the **Configure GTMods** submenu.
- Fixes automated GitHub packaging to include `templates/options.hbs`.
- Validates the versioned release tag and ZIP filename against module.json.
- Source update contains the complete repository tree to prevent partial file uploads.

**Release procedure:** Extract the repository ZIP into the local GitHub Desktop repo, replacing matching files; commit and push `main`. GitHub Actions will create `v0.6.4` and both assets automatically. Do not create another release manually unless the workflow fails.
