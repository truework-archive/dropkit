# dropkit ![npm](https://img.shields.io/npm/v/dropkit) [![](https://badgen.net/bundlephobia/minzip/dropkit)](https://bundlephobia.com/result?p=dropkit)

A minimalist approach to custom dropdowns, autocompletes, and more.

### Features

- bring your own markup
- no magic
- full a11y support
- supports multi-select
- controlled, integrate with any form library

### Install

```
npm i dropkit --save
```

# Usage

```javascript
import React from "react";
import cx from "classnames";

import { useSelect } from "dropkit";

function Dropdown() {
  const [label, labelSet] = React.useState("Please select");

  const {
    id,
    items,
    isOpen,
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
      labelSet(item.label); // set to active item
    },
    onRemove() {
      labelSet("Please select"); // reset to placeholder
    },
  });

  return (
    <>
      <label htmlFor={id}>Cities</label>
      <button id={id} {...getControlProps()}>{label}</button>

      {isOpen && (
        <ul {...getDropProps()}>
          {items.map(i => (
            <li
              key={i.value}
              className={cx({
                'is-selected': i.selected,
                'is-highlighted': i.highlighted,
              })}
              {...i.getItemProps()}
            >
              {i.label}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
```

### Credits
Many thanks to [@wmira](https://github.com/wmira) for providing the `dropkit`
npm package name. If you're looking for the Digital Ocean V2 REST API library,
try [`v0.9.4` and below](https://www.npmjs.com/package/dropkit/v/0.9.4).

### License

MIT License © [Eric Bailey](https://estrattonbailey.com)
