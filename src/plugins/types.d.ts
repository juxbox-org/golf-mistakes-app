export interface TouchEvent {
  cancelable: boolean;
  preventDefault: () => void;
  stopPropagation: () => void;
}
