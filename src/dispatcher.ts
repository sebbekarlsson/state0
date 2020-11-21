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

const resolveObjectPath = (path: string, obj: any, separator = "/") => {
  var properties = Array.isArray(path) ? path : path.split(separator);
  return properties.reduce((prev, curr) => prev && prev[curr], obj);
};

export class Dispatcher<T> {
  listeners: { [x: string]: FThen[] };
  ons: { [x: string]: FThen[] };
  prevState: { [x: string]: Partial<T> };
  nextState: { [x: string]: Partial<T> };
  state: { [x: string]: any };
  onStateChange: (state: { [x: string]: any }) => any;

  constructor(
    onStateChange: (state: { [x: string]: any }) => any = (state: any) => state
  ) {
    this.listeners = {};
    this.ons = {};
    this.prevState = {};
    this.nextState = {};
    this.state = {};
    this.onStateChange = onStateChange;
  }

  when(stateEvent: TStateEvent, then: FThen) {
    this.listeners[stateEvent] = [
      ...(stateEvent in this.listeners ? this.listeners[stateEvent] || [] : []),
      then,
    ].filter((listener) => !!listener);
    return then;
  }

  on(stateEvent: TStateEvent, then: FThen) {
    this.ons[stateEvent] = [
      ...(stateEvent in this.ons ? this.ons[stateEvent] || [] : []),
      then,
    ].filter((listener) => !!listener);
    return then;
  }

  emit(stateEvent: TStateEvent, payload: Partial<T>) {
    const pathElements = getPathElements(stateEvent);

    this.nextState =
      stateEvent in this.listeners
        ? (this.listeners[stateEvent] || []).reduce(
            (prev, then) => ({
              ...prev,
              [stateEvent]:
                then(
                  (stateEvent in this.prevState &&
                    this.prevState[stateEvent]) ||
                    this.search(`${stateEvent}/init`) ||
                    prev[stateEvent],
                  payload
                ) ||
                prev[stateEvent],
            }),
            this.prevState
          )
        : this.prevState; 

    const emitResult = this.finishEmit({
      ...this.state,
      ...applyValue(
        [
          ...pathElements.slice(
            0,
            pathElements.length -
              (pathElements[pathElements.length - 1] === "init" ? 2 : 1)
          ),
          this.nextState[stateEvent] || {},
        ].reverse()
      ),
    });

    // broadcast to all readers
    stateEvent in this.ons
        ? (this.ons[stateEvent] || []).reduce(
        (prev, then) => ({
          ...prev,
          [stateEvent]:
            then(
              (stateEvent in this.prevState &&
                this.prevState[stateEvent]) ||
                this.search(`${stateEvent}/init`) ||
                prev[stateEvent],
              this.search(`${stateEvent}`)
            ) ||
            prev[stateEvent],
        }),
        this.prevState
      )
    : this.prevState;

    return emitResult;
  }

  finishEmit(nextState: { [x: string]: any }) {
    this.prevState = this.nextState;
    return this.onStateChange((this.state = nextState));
  }

  search(path: string) {
    const parts = path.split("/");
    return resolveObjectPath(
      parts.slice(0, parts.length - 1).join("/"),
      this.state,
      "/"
    );
  }

  setInitialState(path: string, state: any) {
    this.prevState[path] = state;
    this.emit(`${path}/init`, state);
  }
}
