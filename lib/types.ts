import * as React from "react";

export type HTMLPropGetter = (
  props?: Partial<React.HTMLAttributes<HTMLElement>>
) => Partial<React.HTMLAttributes<HTMLElement>>;

export type HTMLPropGetterWithRef = (
  props?: Partial<React.HTMLAttributes<HTMLElement>>
) => Partial<React.HTMLAttributes<HTMLElement>> & {
  ref: React.RefObject<HTMLElement>;
};

export type OnSelect = (item: ItemConfig) => void;
export type OnRemove = OnSelect;
export type Noop = () => void;

export type ItemConfig = {
  value: string;
  label: string;
  [key: string]: any;
};

export type Item = ItemConfig & {
  selected: boolean;
  highlighted: boolean;
  getItemProps: HTMLPropGetter;
};

export type UseDrop = {
  id: string;
  isOpen: boolean;
  isOpenSet(open: boolean): void; // todo
  items: Item[];
  highlightedIndex: number;
  highlightedIndexSet(index: number): void;
  getControlProps: HTMLPropGetterWithRef;
  getDropProps: HTMLPropGetterWithRef;
};

export type UseSelect = {
  id: string;
  isOpen: boolean;
  isOpenSet(open: boolean): void; // todo
  items: Item[];
  getControlProps: HTMLPropGetterWithRef;
  getDropProps: HTMLPropGetterWithRef;
  clear(): void;
};

export type UseCombobox = {
  id: string;
  isOpen: boolean;
  isOpenSet(open: boolean): void; // todo
  items: Item[];
  getInputProps: HTMLPropGetterWithRef;
  getDropProps: HTMLPropGetterWithRef;
  clear(): void;
};
