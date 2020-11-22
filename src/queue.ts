import { IReducer, IAction, ISubscriber, IQueue, IStateRecord } from "./types";
import { safeGet, uniqueByKey } from "./utils";
import { STATE0_QUEUE_SUBSCRIBE_ACTION_TYPE } from "./constants";

export const makeQueue = <T>(
  state: IStateRecord<T>,
  reducers: IReducer<T>[],
  subscribers: ISubscriber<T>[] = []
): IQueue<T> => ({
  state: [state],
  reducers,
  subscribers,
  actions: [],
});

export const queueGetReducersForAction = <T>(
  queue: IQueue<T>,
  action: IAction<T>
): IReducer<T>[] =>
  queue.reducers.filter((reducer) => reducer.type === action.type);

export const queueGetSubscribersForAction = <T>(
  queue: IQueue<T>,
  action: IAction<T>
): ISubscriber<T>[] =>
  queue.subscribers.filter((reducer) => reducer.type === action.type);

export const queueNext = <T>(queue: IQueue<T>) => {
  const actions = [...queue.actions];
  const action = actions.pop();
  queue.actions = actions;
  return queueHandleAction(queue, action);
};

export const queueGetState = <T>(queue: IQueue<T>): IStateRecord<T> =>
  queue.state.length ? queue.state[queue.state.length - 1] : {};

export const queueGetStateRoot = <T>(
  queue: IQueue<T>,
  root: string
): Partial<T> => safeGet<T, {}>(queueGetState(queue), root, {});

export const queueHandleAction = <T>(queue: IQueue<T>, action: IAction<T>) => {
  if (!action) return;

  if (action.type == STATE0_QUEUE_SUBSCRIBE_ACTION_TYPE && action.subscriber) {
    queue.subscribers = uniqueByKey(
      [...queue.subscribers, action.subscriber],
      "id"
    );

    return;
  }

  const prevState = queueGetState(queue);

  const nextState = queueGetReducersForAction(queue, action).reduce(
    (prev, reducer) => ({
      ...prev,
      [reducer.root]: {
        ...reducer.trigger(
          queueGetStateRoot(queue, reducer.root),
          action.payload
        ),
      },
    }),
    prevState
  );

  queueGetSubscribersForAction(queue, action).forEach((subscriber) =>
    subscriber.trigger(safeGet(nextState, subscriber.root, {}))
  );

  queue.state.push(nextState);
};

export const queueDispatch = <T>(queue: IQueue<T>, action: IAction<T>) => {
  const newActions = (queue.actions = [...queue.actions, action]);
  queueNext(queue);
  return newActions;
};

export const queueSubscribe = <T>(
  queue: IQueue<T>,
  subscriber: ISubscriber<T>
): IAction<T>[] =>
  queueDispatch(queue, {
    type: STATE0_QUEUE_SUBSCRIBE_ACTION_TYPE,
    subscriber: subscriber,
    payload: null,
  });
