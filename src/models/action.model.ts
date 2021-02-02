export interface Action {
  match: boolean;
  execute: () => string;
}
