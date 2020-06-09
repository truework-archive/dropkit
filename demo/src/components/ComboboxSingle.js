import React from "react";
import { Box } from "@truework/ui";
import { BaseInput } from "@truework/forms";
import { useCombobox } from "use-drop";

import { items as defaultItems } from '../items';
import * as Drop from "./Dropdown";

export function ComboboxSingle() {
  const [_items, setResults] = React.useState(defaultItems);
  const [search, searchSet] = React.useState("");

  const {
    isOpen,
    isOpenSet,
    items,
    getInputProps,
    getDropProps,
  } = useCombobox({
    items: _items,
    onSelect({ label }) {
      searchSet(label);
    },
  });

  React.useEffect(() => {
    setResults(
      defaultItems.filter((item) => {
        return item.label.toLowerCase().indexOf(search.toLowerCase()) > -1;
      })
    );
  }, [search]);

  return (
    <Box>
      <BaseInput
        type="text"
        value={search}
        placeholder="Search for a city"
        aria-label="Cities"
        {...getInputProps({
          onChange(e) {
            searchSet(e.target.value);
          },
        })}
      />

      {isOpen && Boolean(items.length) && (
        <Drop.Outer dropProps={getDropProps()}>
          {items.map((i) => (
            <Drop.Item
              key={i.label}
              value={i.value}
              label={i.label}
              highlighted={i.highlighted}
              itemProps={i.getItemProps()}
            />
          ))}
        </Drop.Outer>
      )}
    </Box>
  );
}

