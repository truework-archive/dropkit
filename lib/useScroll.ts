import * as React from "react";

import { Item } from "./types";

// parent must be positioned
export function useScroll(id: string, highlightedItem: Item) {
  if (typeof HTMLElement.prototype.scroll !== "function") return; // unsupported

  React.useLayoutEffect(() => {
    const parent = document.getElementById(`${id}-drop`);
    const child = document.getElementById(highlightedItem.id);

    if (!parent || !child) return;

    const { top: pt, bottom: pb } = parent.getBoundingClientRect();
    const { scrollTop: pst } = parent;
    const { top: ct, bottom: cb } = child.getBoundingClientRect();
    const ch = cb - ct;

    const above = cb <= pt;
    const below = ct + ch > pb;

    if (!above && !below) return;

    const offset = above ? pt - ct : cb - pb;
    const distance = offset * (above ? -1 : 1);

    parent.scroll(0, pst + distance);
  }, [id, highlightedItem]);
}
