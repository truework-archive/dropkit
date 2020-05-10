import React from "react";

let id = 10; // start at a

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
  multiple,
  placeholder = "",
  value = "",
  items,
  onUpdate
}) {
  const labels = [];
  const values = [].concat(value).filter(Boolean);

  const hash = React.useMemo(() => (id++).toString(36), []);
  const controlRef = React.useRef(null);
  const dropdownRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightedValue, setHighlightedValue] = React.useState(values[0]);
  const [filter, setFilter] = React.useState("");
  const [options, setOptions] = React.useState([]);

  const valueAttr = `data-${hash}-option-value`;
  const labelAttr = `data-${hash}-option-label`;

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
    [items, value, highlightedValue]
  );

  React.useLayoutEffect(() => {
    setOptions([].slice.call(document.querySelectorAll(`[${valueAttr}]`)));
  }, [isOpen]);

  const selected = React.useMemo(() => {
    return options.filter(
      n => n.getAttribute(valueAttr) === highlightedValue
    )[0];
  }, [options, highlightedValue]);

  React.useEffect(() => {
    function keydown(e) {
      e.preventDefault();

      const { key, keyCode } = e;
      const control = controlRef.current;

      if (!control) return;

      const up = key === "ArrowUp";
      const down = key === "ArrowDown";
      const enter = key === "Enter";
      const space = key === " ";
      const esc = key === "Escape";

      if (document.activeElement === control && !isOpen && (up || down)) {
        setIsOpen(true);
      }

      if (isOpen) {
        const options = [].slice.call(document.querySelectorAll(`[${valueAttr}]`));

        if (up || down) {
          const lastIndex = options.length - 1;
          const currIndex = options.indexOf(selected);
          const nextIndex = up ? currIndex - 1 : currIndex + 1;
          const nextOption =
            options[
              nextIndex > lastIndex ? 0 : nextIndex < 0 ? lastIndex : nextIndex
            ];

          setHighlightedValue(nextOption.getAttribute(valueAttr));
          labels.push(nextOption.getAttribute(labelAttr));
        } else if (enter && isOpen) {
          if (!multiple) setIsOpen(false);
          emitValues(selected.getAttribute(valueAttr));
        }

        if (
          (keyCode >= 65 && keyCode <= 90) || // alpha
          (keyCode >= 48 && keyCode <= 57) // numeric
        ) {
          setFilter(filter + key);
        } else {
          setFilter("");
        }
      }

      if (esc) {
        setIsOpen(false);
        setHighlightedValue(values[0]);
      }

      if (space) {
        setIsOpen(!isOpen);
        setHighlightedValue(values[0]);
      }
    }

    document.addEventListener("keydown", keydown);

    return () => {
      document.removeEventListener("keydown", keydown);
    };
  }, [isOpen, options, controlRef, emitValues]);

  React.useEffect(() => {
    const highlighted = options.filter(
      n => n.getAttribute(labelAttr).indexOf(filter) > -1
    )[0];

    if (highlighted) {
      setHighlightedValue(highlighted.getAttribute(valueAttr));
    } else {
      setHighlightedValue(value);
      setFilter("");
    }
  }, [filter, options]);

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
    useNative,
    isOpen,
    value: multiple ? values : value,
    label: computedLabel,
    items: itemsEnhanced,
    highlightedValue,
    selected,
    controlProps: {
      ref: controlRef,
      id: hash,
      role: "combobox",
      "aria-label": multiple ? computedLabel.join(", ") + ", " : "",
      "aria-controls": `${hash}-dropdown`,
      "aria-haspopup": "listbox",
      "aria-expanded": isOpen,
      onClick(e) {
        // avoid triggering by Enter TODO test this
        if (e.clientX + e.clientY > 0) {
          setIsOpen(!isOpen);
        }
      }
    },
    dropdownProps: {
      ref: dropdownRef,
      id: `${hash}-dropdown`,
      role: "listbox"
    }
  };
}
