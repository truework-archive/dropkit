import React from "react";
import { useSelect } from "use-drop";

import { items as defaultItems } from '../items';
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
    items: defaultItems,
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
