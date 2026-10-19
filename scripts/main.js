import { registerArmorPadding } from "./features/armor-padding.js";
import { registerQuickslots } from "./features/quickslots.js";
import { MODULE_TITLE } from "./core/constants.js";
import { registerGTModsSettings } from "./core/settings.js";

Hooks.once("init", () => {
  registerGTModsSettings();
  console.log(`${MODULE_TITLE} | Initializing`);
});

registerArmorPadding();
registerQuickslots();
