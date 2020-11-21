export interface IClickState {
    amount: number;
}
export declare const initialState: IClickState;
export declare const clickSubscriber: {
    type: string;
    trigger: (data: IClickState) => void;
};
export declare const clickReducer: {
    type: string;
    trigger: (prevState: IClickState, nextState: IClickState) => IClickState;
};
