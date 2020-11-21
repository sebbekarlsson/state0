import { makeQueue, queueDispatch } from "../src/queue";
import { IQueue } from "../src/types";

const CLICK_ACTION = "CLICK_ACTION";

export interface IClickState {
  amount: number;
}

export const initialState: IClickState = {
  amount: 0,
};

export const clickSubscriber = {
  type: CLICK_ACTION,
  trigger: (data: IClickState) => {
    console.log(`Just received some data ${data}`);
  },
};

export const clickReducer = {
  type: CLICK_ACTION,
  trigger: (prevState: IClickState, nextState: IClickState): IClickState => {
    return { amount: prevState.amount + nextState.amount };
  },
};

const simulateClick = (queue: IQueue<IClickState>) =>
  queueDispatch<IClickState>(queue, {
    type: CLICK_ACTION,
    payload: { amount: 1 },
  });

const queue = makeQueue<IClickState>(
  [clickReducer],
  initialState,
  [],
  [clickSubscriber]
);

simulateClick(queue);
simulateClick(queue);
simulateClick(queue);
simulateClick(queue);
