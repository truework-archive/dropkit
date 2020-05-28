import * as React from "react";

function scrollTo(parent: HTMLElement, child: HTMLElement) {
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
}

// scrollParent must be positioned
export function useScroll(scrollParent: HTMLElement, activeElement: HTMLElement) {
  if (typeof HTMLElement.prototype.scroll !== "function") return; // unsupported

  React.useEffect(() => {
    if (!scrollParent || !activeElement) return;
    scrollTo(scrollParent, activeElement);
  }, [scrollParent, activeElement]);
}
