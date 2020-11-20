import { TStateEvent, FThen } from "./types";

const getPathElements = (stateEvent: string): string[] => {
  return stateEvent.split("/");
};

const applyValue = (breadCrumbs: any[]): { [x: string]: any } => {
  return {
    [breadCrumbs.pop()]:
      breadCrumbs.length == 1 ? breadCrumbs[0] : applyValue(breadCrumbs),
  };
};

export class Dispatcher<T> {
  listeners: { [x: string]: FThen[] };
  prevState: { [x: string]: Partial<T> };
  nextState: { [x: string]: Partial<T> };
  state: { [x: string]: any };
  onStateChange: (state: { [x: string]: any }) => any;

  constructor(
    onStateChange: (state: { [x: string]: any }) => any = (state: any) => state
  ) {
    this.listeners = {};
    this.prevState = {};
    this.nextState = {};
    this.state = {};
    this.onStateChange = onStateChange;
  }

  when(stateEvent: TStateEvent, then: FThen) {
    this.listeners[stateEvent] = [...(this.listeners[stateEvent] || []), then];
  }

  emit(stateEvent: TStateEvent, payload: Partial<T>) {
    const pathElements = getPathElements(stateEvent);
    const rootElements = pathElements;

    this.nextState = this.listeners[stateEvent].reduce(
      (prev, then) => ({
        ...prev,
        [stateEvent]: then(
          (stateEvent in this.prevState && this.prevState[stateEvent]) ||
            undefined,
          payload
        ),
      }),
      {}
    );

    this.prevState[stateEvent] = payload;

    return this.finishEmit({
      ...this.state,
      ...applyValue(
        [
          ...rootElements.slice(0, rootElements.length - 1),
          this.prevState[stateEvent],
        ].reverse()
      ),
    });
  }

  finishEmit(nextState: { [x: string]: any }) {
    return this.onStateChange((this.state = nextState));
  }
}
