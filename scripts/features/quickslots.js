import {
  LEGACY_MODULE_IDS,
  MODULE_ID,
  QUICK_SLOT_FLAG_KEY,
  SHADOWDARK_SYSTEM_ID
} from "../core/constants.js";
import {
  findControls,
  findItemRow,
  getInventoryRoot,
  unwrapHtml
} from "../core/dom.js";

const EXCLUDED_TYPES = ["Armor", "Wand", "Scroll"];
const EXCLUDED_NAMES = ["Backpack"];

function getDexModifier(actor) {
  return actor.system?.abilities?.dex?.mod ?? 0;
}

function getQuickslotLimit(actor) {
  return Math.max(1, 1 + getDexModifier(actor));
}

function getItemSlots(item) {
  return item.system?.slots?.slots_used ?? 1;
}

function isQuickslotted(item) {
  const currentValue = item.getFlag(MODULE_ID, QUICK_SLOT_FLAG_KEY);

  // The current namespace takes precedence, including an explicit false.
  if (currentValue !== undefined) {
    return currentValue === true;
  }

  // Preserve Quickslots created under either former package ID.
  return LEGACY_MODULE_IDS.some(
    legacyId => item.getFlag(legacyId, QUICK_SLOT_FLAG_KEY) === true
  );
}

async function setQuickslotted(item, value) {
  // All new changes are written only to the current package namespace.
  return item.setFlag(MODULE_ID, QUICK_SLOT_FLAG_KEY, value);
}

function isEligibleQuickslotItem(item) {
  if (EXCLUDED_TYPES.includes(item.type)) return false;
  if (EXCLUDED_NAMES.includes(item.name)) return false;

  if (item.system?.equipped) return false;
  if (item.system?.stashed) return false;

  // Physical inventory items in Shadowdark expose the slots data model.
  if (!item.system?.slots) return false;

  return true;
}

function getUsedQuickslotSlots(actor) {
  return actor.items.reduce((total, item) => {
    if (!isQuickslotted(item)) return total;
    return total + getItemSlots(item);
  }, 0);
}

function createQuickslotButton(app, actor, item, controls) {
  const active = isQuickslotted(item);

  const button = document.createElement("a");
  button.classList.add("item-control", "quickslot-button");

  if (active) button.classList.add("active");

  const used = getUsedQuickslotSlots(actor);
  const limit = getQuickslotLimit(actor);
  const itemSlots = getItemSlots(item);

  button.title = active
    ? `Remove from quickslots. Quickslots: ${used}/${limit}`
    : `Add to quickslots (${itemSlots} slots). Quickslots: ${used}/${limit}`;

  button.innerHTML = `<i class="fa-solid fa-bolt"></i>`;

  button.addEventListener("click", async event => {
    event.preventDefault();
    event.stopPropagation();

    if (isQuickslotted(item)) {
      await setQuickslotted(item, false);
      app.render(false);
      return;
    }

    const currentLimit = getQuickslotLimit(actor);
    const currentUsed = getUsedQuickslotSlots(actor);
    const currentItemSlots = getItemSlots(item);

    if (currentUsed + currentItemSlots > currentLimit) {
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        content: `Not enough quickslots. Limit: <strong>${currentLimit}</strong>, currently used: <strong>${currentUsed}</strong>.`
      });
      return;
    }

    await setQuickslotted(item, true);
    app.render(false);
  });

  controls.prepend(button);
}

function sortRenderedCarriedGear(inventoryRoot, actor) {
  const itemLists = inventoryRoot.querySelectorAll("ol.SD-list.item-list");

  for (const list of itemLists) {
    const rows = [...list.querySelectorAll("li.item[data-item-id]")];

    const rowData = rows
      .map(row => {
        const item = actor.items.get(row.dataset.itemId);
        if (!item) return null;

        if (item.system?.equipped) return null;
        if (item.system?.stashed) return null;
        if (!item.system?.slots) return null;

        return { row, item };
      })
      .filter(Boolean);

    rowData.sort((a, b) => {
      const aQuick = isQuickslotted(a.item) ? 0 : 1;
      const bQuick = isQuickslotted(b.item) ? 0 : 1;

      if (aQuick !== bQuick) return aQuick - bQuick;
      return a.item.name.localeCompare(b.item.name);
    });

    for (const { row } of rowData) {
      list.appendChild(row);
    }
  }
}

export function registerQuickslots() {
  Hooks.on("renderActorSheet", (app, html) => {
    if (game.system.id !== SHADOWDARK_SYSTEM_ID) return;

    const actor = app.actor;
    const root = unwrapHtml(html);
    if (!actor || !root) return;

    setTimeout(() => {
      const inventoryRoot = getInventoryRoot(root);
      if (!inventoryRoot) return;

      for (const item of actor.items) {
        if (!isEligibleQuickslotItem(item)) continue;

        const row = findItemRow(inventoryRoot, item);
        if (!row || row.querySelector(".quickslot-button")) continue;

        const controls = findControls(row);
        if (!controls) continue;

        createQuickslotButton(app, actor, item, controls);
      }

      sortRenderedCarriedGear(inventoryRoot, actor);
    }, 150);
  });
}
