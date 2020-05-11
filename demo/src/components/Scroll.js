import React from "react";
import { useDrop, useScroll } from "use-drop";

import * as Drop from './Dropdown';

export function Scroll() {
  const [value, setValue] = React.useState();

  const {
    label,
    items,
    isOpen,
    controlProps,
    dropProps,
    __meta,
  } = useDrop({
    value,
    placeholder: "Please select",
    multiple: true,
    items: [
      { value: "san-francisco", label: "San Francisco" },
      { value: "los-angeles", label: "Los Angeles" },
      { value: "san-diego", label: "San Diego" },
      { value: "new-york", label: "New York" },
      { value: "albany", label: "Albany" },
      { value: "rochester", label: "Rochester" }
    ],
    onUpdate(value) {
      setValue(value);
    }
  });

  useScroll(dropProps.ref.current, __meta.highlightedNode);

  return (
    <>
      <Drop.Control cta={label} controlProps={controlProps} />

      {isOpen && (
        <Drop.Outer height="160px" dropProps={dropProps}>
          {items.map(i => (
            <Drop.Item key={i.label} {...i} />
          ))}
        </Drop.Outer>
      )}
    </>
  );
}