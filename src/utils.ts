export const checkPath = (stateEvent: string) => {
  if (!stateEvent) {
    throw new Error("Cannot pass an empty stateEvent / path");
  }

  if (!stateEvent.includes("/")) {
    throw new Error("stateEvent / path needs at least one level of depth.");
  }

  if (stateEvent[stateEvent.length - 1] === "/") {
    throw new Error("stateEvent / path cannot end with `/`");
  }

  return [];
};

export const getPathElements = (stateEvent: string): string[] =>
  checkPath(stateEvent) && stateEvent.split("/");

/**
 * Construct a new object from a list of breadcrumbs (strings),
 * the tip becomes the value in the last node.
 */
export const applyValue = (breadCrumbs: any[]): { [x: string]: any } => ({
  [breadCrumbs.pop()]:
    breadCrumbs.length == 1 ? breadCrumbs[0] : applyValue(breadCrumbs),
});

/**
 * Get value in object by path
 * some/value/in/object
 * or
 * some.value.in.object
 */
export const resolveObjectPath = (path: string, obj: any, separator = "/") =>
  (Array.isArray(path) ? path : path.split(separator)).reduce(
    (prev, curr) => prev && prev[curr],
    obj
  );

export const uniqueByKey = <T>(
  arr: (T & { [x: string]: any })[],
  key: string | number
) => [...Array.from(new Map(arr.map((item) => [item[key], item])).values())];
