import { makeQueue, queueDispatch } from "../src/queue";
import { IQueue } from "../src/types";
import { describe, it } from "mocha";
import { expect } from "chai";

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

describe("dispatcher", function () {
  it("works", function () {
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
    expect(queue.state.amount).equals(4);
  });
});
