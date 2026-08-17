import { registerArmorPadding } from "./features/armor-padding.js";
import { registerQuickslots } from "./features/quickslots.js";
import { MODULE_TITLE } from "./core/constants.js";

Hooks.once("init", () => {
  console.log(`${MODULE_TITLE} | Initializing`);
});

registerArmorPadding();
registerQuickslots();
