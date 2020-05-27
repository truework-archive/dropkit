import React from "react";
import { useDrop } from "./useDrop.js";

export function useSelect({
  items,
  multiple = false,
  onSelect,
  onRemove,
  ...options
}) {
  const filter = React.useRef(""); // avoid re-render
  const [selected, selectedSet] = React.useState(
    items.filter((i) => i.selected)
  );

  const { isOpen, setIsOpen, items: results, highlightedIndexSet, ...rest } = useDrop({
    ...options,
    items,
    onSelect(item) {
      const isSelected = Boolean(
        selected.filter((i) => i.value === item.value)[0]
      );

      if (isSelected) {
        selectedSet(
          multiple ? selected.filter((i) => i.value !== item.value) : []
        );
        if (onRemove) onRemove(item);
      } else {
        selectedSet(multiple ? selected.concat(item) : [item]);
        if (onSelect) onSelect(item);
      }

      if (!multiple) setIsOpen(false);
    },
  });

  React.useEffect(() => {
    function keydown({ key, keyCode }) {
      if (
        (keyCode >= 65 && keyCode <= 90) || // alpha
        (keyCode >= 48 && keyCode <= 57) // numeric
      ) {
        filter.current = filter.current + key;

        for (let i = 0; i < items.length; i++) {
          if (items[i].label.toLowerCase().indexOf(filter.current) > -1) {
            highlightedIndexSet(i);
            break;
          }
        }
      } else {
        filter.current = "";
      }
    }

    if (isOpen) document.addEventListener("keydown", keydown);

    return () => {
      document.removeEventListener("keydown", keydown);
    };
  }, [isOpen, items, filter]);

  return {
    ...rest,
    isOpen,
    setIsOpen,
    items: results.map((result) => {
      return {
        ...result,
        selected: Boolean(selected.filter((i) => i.value === result.value)[0]),
      };
    }),
    clear() {
      selectedSet([]);
    },
  };
}
