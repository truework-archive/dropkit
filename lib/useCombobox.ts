import * as React from "react";
import { useDrop } from './useDrop';

import {
  ItemConfig,
  OnSelect,
  OnRemove,
  UseCombobox,
  Noop,
} from "./types";

export function useCombobox({
  items,
  multiple = false,
  onSelect,
  onRemove,
  ...options
}: {
  items: ItemConfig[];
  multiple?: boolean;
  onSelect?: OnSelect;
  onRemove?: OnRemove;
  onOpen?: Noop;
  onDismiss?: Noop;
}): UseCombobox {
  const [selected, selectedSet] = React.useState(
    items.filter((i) => i.selected)
  );

  const {
    isOpen,
    isOpenSet,
    items: results,
    getControlProps,
    getDropProps,
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

      if (!multiple) isOpenSet(false);
    },
  });

  function getInputProps({ onBlur, ...props }: React.HTMLProps<HTMLInputElement>) {
    const controlProps = getControlProps();

    delete controlProps.onClick;

    return {
      ...controlProps,
      ...props,
      role: "combobox",
      onKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
        const input = e.target as HTMLInputElement;

        if (e.keyCode === 27) {
          input.blur();
          return;
        }
        if (e.keyCode === 13) return;
        if (Boolean(input.value) && !isOpen) {
          isOpenSet(true);
        }
      },
      onBlur(e: React.FocusEvent<HTMLInputElement>) {
        if (controlProps.onBlur) controlProps.onBlur(e); // delegate to drop handler
        if (onBlur) onBlur(e);
      },
    };
  }

  return {
    ...rest,
    isOpen,
    isOpenSet,
    items: results.map((result) => {
      return {
        ...result,
        selected: Boolean(selected.filter((i) => i.value === result.value)[0]),
      };
    }),
    getInputProps,
    getDropProps,
    clear() {
      selectedSet([]);
    },
  };
}
