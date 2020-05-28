import * as React from "react";

export type HTMLPropGetter = (
  props?: Partial<React.HTMLProps<HTMLElement>>
) => Partial<React.HTMLProps<HTMLElement>>;

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
  highlightedIndexSet(index: number): void;
  getControlProps: HTMLPropGetter;
  getDropProps: HTMLPropGetter;
};

export type UseSelect = {
  id: string;
  isOpen: boolean;
  isOpenSet(open: boolean): void; // todo
  items: Item[];
  getControlProps: HTMLPropGetter;
  getDropProps: HTMLPropGetter;
  clear(): void;
};

export type UseCombobox = {
  id: string;
  isOpen: boolean;
  isOpenSet(open: boolean): void; // todo
  items: Item[];
  getInputProps: HTMLPropGetter;
  getDropProps: HTMLPropGetter;
  clear(): void;
};
