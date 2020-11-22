import { IStateRecord } from "../src/types";
export interface IClickState {
    amount: number;
}
export declare const initialState: IStateRecord<IClickState>;
export declare const clickSubscriber: {
    type: string;
    root: string;
    id: string;
    trigger: (data: IClickState) => void;
};
export declare const clickReducer: {
    type: string;
    root: string;
    trigger: (prevState: IClickState, nextState: IClickState) => IClickState;
};
