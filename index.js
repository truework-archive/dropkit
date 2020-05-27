import React from "react";

let instance = 10; // start at a

export const useNative =
  typeof navigator !== "undefined"
    ? /iPad|iPhone|Android/i.test(navigator.userAgent)
    : true;

function scrollTo(parent, child) {
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
export function useScroll(scrollParent, activeElement) {
  if (typeof HTMLElement.prototype.scroll !== "function") return; // unsupported

  React.useEffect(() => {
    if (!scrollParent || !activeElement) return;
    scrollTo(scrollParent, activeElement);
  }, [scrollParent, activeElement]);
}

export function useDrop({ items, onSelect, onOpen, onDismiss }) {
  const id = React.useMemo(() => (instance++).toString(36), []);

  // refs
  const controlRef = React.useRef(null);
  const dropdownRef = React.useRef(null);

  // state
  const isMouseDown = React.useRef(false); // avoid re-render
  const [isOpen, isOpenSet] = React.useState(false);
  const [highlightedIndex, highlightedIndexSet] = React.useState(0);
  const safeHighlightedIndex = Math.min(highlightedIndex, items.length - 1);
  const _isOpenSet = React.useCallback(
    (open) => {
      isOpenSet(open);
      if (open && onOpen) onOpen();
      if (!open && onDismiss) onDismiss();
    },
    [isOpenSet]
  );
  const _highlightedIndexSet = React.useCallback(
    (index) => {
      highlightedIndexSet(Math.min(index, safeHighlightedIndex));
    },
    [safeHighlightedIndex]
  );
  // merge internal state/methods with items array
  const _items = React.useMemo(
    () =>
      items.map((item, o) => {
        return {
          ...item,
          highlighted: safeHighlightedIndex === o,
          getItemProps(props = {}) {
            return {
              ...props,
              onClick(e) {
                if (item.disabled) return;

                if (onSelect) onSelect(item);
                if (props.onClick) props.onClick(e);

                highlightedIndexSet(o < items.length ? o : 0);
              },
            };
          },
        };
      }),
    [items, onSelect, safeHighlightedIndex, highlightedIndexSet]
  );

  // all key events
  React.useEffect(() => {
    function keydown(e) {
      const { keyCode } = e;
      const control = controlRef.current;

      if (!control) return;

      const up = keyCode === 38;
      const down = keyCode === 40;
      const enter = keyCode === 13;
      const space = keyCode === 32;
      const esc = keyCode === 27;

      if (document.activeElement === control) {
        if (!isOpen && (up || down)) _isOpenSet(true);
        if (space) _isOpenSet(!isOpen);
      }

      if (up || down) {
        e.preventDefault();
      }

      if (isOpen) {
        const lastIndex = items.length - 1;
        const nextIndex = up ? highlightedIndex - 1 : highlightedIndex + 1;

        if (up || down) {
          highlightedIndexSet(
            nextIndex > lastIndex ? 0 : nextIndex < 0 ? lastIndex : nextIndex
          );
        } else if (enter && isOpen) {
          if (onSelect) onSelect(items[safeHighlightedIndex]);
        } else if (esc) {
          _isOpenSet(false);
        }
      }
    }

    document.addEventListener("keydown", keydown);

    return () => {
      document.removeEventListener("keydown", keydown);
    };
  }, [highlightedIndex, items, isOpen, controlRef, onSelect]);

  // outside click
  React.useEffect(() => {
    function click(e) {
      const dropdown = dropdownRef.current;
      const control = controlRef.current;

      if (
        !dropdown ||
        !control ||
        e.target === dropdown ||
        e.target === control ||
        dropdown.contains(e.target) ||
        control.contains(e.target)
      )
        return;

      _isOpenSet(false);
    }

    if (isOpen) {
      document.addEventListener("click", click);
    }

    return () => {
      document.removeEventListener("click", click);
    };
  }, [isOpen, dropdownRef]);

  // used to determine if drop should close on blur
  React.useEffect(() => {
    function mousedown() {
      isMouseDown.current = true;
    }
    function mouseup() {
      isMouseDown.current = false;
    }

    document.addEventListener("mousedown", mousedown);
    document.addEventListener("mouseup", mouseup);

    return () => {
      document.removeEventListener("mousedown", mousedown);
      document.removeEventListener("mouseup", mouseup);
    };
  }, []);

  return {
    id,
    isOpen,
    setIsOpen: _isOpenSet,
    items: _items,
    highlightedIndexSet: _highlightedIndexSet,
    getControlProps() {
      return {
        ref: controlRef,
        id,
        role: "listbox",
        "aria-controls": `drop-${id}`,
        "aria-haspopup": "listbox",
        "aria-expanded": isOpen,
        onBlur() {
          if (isMouseDown.current) return;
          _isOpenSet(false);
        },
        onClick(e) {
          // avoid triggering by Enter TODO test this
          if (e.clientX + e.clientY > 0) {
            _isOpenSet(!isOpen);
          }
        },
      };
    },
    getDropProps() {
      return {
        ref: dropdownRef,
        id: `drop-${id}`,
        role: "listbox",
      };
    },
  };
}

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
