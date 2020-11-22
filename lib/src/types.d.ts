export interface IAction<T> {
    type: string;
    payload: T;
    subscriber?: ISubscriber<T>;
}
export interface IReducer<T> {
    type: string;
    root: string;
    trigger: (prevState: Partial<T>, payload: T) => T;
}
export interface ISubscriber<T> {
    type: string;
    root: string;
    id: string;
    trigger: (data: Partial<T>) => void;
}
export interface IStateRecord<T> {
    [x: string]: Partial<T>;
}
export interface IQueue<T> {
    state: IStateRecord<T>[];
    subscribers: ISubscriber<T>[];
    reducers: IReducer<T>[];
    actions: IAction<T>[];
}
