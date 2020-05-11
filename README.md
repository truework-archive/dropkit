# use-drop ![npm](https://img.shields.io/npm/v/use-drop) [![](https://badgen.net/bundlephobia/minzip/use-drop)](https://bundlephobia.com/result?p=use-drop)

A minimalist approach to custom dropdowns.

### Features

- bring your own markup
- full a11y support
- supports multi-select
- controlled, integrate with any form library

### Install

```
npm i use-drop --save
```

# Usage

```javascript
import { useDrop } from "use-drop";

function Dropdown() {
  const [value, setValue] = React.useState();

  const { label, items, isOpen, controlProps, dropProps } = useDropdown({
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

  return (
    <>
      <button {...controlProps}>{label}</button>

      {isOpen && (
        <ul {...dropProps}>
          {items.map(({
            value,
            label,
            selected,
            highlighted,
            itemProps,
          }) => (
            <li key={label} {...itemProps}>{label}</li>
          ))}
        </ul>
      )}
    </>
  );
}
```

### License

MIT License © [Eric Bailey](https://estrattonbailey.com)
