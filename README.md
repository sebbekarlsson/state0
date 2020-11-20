# state0
> The ignorant state management library

## Example
> Minimal example for how to use `state0`
```typescript
import { Dispatcher } from "@state0";

const SOME_RANDOM_USER_ID = "abc123";

export interface IUser {
  username: string;
  email: string;
  password: string;
}

const dispatcher = new Dispatcher((state) => {
  // Store the state wherever you want, state0 couldn't care less.
  // The state always exists in dispatcher.state however.
  console.log(state); // // { user: { abc123: { email: 'john.doe@doecompanyforever.com' } } }
});

// define some action types
const updateUserAction = (userId: string) => `user/${userId}/update`;

// listen for updates
// this one actually returns a modified state.
dispatcher.when(
  updateUserAction(SOME_RANDOM_USER_ID),
  (prevState: IUser, nextState: IUser) => {
    return { ...prevState, ...nextState };
  }
);

// this one just logs the new state,
// to be used in a react component for eample.
dispatcher.when(
  updateUserAction(SOME_RANDOM_USER_ID),
  (prevState: IUser, nextState: IUser) => {
    console.log(nextState); // { email: 'john.doe@doecompanyforever.com' }
  }
);

// emit an event
dispatcher.emit(updateUserAction(SOME_RANDOM_USER_ID), {
  email: "john.doe@doecompanyforever.com",
});
```
## Installation
> To install run
```bash
yarn install state0

# or

npm install state0
```
> Then you are ready to use it:
```typescript
import { Dispatcher } from "@state0";
```