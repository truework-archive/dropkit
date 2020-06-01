import * as React from "react";

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
  getItemProps(props?: React.HTMLProps<HTMLElement>): any;
};

export type UseDrop = {
  id: string;
  isOpen: boolean;
  isOpenSet(open: boolean): void; // todo
  items: Item[];
  highlightedIndex: number;
  highlightedIndexSet(index: number): void;
  getControlProps(props?: React.HTMLProps<HTMLElement>): any;
  getDropProps(props?: React.HTMLProps<HTMLElement>): any;
};

export type UseSelect = {
  id: string;
  isOpen: boolean;
  isOpenSet(open: boolean): void; // todo
  items: Item[];
  getControlProps(props?: React.HTMLProps<HTMLElement>): any;
  getDropProps(props?: React.HTMLProps<HTMLElement>): any;
  clear(): void;
};

export type UseCombobox = {
  id: string;
  isOpen: boolean;
  isOpenSet(open: boolean): void; // todo
  items: Item[];
  getInputProps(props?: React.HTMLProps<HTMLInputElement>): any;
  getDropProps(props?: React.HTMLProps<HTMLElement>): any;
  clear(): void;
};
