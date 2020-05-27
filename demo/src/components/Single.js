import React from "react";

import { useSelect } from "../useSelect.js";
import * as Drop from './Dropdown';

export function Single() {
  const [cta, ctaSet] = React.useState('Please select');

  const {
    items,
    isOpen,
    setIsOpen,
    getControlProps,
    getDropProps,
  } = useSelect({
    items: [
      { value: "san-francisco", label: "San Francisco" },
      { value: "los-angeles", label: "Los Angeles" },
      { value: "san-diego", label: "San Diego" },
      { value: "new-york", label: "New York" },
      { value: "albany", label: "Albany" },
      { value: "rochester", label: "Rochester" }
    ],
    onSelect(item) {
      ctaSet(item.label);
    },
    onRemove() {
      ctaSet('Please select');
    }
  });

  return (
    <>
      <Drop.Control cta={cta} controlProps={getControlProps()} />

      {isOpen && (
        <Drop.Outer dropProps={getDropProps()}>
          {items.map(i => (
            <Drop.Item
              key={i.value}
              value={i.value}
              label={i.label}
              selected={i.selected}
              highlighted={i.highlighted}
              itemProps={i.getItemProps()}
            />
          ))}
        </Drop.Outer>
      )}
    </>
  );
}
