import { IReducer, IAction, ISubscriber, IQueue, IStateRecord } from "./types";
export declare const makeQueue: <T>(state: IStateRecord<T>, reducers: IReducer<T>[], subscribers?: ISubscriber<T>[]) => IQueue<T>;
export declare const queueStart: <T>(queue: IQueue<T>, debug?: boolean, timeOut?: number) => Promise<IQueue<T>>;
export declare const queueGetReducersForAction: <T>(queue: IQueue<T>, action: IAction<T>) => IReducer<T>[];
export declare const queueGetSubscribersForAction: <T>(queue: IQueue<T>, action: IAction<T>) => ISubscriber<T>[];
export declare const queueInitLocalStorage: <T>(queue: IQueue<T>, encoder?: {
    (value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;
    (value: any, replacer?: (string | number)[], space?: string | number): string;
}, actions?: IAction<T>[]) => void;
export declare const queuePushActionToStorage: <T>(queue: IQueue<T>, action: IAction<T>, encoder?: {
    (value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;
    (value: any, replacer?: (string | number)[], space?: string | number): string;
}, decoder?: (text: string, reviver?: (this: any, key: string, value: any) => any) => any) => void;
export declare const queuePoll: <T>(queue: IQueue<T>) => void;
export declare const queueGetState: <T>(queue: IQueue<T>) => IStateRecord<T>;
export declare const queueGetStateRoot: <T>(queue: IQueue<T>, root: string) => Partial<T>;
export declare const queueHandleAction: <T>(queue: IQueue<T>, action: IAction<T>) => void;
export declare const queueDispatch: <T>(queue: IQueue<T>, action: IAction<T>) => IAction<T>[];
export declare const queueSubscribe: <T>(queue: IQueue<T>, subscriber: ISubscriber<T>) => IAction<T>[];
