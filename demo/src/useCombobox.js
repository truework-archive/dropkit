import React from "react";
import { useDrop } from "./useDrop.js";

export function useCombobox({
  items,
  multiple = false,
  onSelect,
  onRemove,
  ...options
}) {
  const [selected, selectedSet] = React.useState(
    items.filter((i) => i.selected)
  );

  const {
    isOpen,
    setIsOpen,
    items: results,
    getControlProps,
    ...rest
  } = useDrop({
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
    },
  });

  function getInputProps({ onBlur, ...props }) {
    const controlProps = getControlProps();

    return {
      ...controlProps,
      ...props,
      onKeyUp(e) {
        if (e.keyCode === 27) {
          e.target.blur();
          return;
        }
        if (e.keyCode === 13) return;
        if (e.target.value && Boolean(results.length) && !isOpen) {
          setIsOpen(true);
        }
      },
      onBlur(e) {
        controlProps.onBlur(); // delegate to drop handler
        if (onBlur) onBlur(e);
      },
      onClick() {}, // override
    };
  }

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
    getInputProps,
    clear() {
      selectedSet([]);
    },
  };
}
