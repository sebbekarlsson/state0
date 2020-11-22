import { makeQueue, queueDispatch, queueStart } from "../src/queue";
import { IQueue, IStateRecord } from "../src/types";

const CLICK_ACTION = "CLICK_ACTION";
const CLICK_ROOT = "click";

export interface IClickState {
  amount: number;
}

// Our initial state
export const initialState: IStateRecord<IClickState> = {
  [CLICK_ROOT]: {
    amount: 0,
  },
};

// read-only subscriber
export const clickSubscriber = {
  type: CLICK_ACTION,
  root: CLICK_ROOT,
  id: "onClick",
  trigger: (data: IClickState) => {
    console.log(`Just received some data ${data}`);
  },
};

// read / write reducer
export const clickReducer = {
  type: CLICK_ACTION,
  root: CLICK_ROOT,
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
  initialState,
  [clickReducer],
  [clickSubscriber]
);

// start our queue
queueStart(queue);

// simulate some clicks
simulateClick(queue);
simulateClick(queue);
simulateClick(queue);
simulateClick(queue);
