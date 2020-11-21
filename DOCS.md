# state0 documentation

> Note, the `IAppProps` type / interface used in these examples are only  
> for demonstrational purposes.  
> You should use your own type definitions for these generics.

## Dispatcher

```typescript
import { Dispatcher } from "state0";

// instead of "any", you can use your own type / interface.
// For example, maybe your dispatcher takes care of multiple states,
// you can use (IUserState | INotesState | ISettingsState) instead of "any".
export const dispatcher = new Dispatcher<any>();
```

## Initial state

```typescript
dispatcher.setInitialState("path/to/state", { someValue: 42 });
// the code above will be reduced inside the dispatcher (dispatcher.state)
// to the following:

/*
 * {
 *   path: {
 *     to: {
 *       state: {
 *         someValue: 42
 *       }
 *     }
 *   }
 * }
 */
```

> This `setInitialState` method also produces a side-effect,  
> It will emit the following event:

```json
["/path/to/state/init", { "someValue": 42 }]
```

> And then it is up to _you_ to catch this event.  
> This can be done like this:

```typescript
// catching the initial state event and returning it.
// returning it inside a "when" - action will update the state.
const initialStateAction = (prevState: IAppProps, nextState: IAppProps) => {
  dispatcher.emit("path/to/state", nextState);
  return nextState;
};

dispatcher.when("/path/to/state/init", initialStateAction);
```

## Emit

> Events can be dispatched using `dispatcher.emit(path: string, payload: T)`

```typescript
dispatcher.emit("/path/to/state", { someValue: 16 });
```

## When

> The `when(path: string, (prevState: T, nextState:T) => any)` method is used to listen  
> for an event, and also to return the next state.  
> As mentioned before, whatever you return from this `when` method, will be reduced  
> into the state.

```typescript
// catching an event and returning a new modified state.
const initialStateAction = (prevState: IAppProps, nextState: IAppProps) => {
  return { ...nextState, someValue: 13 };
};

dispatcher.when("/path/to/state", initialStateAction);
```

## On

> The `on(path: string, (prevState: T, nextState:T) => any)` should be used when  
> you are only interested in reading data from a dispatched action/event,  
> returning anything here will _not_ update the state.

```typescript
// catching an event (read-only)
const initialStateAction = (prevState: IAppProps, nextState: IAppProps) => {
  console.log(nextState);
};

dispatcher.when("/path/to/state", initialStateAction);
```

### Final Notes

> Since its probably most likely you are going to use this with React,  
> Here is how to do that:  
> [State0 with React](REACT.md)
