import { MODULE_ID, SETTINGS } from "../core/constants.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

/** A dedicated, extensible GTMods configuration menu for Foundry v14. */
export class GTModsOptions extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "gtmods-options",
    classes: ["gtmods-options"],
    window: {
      title: "Shadowdark GTMods Options",
      icon: "fa-solid fa-gears",
      resizable: false
    },
    position: { width: 440 },
    tag: "form",
    form: {
      handler: this.#onSubmit,
      closeOnSubmit: true,
      submitOnChange: false
    }
  };

  static PARTS = {
    options: {
      template: `modules/${MODULE_ID}/templates/options.hbs`
    }
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    return {
      ...context,
      enableQuickslots: game.settings.get(MODULE_ID, SETTINGS.ENABLE_QUICKSLOTS)
    };
  }

  static async #onSubmit(event, form, formData) {
    const enabled = Boolean(formData.object[SETTINGS.ENABLE_QUICKSLOTS]);
    const previous = game.settings.get(MODULE_ID, SETTINGS.ENABLE_QUICKSLOTS);
    if (enabled === previous) return;

    await game.settings.set(MODULE_ID, SETTINGS.ENABLE_QUICKSLOTS, enabled);
    ui.notifications.info(`GTMods | Quickslots ${enabled ? "enabled" : "disabled"}.`);
  }
}
