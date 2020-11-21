# state0 documentation

> Note, the `IAppProps` type / interface used in these examples are only  
> for demonstrational purposes.  
> You should use your own type definitions for these generics.

## Queue

> To create the queue, use `makeQueue<T>(reducers: IReducer[], initialState:T, actions: IAction[], subscriber: ISubscriber[])`  
> Note that the `actions` should usually be passed as empty `[]`, it is only for rare occations  
> when you want to initialize the queue with some initial actions (very rarely).

```typescript
import { queue } from "state0";

// instead of "any", you can use your own type / interface.
// For example, maybe your dispatcher takes care of multiple states,
// you can use (IUserState | INotesState | ISettingsState) instead of "any".
export const queue = makeQueue<any>([clickReducer], initialState, [], []);
```

## Emit / Dispatch

> Events can be dispatched using `queueDispatch(queue: IQueue<T>, IAction<T>)`

```typescript
queueDispatch(queue, { type: ACTION_CLICK_INCREASE, payload: { amount: 1 } });
```

## Subscribe

> To subscribe on an event, use `queueSubscribe(queue: IQueue<T>, ISubscriber<T>[])`

```typescript
export const clickSubscriber = {
  type: CLICK_ACTION,
  trigger: (data: IClickState) => {
    console.log(`Just received some data ${data}`);
  },
};

queueSubscribe(queue, [clickSubscriber]);
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

export const queue = makeQueue<any>([clickReducer], initialState, [], []);
```

### Final Notes

> Since its probably most likely you are going to use this with React,  
> Here is how to do that:  
> [State0 with React](REACT.md)
