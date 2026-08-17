import { SHADOWDARK_SYSTEM_ID } from "../core/constants.js";
import { findControls, findItemRow, unwrapHtml } from "../core/dom.js";

const PADDING = {
  "Armor Padding (Light)": { die: "1d4", repairCost: 5, originalSlots: 1 },
  "Armor Padding (Medium)": { die: "1d6", repairCost: 30, originalSlots: 1 },
  "Armor Padding (Heavy)": { die: "1d8", repairCost: 75, originalSlots: 2 }
};

function cleanPaddingName(item) { return item.name.replace(" (Broken)", ""); }
function getPaddingData(item) { return PADDING[cleanPaddingName(item)]; }
function isBroken(item) { return item.system?.broken === true; }
function getGold(actor) { return actor.system?.coins?.gp ?? 0; }
async function setGold(actor, value) { return actor.update({ "system.coins.gp": value }); }

function createUsePaddingButton(actor, item, paddingData, controls) {
  const button = document.createElement("a");
  button.classList.add("item-control", "armor-padding-button");
  button.title = `Use ${item.name}`;
  button.innerHTML = `<i class="fa-solid fa-shield-check"></i>`;

  button.addEventListener("click", async event => {
    event.preventDefault();
    event.stopPropagation();

    const roll = await new Roll(paddingData.die).evaluate();
    const result = roll.total;
    const dieSize = Number(paddingData.die.replace("1d", ""));

    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor }),
      flavor: `${result} damage prevented.`
    });

    if (result !== dieSize) return;

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor }),
      content: `<strong>${item.name}</strong>: Padding broken!`
    });

    await item.update({
      "name": `${cleanPaddingName(item)} (Broken)`,
      "system.broken": true,
      "system.equipped": false,
      "system.slots.slots_used": 0
    });
  });

  controls.prepend(button);
}

function createRepairButton(actor, item, paddingData, controls) {
  const button = document.createElement("a");
  button.classList.add("item-control", "armor-padding-repair-button");
  button.title = `Repair ${cleanPaddingName(item)} for ${paddingData.repairCost} GP`;
  button.innerHTML = `<i class="fa-solid fa-hammer"></i>`;

  button.addEventListener("click", async event => {
    event.preventDefault();
    event.stopPropagation();

    const itemName = cleanPaddingName(item);
    const cost = paddingData.repairCost;
    const currentGold = getGold(actor);

    if (currentGold < cost) {
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        content: "Insufficient funds for repair."
      });
      return;
    }

    const confirmed = await Dialog.confirm({
      title: "Repair Armor Padding",
      content: `<p>Spend ${cost} GP to repair <strong>${itemName}</strong>?</p>`,
      yes: () => true,
      no: () => false,
      defaultYes: false
    });

    if (!confirmed) return;

    await setGold(actor, currentGold - cost);

    await item.update({
      "name": itemName,
      "system.broken": false,
      "system.equipped": false,
      "system.slots.slots_used": paddingData.originalSlots
    });

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor }),
      content: `<strong>${itemName}</strong> repaired for ${cost} GP.`
    });
  });

  controls.prepend(button);
}

export function registerArmorPadding() {
  Hooks.on("renderActorSheet", (app, html) => {
    if (game.system.id !== SHADOWDARK_SYSTEM_ID) return;

    const actor = app.actor;
    const root = unwrapHtml(html);
    if (!actor || !root) return;

    setTimeout(() => {
      for (const item of actor.items) {
        const paddingData = getPaddingData(item);
        if (!paddingData || item.type !== "Armor") continue;

        const row = findItemRow(root, item);
        if (!row) continue;

        if (isBroken(item)) row.classList.add("armor-padding-broken-row");

        const controls = findControls(row);
        if (!controls) continue;

        if (row.querySelector(".armor-padding-button") || row.querySelector(".armor-padding-repair-button")) continue;

        if (isBroken(item)) createRepairButton(actor, item, paddingData, controls);
        else if (item.system?.equipped) createUsePaddingButton(actor, item, paddingData, controls);
      }
    }, 100);
  });
}
