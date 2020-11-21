# state0 with React
> Here's what this could look like when using in practive:
```typescript
import React, { FC, useState, useCallback } from "react";
import { dispatcher } from "./store";
import "./App.css";
import { IAppProps } from "./types";
import { CONTAINER_CLICKER_AMOUNT } from "./store/containers";
import { withState0 } from "./store/with";

const AppComponent: FC<IAppProps> = ({ amount }): JSX.Element => {
  const handleClick = useCallback(() => {
    dispatcher.emit(CONTAINER_CLICKER_AMOUNT, { amount: 1 });
  }, [dispatcher]);
  return (
    <div>
      <section>
        <button onClick={handleClick}>Press Me</button>
      </section>
      <section>
        <p>You have pressed me {amount} times.</p>
      </section>
    </div>
  );
};

export const App = withState0(
  dispatcher,
  AppComponent,
  CONTAINER_CLICKER_AMOUNT
);
```
> Obviously there is more to it than what meets the eyes here.  
> First of all, this `withState0` is a function which is not included in this library.  
> However, here is a snippet that you can just copy-paste into your project:
```typescript
import React, { FC, useState } from 'react';
import { Dispatcher } from "state0";
import { IAppProps } from "../types"; // you have to change this

export const withState0 = (
  dispatcher: Dispatcher<IAppProps>,
  Component: FC<any>,
  path: string
) => {
  const ComponentWrapper: FC<any> = (): JSX.Element => {
    const [props, setProps] = useState({});
    dispatcher.on(path, (_, nextState: any) => {
      setProps(nextState);
    });
    Component.defaultProps = props;
    return <Component props={props} />;
  };

  return ComponentWrapper;
};
```
> For a full example of using `state0` with React,  
> [Click here](https://github.com/sebbekarlsson/state0-react-example)
