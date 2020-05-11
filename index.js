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
  if (typeof HTMLElement.prototype.scroll !== 'function') return; // unsupported

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
  const isMouseDown = React.useRef(false); // avoid re-render
  const filter = React.useRef(''); // avoid re-render
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightedValue, setHighlightedValue] = React.useState(values[0]);
  const [options, setOptions] = React.useState([]);

  // option attributes
  const valueAttr = `data-${id}-option-value`;
  const labelAttr = `data-${id}-option-label`;

  // wrapper around onUpdate
  const _onUpdate = React.useCallback(
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
  const _items = React.useMemo(
    () =>
      items.map(item => {
        function createItem(i, { isGroupDisabled } = {}) {
          if (values.indexOf(i.value) > -1) labels.push(i.label);

          const disabled = i.disabled || isGroupDisabled;

          return {
            ...i,
            selected: values.indexOf(i.value) > -1,
            highlighted: highlightedValue === i.value,
            itemProps: disabled ? {} : {
              [valueAttr]: i.value,
              [labelAttr]: i.label,
              onClick() {
                _onUpdate(i.value);
                setHighlightedValue(i.value);
                if (!multiple) setIsOpen(false);
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
    [items, values, highlightedValue]
  );

  const _label = multiple
    ? labels.length
      ? labels
      : [placeholder]
    : labels[0] || placeholder;

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

  // all key events
  React.useEffect(() => {
    function keydown(e) {
      const { key, keyCode } = e;
      const control = controlRef.current;

      if (!control) return;

      const up = keyCode === 38;
      const down = keyCode === 40;
      const enter = keyCode === 13;
      const space = keyCode === 32;
      const esc = keyCode === 27;

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
        } else if (enter && isOpen) {
          if (!multiple) setIsOpen(false);
          _onUpdate(highlighted.getAttribute(valueAttr));
        } else if (esc) {
          setIsOpen(false);
        } else if (
          (keyCode >= 65 && keyCode <= 90) || // alpha
          (keyCode >= 48 && keyCode <= 57) // numeric
        ) {
          const next = filter.current + key;
          const highlighted = options.filter(
            n =>
              n
                .getAttribute(labelAttr)
                .toLowerCase()
                .indexOf(next) > -1
          )[0];

          // save for next render cycle
          filter.current = next;

          if (highlighted) {
            setHighlightedValue(highlighted.getAttribute(valueAttr));
          } else {
            setHighlightedValue(value);
          }
        } else {
          // clear if any other key is pressed
          filter.current = '';
        }
      }
    }

    document.addEventListener("keydown", keydown);

    return () => {
      document.removeEventListener("keydown", keydown);
    };
  }, [isOpen, controlRef, _onUpdate]);

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

  return {
    id,
    isOpen,
    label: _label,
    items: _items,
    controlProps: {
      ref: controlRef,
      id,
      role: "combobox",
      "aria-label": multiple ? _label.join(", ") + ", " : _label,
      "aria-controls": `drop-${id}`,
      "aria-haspopup": "listbox",
      "aria-expanded": isOpen,
      onBlur() {
        if (isMouseDown.current) return;
        setIsOpen(false);
      },
      onClick(e) {
        // avoid triggering by Enter TODO test this
        if (e.clientX + e.clientY > 0) {
          setIsOpen(!isOpen);
        }
      }
    },
    dropProps: {
      ref: dropdownRef,
      id: `drop-${id}`,
      role: "listbox"
    },
    __meta: {
      filter: filter.current,
      options,
      highlightedValue,
      highlightedNode: highlighted
    }
  };
}
