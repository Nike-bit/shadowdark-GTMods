export function unwrapHtml(html) {
  if (html instanceof HTMLElement) return html;
  if (html?.[0] instanceof HTMLElement) return html[0];
  return html ?? null;
}

export function findItemRow(root, item) {
  if (!root || !item) return null;

  const directRow =
    root.querySelector(`[data-item-id="${item.id}"]`) ||
    root.querySelector(`[data-document-id="${item.id}"]`) ||
    root.querySelector(`[data-id="${item.id}"]`) ||
    root.querySelector(`[data-uuid="${item.uuid}"]`);

  if (directRow) return directRow;

  const nameElements = [...root.querySelectorAll("*")]
    .filter(el => el.textContent?.trim() === item.name);

  for (const nameElement of nameElements) {
    const row =
      nameElement.closest("[data-item-id]") ||
      nameElement.closest("[data-document-id]") ||
      nameElement.closest("li") ||
      nameElement.closest("tr") ||
      nameElement.closest(".row") ||
      nameElement.parentElement;

    if (row) return row;
  }

  return null;
}

export function findControls(row) {
  if (!row) return null;

  return (
    row.querySelector(".actions") ||
    row.querySelector(".item-controls") ||
    row.querySelector(".controls") ||
    row.querySelector("[data-action]")?.parentElement ||
    row
  );
}

export function getInventoryRoot(root) {
  return root?.querySelector(".inventory-grid") ?? null;
}
