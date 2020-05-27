import React from "react";

import { useSelect } from "../useSelect.js";
import * as Drop from './Dropdown';

export function Multi() {
  const [labels, labelsSet] = React.useState([]);

  const {
    items,
    isOpen,
    getControlProps,
    getDropProps,
  } = useSelect({
    multiple: true,
    items: [
      { value: "san-francisco", label: "San Francisco" },
      { value: "los-angeles", label: "Los Angeles" },
      { value: "san-diego", label: "San Diego" },
      { value: "new-york", label: "New York" },
      { value: "albany", label: "Albany" },
      { value: "rochester", label: "Rochester" }
    ],
    onSelect(item) {
      labelsSet(labels.concat(item.label));
    },
    onRemove(item) {
      labelsSet(labels.filter(l => l !== item.label));
    }
  });

  return (
    <>
      <Drop.Control cta={labels.length ? labels.join(', ') : 'Please select'} controlProps={getControlProps()} />

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
