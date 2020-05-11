import React from "react";

let instance = 10; // start at a

const useNative =
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

export function useScroll(scrollParent, activeElement) {
  React.useEffect(() => {
    if (!scrollParent || !activeElement) return;
    scrollTo(scrollParent, activeElement);
  }, [scrollParent, activeElement]);
}

export function useDrop({
  value = "",
  items,
  multiple,
  placeholder = "",
  onUpdate
}) {
  const id = React.useMemo(() => (instance++).toString(36), []);

  // computed values
  const labels = [];
  const values = [].concat(value).filter(Boolean);

  // refs
  const controlRef = React.useRef(null);
  const dropdownRef = React.useRef(null);

  // state
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightedValue, setHighlightedValue] = React.useState(values[0]);
  const [filter, setFilter] = React.useState("");
  const [options, setOptions] = React.useState([]);

  // option attributes
  const valueAttr = `data-${id}-option-value`;
  const labelAttr = `data-${id}-option-label`;

  // wrapper around onUpdate
  const emitValues = React.useCallback(
    val => {
      if (onUpdate) {
        onUpdate(
          multiple
            ? values.indexOf(val) > -1
              ? values.filter(v => v !== val)
              : values.concat(val)
            : val
        );
      }
    },
    [values, multiple, onUpdate]
  );

  // merge internal state/methods with items array
  const itemsEnhanced = React.useMemo(
    () =>
      items.map(item => {
        function createItem(i, { isGroupDisabled } = {}) {
          if (values.indexOf(i.value) > -1) labels.push(i.label);

          return {
            ...i,
            selected: values.indexOf(i.value) > -1,
            highlighted: highlightedValue === i.value,
            itemProps: {
              [valueAttr]: i.value,
              [labelAttr]: i.label,
              onClick() {
                if (!i.disabled && !isGroupDisabled) {
                  labels.push(i.label);
                  emitValues(i.value);
                  setHighlightedValue(i.value);
                  if (!multiple) setIsOpen(false);
                }
              }
            }
          };
        }

        if (item.items) {
          return {
            ...item,
            items: item.items.map(i =>
              createItem(i, { isGroupDisabled: item.disabled })
            )
          };
        } else {
          return createItem(item);
        }
      }),
    [items, highlightedValue]
  );

  // compute selected option based on highlightedValue
  const highlighted = React.useMemo(() => {
    return options.filter(
      n => n.getAttribute(valueAttr) === highlightedValue
    )[0];
  }, [options, highlightedValue]);

  // only search for options when open
  React.useLayoutEffect(() => {
    const nodes = [].slice.call(document.querySelectorAll(`[${valueAttr}]`));
    if (nodes.length) setOptions(nodes);
  }, [isOpen]);

  // all key events
  React.useEffect(() => {
    function keydown(e) {
      const { key, keyCode } = e;
      const control = controlRef.current;

      if (!control) return;

      const up = key === "ArrowUp";
      const down = key === "ArrowDown";
      const enter = key === "Enter";
      const space = key === " ";
      const esc = key === "Escape";

      if (document.activeElement === control) {
        if (!isOpen && (up || down)) setIsOpen(true);
        if (space) setIsOpen(!isOpen);
      }

      if (isOpen) {
        if (up || down) {
          e.preventDefault();

          const lastIndex = options.length - 1;
          const currIndex = options.indexOf(highlighted);
          const nextIndex = up ? currIndex - 1 : currIndex + 1;
          const nextOption =
            options[
              nextIndex > lastIndex ? 0 : nextIndex < 0 ? lastIndex : nextIndex
            ];

          setHighlightedValue(nextOption.getAttribute(valueAttr));
          labels.push(nextOption.getAttribute(labelAttr));
        } else if (enter && isOpen) {
          if (!multiple) setIsOpen(false);
          emitValues(highlighted.getAttribute(valueAttr));
        } else if (esc) {
          setIsOpen(false);
        } else if (
          (keyCode >= 65 && keyCode <= 90) || // alpha
          (keyCode >= 48 && keyCode <= 57) // numeric
        ) {
          const next = filter + key;
          const highlighted = options.filter(
            n => n.getAttribute(labelAttr).toLowerCase().indexOf(next) > -1
          )[0];

          setFilter(next);

          if (highlighted) {
            setHighlightedValue(highlighted.getAttribute(valueAttr));
          } else {
            setHighlightedValue(value);
          }
        } else {
          setFilter("");
        }
      }
    }

    document.addEventListener("keydown", keydown);

    return () => {
      document.removeEventListener("keydown", keydown);
    };
  }, [isOpen, controlRef, emitValues]);

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

      setIsOpen(false);
    }

    if (isOpen) {
      document.addEventListener("click", click);
    }

    return () => {
      document.removeEventListener("click", click);
    };
  }, [isOpen, dropdownRef]);

  const computedLabel = multiple
    ? labels.length
      ? labels
      : [placeholder]
    : labels[0] || placeholder;

  return {
    id,
    useNative,
    isOpen,
    label: computedLabel,
    items: itemsEnhanced,
    controlProps: {
      ref: controlRef,
      id,
      role: "combobox",
      "aria-label": multiple ? computedLabel.join(", ") + ", " : computedLabel,
      "aria-controls": `drop-${id}`,
      "aria-haspopup": "listbox",
      "aria-expanded": isOpen,
      onBlur(e) {
        setIsOpen(false); // TODO
      },
      onClick(e) {
        // avoid triggering by Enter TODO test this
        if (e.clientX + e.clientY > 0) {
          setIsOpen(!isOpen);
        }
      }
    },
    dropdownProps: {
      ref: dropdownRef,
      id: `drop-${id}`,
      role: "listbox"
    },
    __meta: {
      highlightedValue,
      highlightedNode: highlighted,
    },
  };
}
