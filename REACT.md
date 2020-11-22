# state0 with React

> Here's what this could look like when using in practice:

```typescript
import React, { FC, useMemo } from "react";
import "./App.css";
import { IAppProps } from "./types";
import { withState0 } from "./store/with";
import prettyFormat from "pretty-format";
import { queue } from "./store";
import { ACTION_CLICK_INCREASE } from "./store/actionTypes";
import { queueDispatch } from "state0";

const AppComponent: FC<IAppProps> = ({ amount }): JSX.Element => {
  const handleClick = () => {
    queueDispatch(queue, {
      type: ACTION_CLICK_INCREASE,
      payload: { amount: 1 },
    });
  };

  return (
    <div className="wrapper">
      <section>
        <button onClick={handleClick}>Press Me</button>
      </section>
      <section>
        <p>You have pressed me {amount} times.</p>
      </section>
    </div>
  );
};

export const App = withState0(AppComponent, [
  {
    root: REDUCER_CLICK_ROOT,
    type: ACTION_CLICK_INCREASE,
    id: "clickComponent",
  },
]);
```

> Obviously there is more to it than what meets the eyes here.  
> First of all, this `withState0` is a function which is not included in this library.  
> However, here is a snippet that you can just copy-paste into your project:

```typescript
import React, { FC, useState } from "react";
import { queueSubscribe, ISubscriber, queueGetStateRoot } from "state0";
import { queue } from "."; // import queue singleton created by makeQueue

export const withState0 = (
  Component: FC<any>,
  subscribers: Partial<ISubscriber<any>>[]
) => {
  const ComponentWrapperX: FC<any> = (): JSX.Element => {
    const [props, setProps] = useState({
      ...subscribers
        .reduce((prev, subscriber) => [...prev, subscriber.root], [])
        .reduce(
          (prev, root) => ({
            ...prev,
            ...queueGetStateRoot(queue, root),
          }),
          {}
        ),
    });
    const roots: string[] = subscribers.reduce((prev, subscriber) => {
      queueSubscribe(queue, {
        type: subscriber.type,
        id: subscriber.id,
        trigger: (data) => {
          setProps(data);
          Component.defaultProps = data;
        },
        root: subscriber.root,
      });
      return [...prev, subscriber.root];
    }, []);

    Component.defaultProps = {
      ...(Component.defaultProps || {}),
      ...roots.reduce(
        (prev, root) => ({
          ...prev,
          ...queueGetStateRoot(queue, root),
        }),
        {}
      ),
    };
    Component.defaultProps = props;
    return <Component props={props} />;
  };
  return ComponentWrapperX;
};
```

> For a full example of using `state0` with React,  
> [Click here](https://github.com/sebbekarlsson/state0-react-example)
