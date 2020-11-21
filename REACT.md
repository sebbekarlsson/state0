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

  const state = queue.state;
  const raw = useMemo(() => state && prettyFormat(queue), [state]);

  return (
    <div className="wrapper">
      <section>
        <button onClick={handleClick}>Press Me</button>
      </section>
      <section>
        <p>You have pressed me {amount} times.</p>
      </section>
      {raw && (
        <section>
          <i
            style={{ marginTop: "1rem", display: "block", fontSize: "0.8rem" }}
          >
            What it looks like inside
          </i>
          <pre className="textarea">{raw}</pre>
        </section>
      )}
    </div>
  );
};

export const App = withState0(queue, AppComponent, ACTION_CLICK_INCREASE);
```

> Obviously there is more to it than what meets the eyes here.  
> First of all, this `withState0` is a function which is not included in this library.  
> However, here is a snippet that you can just copy-paste into your project:

```typescript
import React, { FC, useState } from "react";
import { queueSubscribe, IQueue } from "state0";
import { IAppProps, IToastState } from "../types"; // you have to change these

export const withState0 = (
  queue: IQueue<IAppProps | IToastState>,
  Component: FC<any>,
  path: string
) => {
  const ComponentWrapper: FC<any> = (): JSX.Element => {
    const [props, setProps] = useState({});
    const subscriber = (data: any) => {
      setProps({ ...props, ...data });
    };
    queueSubscribe(queue, [{ type: path, trigger: subscriber }]);
    Component.defaultProps = props;
    return <Component props={props} />;
  };

  return ComponentWrapper;
};
```

> For a full example of using `state0` with React,  
> [Click here](https://github.com/sebbekarlsson/state0-react-example)
