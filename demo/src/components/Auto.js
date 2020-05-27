import React from "react";
import { Box } from "@truework/ui";
import { BaseInput, BaseLabel } from "@truework/forms";

import { useCombobox } from "../useCombobox.js";

import * as Drop from "./Dropdown";

const defaultItems = [
  { value: "san-francisco", label: "San Francisco" },
  { value: "los-angeles", label: "Los Angeles" },
  { value: "san-diego", label: "San Diego" },
  { value: "new-york", label: "New York" },
  { value: "albany", label: "Albany" },
  { value: "rochester", label: "Rochester" },
];

export function Single() {
  const [results, setResults] = React.useState(defaultItems);
  const [query, querySet] = React.useState("");

  const {
    id,
    isOpen,
    setIsOpen,
    items,
    getInputProps,
    getDropProps,
  } = useCombobox({
    items: results,
    onSelect({ label }) {
      querySet(label);
      setIsOpen(false);
    },
  });

  React.useEffect(() => {
    setResults(
      defaultItems.filter((item) => {
        return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
      })
    );
  }, [query]);

  return (
    <Box>
      <BaseLabel htmlFor={id}>Search</BaseLabel>
      <BaseInput
        type="text"
        value={query}
        placeholder="Search for a city"
        {...getInputProps({
          onChange(e) {
            querySet(e.target.value);
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

export function Multi() {
  const [results, setResults] = React.useState(defaultItems);
  const [query, querySet] = React.useState("");

  const {
    id,
    isOpen,
    setIsOpen,
    items,
    getInputProps,
    getDropProps,
  } = useCombobox({
    multiple: true,
    items: results,
    onDismiss() {
      querySet('');
    },
  });

  React.useEffect(() => {
    setResults(
      defaultItems.filter((item) => {
        return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
      })
    );
  }, [query]);

  return (
    <Box>
      <BaseLabel htmlFor={id}>Search</BaseLabel>
      <BaseInput
        type="text"
        value={query}
        placeholder="Search for a city"
        {...getInputProps({
          onFocus() {
            if (items.length) setIsOpen(true);
          },
          onChange(e) {
            querySet(e.target.value);
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
              selected={i.selected}
              highlighted={i.highlighted}
              itemProps={i.getItemProps()}
            />
          ))}
        </Drop.Outer>
      )}
    </Box>
  );
}
