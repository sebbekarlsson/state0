import { IReducer, IAction, ISubscriber, IQueue } from "types";
import { uniqueByKey } from "./utils";

export const makeQueue = <T>(
  reducers: IReducer<T>[],
  state?: T,
  actions: IAction<T>[] = [],
  subscribers: ISubscriber<T>[] = []
): IQueue<T> => ({
  actions,
  reducers,
  subscribers,
  state: state || {},
});

export const queueStepNext = <T>(queue: IQueue<T>): IQueue<T> => {
  const newActions = [...queue.actions];
  const action = newActions.pop();

  const nextReducersState = action
    ? queue.reducers
        .filter((reducer) => reducer.type === action.type)
        .reduce(
          (prev, red) => ({
            ...prev,
            ...red.trigger(queue.state, action.payload),
          }),
          {}
        )
    : {};

  const nextState = {
    actions: newActions,
    reducers: queue.reducers,
    subscribers: queue.subscribers,
    state: {
      ...queue.state,
      ...nextReducersState,
    },
  };

  action &&
    queue.subscribers
      .filter((subscriber) => subscriber.type === action.type)
      .forEach((subscriber) => subscriber.trigger(nextReducersState));

  if (queue.ref) {
    queue.ref.state = nextState.state;
    queue.ref.actions = nextState.actions;
    queue.ref.subscribers = nextState.subscribers;
    queue.ref.reducers = nextState.reducers;
  }

  return nextState;
};

export const queueDispatch = <T>(
  queue: IQueue<T>,
  action: IAction<T>
): IQueue<T> => ({
  ...queueStepNext<T>({
    ...queue,
    ...{ ref: queue, actions: [...queue.actions, action] },
  }),
});

export const queueSubscribe = <T>(
  queue: IQueue<T>,
  subscribers: ISubscriber<T>[]
): IQueue<T> => {
  const nextState = {
    ...queue,
    subscribers: uniqueByKey([...queue.subscribers, ...subscribers], "type"),
  };

  queue.state = nextState.state;
  queue.actions = nextState.actions;
  queue.subscribers = nextState.subscribers;
  queue.reducers = nextState.reducers;

  return nextState;
};
