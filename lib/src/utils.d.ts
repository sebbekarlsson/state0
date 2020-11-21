export declare const checkPath: (stateEvent: string) => any[];
export declare const getPathElements: (stateEvent: string) => string[];
/**
 * Construct a new object from a list of breadcrumbs (strings),
 * the tip becomes the value in the last node.
 */
export declare const applyValue: (breadCrumbs: any[]) => {
    [x: string]: any;
};
/**
 * Get value in object by path
 * some/value/in/object
 * or
 * some.value.in.object
 */
export declare const resolveObjectPath: (path: string, obj: any, separator?: string) => any;
export declare const uniqueByKey: <T>(arr: (T & {
    [x: string]: any;
})[], key: string | number) => (T & {
    [x: string]: any;
})[];
