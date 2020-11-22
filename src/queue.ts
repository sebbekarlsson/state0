import { IReducer, IAction, ISubscriber, IQueue, IStateRecord } from "./types";
import { safeGet, uniqueByKey } from "./utils";
import {
  STATE0_DEBUG_LOCALSTORAGE_ACTIONS,
  STATE0_QUEUE_SUBSCRIBE_ACTION_TYPE,
} from "./constants";

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

export const queueStart = <T>(
  queue: IQueue<T>,
  debug: boolean = false,
  timeOut: number = 6
): Promise<IQueue<T>> => {
  queueInitLocalStorage(queue);

  if (debug && window) {
    // @ts-ignore
    window.state0 = queue;
  }

  return new Promise((resolve, reject) => {
    if (setInterval) {
      setInterval(() => queuePoll<T>(queue), timeOut);
    } else {
      reject(new Error("Cannot create event loop"));
    }
  });
};

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

export const queueInitLocalStorage = <T>(
  queue: IQueue<T>,
  encoder = JSON.stringify,
  actions: IAction<T>[] = []
): void => {
  if (window) {
    if (!window.localStorage.getItem(STATE0_DEBUG_LOCALSTORAGE_ACTIONS)) {
      window.localStorage.setItem(
        STATE0_DEBUG_LOCALSTORAGE_ACTIONS,
        encoder(actions)
      );
    }
  }
};

export const queuePushActionToStorage = <T>(
  queue: IQueue<T>,
  action: IAction<T>,
  encoder = JSON.stringify,
  decoder = JSON.parse
): void => {
  if (window) {
    queueInitLocalStorage(queue, encoder, [
      ...(decoder(
        window.localStorage.getItem(STATE0_DEBUG_LOCALSTORAGE_ACTIONS)
      ) as IAction<T>[]),
      action,
    ]);
  }
};

export const queuePoll = <T>(queue: IQueue<T>) => {
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

  queuePushActionToStorage(queue, action);

  if (action.type == STATE0_QUEUE_SUBSCRIBE_ACTION_TYPE && action.subscriber) {
    queue.subscribers = uniqueByKey(
      [...queue.subscribers, action.subscriber],
      "id"
    ).map((subscriber) => {
      // send existing data to subscribers.
      subscriber.trigger(queueGetStateRoot(queue, subscriber.root));
      return subscriber;
    });

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

export const queueDispatch = <T>(queue: IQueue<T>, action: IAction<T>) =>
  (queue.actions = [...queue.actions, action]);

export const queueSubscribe = <T>(
  queue: IQueue<T>,
  subscriber: ISubscriber<T>
): IAction<T>[] =>
  queueDispatch(queue, {
    type: STATE0_QUEUE_SUBSCRIBE_ACTION_TYPE,
    subscriber: subscriber,
    payload: null,
  });
