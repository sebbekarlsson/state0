import { TStateEvent, FThen } from "./types";
export declare class Dispatcher<T> {
    listeners: {
        [x: string]: FThen[];
    };
    ons: {
        [x: string]: FThen[];
    };
    prevState: {
        [x: string]: Partial<T>;
    };
    nextState: {
        [x: string]: Partial<T>;
    };
    state: {
        [x: string]: any;
    };
    onStateChange: (state: {
        [x: string]: any;
    }) => any;
    constructor(onStateChange?: (state: {
        [x: string]: any;
    }) => any);
    when(stateEvent: TStateEvent, then: FThen): FThen;
    on(stateEvent: TStateEvent, then: FThen): FThen;
    emit(stateEvent: TStateEvent, payload: Partial<T>): any;
    finishEmit(nextState: {
        [x: string]: any;
    }): any;
    search(path: string): any;
    setInitialState(path: string, state: any): void;
}
