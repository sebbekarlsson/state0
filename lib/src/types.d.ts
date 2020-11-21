export interface IAction<T> {
    type: string;
    payload: T;
}
export interface IReducer<T> {
    type: string;
    trigger: (prevState: Partial<T>, payload: T) => T;
}
export interface ISubscriber<T> {
    type: string;
    trigger: (data: Partial<T>) => void;
}
export interface IQueue<T> {
    subscribers: ISubscriber<T>[];
    reducers: IReducer<T>[];
    actions: IAction<T>[];
    state: Partial<T>;
    ref?: IQueue<T>;
}
