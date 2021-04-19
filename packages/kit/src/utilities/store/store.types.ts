export type keys = string[] | undefined;
export type defaultObject = { [key: string]: any };

export type Subscribe<T> = (observer: (state: T) => void, keys?: keys) => void;
export type Unsubscribe<T> = (observer: (state: T) => void) => void;
export type Dispatch<T> = (actionKey: string, payload?: any) => T | defaultObject;
export type State<T> = () => T;

export interface Store<T> {
    getState: State<T>;
    getPrevState: State<T>;
    subscribe: Subscribe<T>;
    unsubscribe: Unsubscribe<T>;
    dispatch: Dispatch<T>;
}

export interface StoreAction<T> {
    [key: string]: (state: T | defaultObject, payload: any) => T;
}

export interface StoreSettings<T> {
    actions?: StoreAction<T>;
    initialState: T;
}

export interface Observer {
    callback: (data: any) => void;
    keys: keys;
}

export type Observers = Array<Observer>;
