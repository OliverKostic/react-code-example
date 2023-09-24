export enum InputType {
  Adults,
  Children,
  Infants,
}

export enum InputAction {
  Increment,
  Decrement,
}

export interface Warning {
  target: InputType;
  messageKey: string;
}
