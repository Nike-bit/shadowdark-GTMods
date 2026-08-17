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
const NAME_COLLATOR = new Intl.Collator(undefined, {
  sensitivity: "base",
  numeric: true
});

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

  if (currentValue !== undefined) {
    return currentValue === true;
  }

  return LEGACY_MODULE_IDS.some(
    legacyId => item.flags?.[legacyId]?.[QUICK_SLOT_FLAG_KEY] === true
  );
}

async function setQuickslotted(item, value) {
  return item.setFlag(MODULE_ID, QUICK_SLOT_FLAG_KEY, value);
}

function isPhysicalInventoryItem(item) {
  return Boolean(item.system?.slots);
}

function isEligibleQuickslotItem(item) {
  if (EXCLUDED_TYPES.includes(item.type)) return false;
  if (EXCLUDED_NAMES.includes(item.name)) return false;
  if (item.system?.stashed) return false;
  if (!isPhysicalInventoryItem(item)) return false;
  return true;
}

function isActiveQuickItem(item) {
  return !item.system?.stashed && isQuickslotted(item);
}

function getUsedQuickslotSlots(actor) {
  return actor.items.reduce((total, item) => {
    if (!isActiveQuickItem(item)) return total;
    return total + getItemSlots(item);
  }, 0);
}

function createQuickslotButton(app, actor, item, row, controls) {
  const active = isQuickslotted(item);

  const button = document.createElement("a");
  button.classList.add("item-control", "quickslot-button");
  row.classList.add("gtmods-quickslot-row");

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

function createQuickSummary(actor, inventoryRoot) {
  if (inventoryRoot.querySelector(".gtmods-quick-box")) return;

  const gpInput = inventoryRoot.querySelector('[name="system.coins.gp"]');
  const coinsBox = gpInput?.closest(".SD-box");
  if (!coinsBox) return;

  const used = getUsedQuickslotSlots(actor);
  const limit = getQuickslotLimit(actor);

  const quickBox = document.createElement("div");
  quickBox.classList.add("SD-box", "gtmods-quick-box");
  quickBox.title = "Quickslots used / total Quickslots";
  quickBox.innerHTML = `
    <div class="header">
      <label>Quick</label>
      <span></span>
    </div>
    <div class="content">
      <div class="gtmods-quick-count">
        <i class="fa-solid fa-bolt"></i>
        <span>${used}/${limit}</span>
      </div>
    </div>
  `;

  coinsBox.before(quickBox);
}

function sortRenderedInventory(inventoryRoot, actor) {
  const itemLists = inventoryRoot.querySelectorAll("ol.SD-list.item-list");

  for (const list of itemLists) {
    const rows = [...list.querySelectorAll("li.item[data-item-id]")];
    if (!rows.length) continue;

    const rowData = rows
      .map(row => {
        const item = actor.items.get(row.dataset.itemId);
        if (!item || !isPhysicalInventoryItem(item)) return null;
        return { row, item };
      })
      .filter(Boolean);

    if (!rowData.length) continue;

    rowData.sort((a, b) => {
      const aQuick = isActiveQuickItem(a.item) ? 0 : 1;
      const bQuick = isActiveQuickItem(b.item) ? 0 : 1;

      if (aQuick !== bQuick) return aQuick - bQuick;
      return NAME_COLLATOR.compare(a.item.name, b.item.name);
    });

    for (const { row } of rowData) {
      list.appendChild(row);
    }
  }
}

function renderQuickslots(app, html) {
  if (game.system.id !== SHADOWDARK_SYSTEM_ID) return;

  const actor = app?.actor ?? app?.object;
  const root = unwrapHtml(html);

  if (!actor || actor.documentName !== "Actor" || actor.type !== "Player" || !root) return;

  const inventoryRoot = getInventoryRoot(root);
  if (!inventoryRoot) return;

  for (const item of actor.items) {
    if (!isEligibleQuickslotItem(item)) continue;

    const row = findItemRow(inventoryRoot, item);
    if (!row || row.querySelector(".quickslot-button")) continue;

    const controls = findControls(row);
    if (!controls) continue;

    createQuickslotButton(app, actor, item, row, controls);
  }

  createQuickSummary(actor, inventoryRoot);
  sortRenderedInventory(inventoryRoot, actor);
}

export function registerQuickslots() {
  Hooks.on("renderApplicationV1", renderQuickslots);
  Hooks.on("renderActorSheet", renderQuickslots);
  Hooks.on("renderApplicationV2", renderQuickslots);
}
