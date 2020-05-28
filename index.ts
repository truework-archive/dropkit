export * from './lib/types';
export { useDrop } from './lib/useDrop';
export { useSelect } from './lib/useSelect';
export { useCombobox } from './lib/useCombobox';

export const useNative =
  typeof navigator !== "undefined"
    ? /iPad|iPhone|Android/i.test(navigator.userAgent)
    : true;
