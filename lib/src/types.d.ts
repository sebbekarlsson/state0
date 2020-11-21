export declare type TStateEvent = string;
export declare type FWhen = <T>(stateEvent: TStateEvent) => Promise<T>;
export declare type FThen = (prevState: any, state: any) => any;
export declare type FEmit = (stateEvent: TStateEvent, state: any) => any;
export interface IDispatcher {
  [x: string]: {
    state: any;
    when: FWhen;
  };
}
