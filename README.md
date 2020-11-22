<p align="center" style='text-align: center; width: 100%;'>
  <img src="./state0.png" />

</p>  
  
<p align="center" style='text-align: center; width: 100%;'>
  The ignorant queue-based state management library
</p>

## Example

> Minimal example for how to use `state0`

```typescript
import {
  IQueue,
  IStateRecord,
  makeQueue,
  queueDispatch,
  queueStart,
} from "state0";

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

// read-only subscriber.
// a good place to trigger toast notifications etc.
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
```

## Using it with React

> [Click here](REACT.md)

## Documentation

> [How to use it](DOCS.md)

## Installation

> To install run

```bash
yarn install state0

# or

npm install state0
```

> Then you are ready to use it:

```typescript
import { makeQueue } from "state0";
```
