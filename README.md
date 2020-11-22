<p align="center" style='text-align: center; width: 100%;'>
  <img src="./state0.png" />

</p>  
  
<p align="center" style='text-align: center; width: 100%;'>
  The ignorant state management library
</p>

## Example

> Minimal example for how to use `state0`  

```typescript
import { IQueue, makeQueue, queueDispatch } from "state0";

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

simulateClick(queue); // { amount: 1 }
simulateClick(queue); // { amount: 2 }
simulateClick(queue); // { amount: 3 }
simulateClick(queue); // { amount: 4 }
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
import { Dispatcher } from "state0";
```
