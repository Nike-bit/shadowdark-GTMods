import { MODULE_ID, SETTINGS } from "./constants.js";
import { GTModsOptions } from "../apps/options.js";

export { SETTINGS };

/** Refresh open Player sheets when the world-level Quickslots setting changes. */
function refreshPlayerSheets() {
  for (const app of Object.values(globalThis.ui?.windows ?? {})) {
    const actor = app.actor ?? app.object;
    if (!app.rendered || actor?.documentName !== "Actor" || actor.type !== "Player") continue;

    Promise.resolve(app.render(false)).catch(error => {
      console.error("Shadowdark GTMods | Could not refresh Player sheet", error);
    });
  }
}

export function registerGTModsSettings() {
  // Store the value in a normal world setting, but present it in our own menu.
  game.settings.register(MODULE_ID, SETTINGS.ENABLE_QUICKSLOTS, {
    name: "Enable Quickslots",
    hint: "Enable Quickslot controls, sorting and the Quick counter.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    onChange: refreshPlayerSheets
  });

  game.settings.registerMenu(MODULE_ID, "options", {
    name: "GTMods Options",
    label: "Configure GTMods",
    hint: "Enable or disable GTMods features.",
    icon: "fa-solid fa-gears",
    type: GTModsOptions,
    restricted: true
  });
}

export function areQuickslotsEnabled() {
  return game.settings.get(MODULE_ID, SETTINGS.ENABLE_QUICKSLOTS) !== false;
}
