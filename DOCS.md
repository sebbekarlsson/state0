# state0 documentation

## Queue

> To create the queue, use:

```typescript
makeQueue<T>(
  state: IStateRecord<T>,
  reducers: IReducer<T>[],
  subscribers: ISubscriber<T>[] = []
)
```

> Example:

```typescript
import { queue } from "state0";

// instead of "IClickState", you can use your own type / interface.
// For example, maybe your dispatcher takes care of multiple states,
// you can use (IUserState | INotesState | ISettingsState) instead of "IClickState".
const queue = makeQueue<IClickState>(
  initialState,
  [clickReducer],
  [clickSubscriber]
);
```

## Emit / Dispatch

> Events can be dispatched using `queueDispatch(queue: IQueue<T>, IAction<T>)`

```typescript
queueDispatch(queue, { type: ACTION_CLICK_INCREASE, payload: { amount: 1 } });
```

## Subscribe

> To subscribe on an event, use `queueSubscribe(queue: IQueue<T>, ISubscriber<T>)`

```typescript
export const clickSubscriber = {
  type: CLICK_ACTION,
  id: "mySubscriberId",
  trigger: (data: IClickState) => {
    console.log(`Just received some data ${data}`);
  },
};

queueSubscribe(queue, clickSubscriber);
```

## Reducing

> Reducers are added when calling `makeQueue` (as mentioned at the top of this page).  
> You can pass a reducer to it like this:

```typescript
export const clickReducer = {
  type: CLICK_ACTION,
  trigger: (prevState: IClickState, nextState: IClickState): IClickState => {
    return { amount: prevState.amount + nextState.amount };
  },
};

const queue = makeQueue<IClickState>(
  initialState,
  [clickReducer],
  [clickSubscriber]
);
```

### Final Notes

> Since its probably most likely you are going to use this with React,  
> Here is how to do that:  
> [State0 with React](REACT.md)
