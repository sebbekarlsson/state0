import { IReducer, IAction, ISubscriber, IQueue } from "types";
export declare const makeQueue: <T>(reducers: IReducer<T>[], state?: T, actions?: IAction<T>[], subscribers?: ISubscriber<T>[]) => IQueue<T>;
export declare const queueStepNext: <T>(queue: IQueue<T>) => IQueue<T>;
export declare const queueDispatch: <T>(queue: IQueue<T>, action: IAction<T>) => IQueue<T>;
export declare const queueSubscribe: <T>(queue: IQueue<T>, subscribers: ISubscriber<T>[]) => IQueue<T>;
