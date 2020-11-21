export type TStateEvent = string;
export type FWhen = <T>(stateEvent: TStateEvent) => Promise<T>;
export type FThen = (prevState: any, state: any) => any;
export type FEmit = (stateEvent: TStateEvent, state: any) => any;

export interface IDispatcher {
  [x: string]: {
    state: any;
    when: FWhen;
  };
}
