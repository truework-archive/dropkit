import React from "react";
import { useSelect } from "use-drop";

import { items as defaultItems } from '../items';
import * as Drop from './Dropdown';

export function Single() {
  const [label, labelSet] = React.useState('Please select');

  const {
    items,
    isOpen,
    getControlProps,
    getDropProps,
  } = useSelect({
    items: defaultItems,
    onSelect(item) {
      labelSet(item.label);
    },
    onRemove() {
      labelSet('Please select');
    }
  });

  return (
    <>
      <Drop.Control cta={label} controlProps={getControlProps()} />

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
