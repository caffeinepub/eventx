import { strings, type StringKey } from './strings.pt-BR';

export function useStrings() {
  return strings;
}

export function getString(key: StringKey): string {
  return strings[key];
}
