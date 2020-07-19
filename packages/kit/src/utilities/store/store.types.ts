export type keys = string[] | undefined;

export type Subscribe<T> = (observer: (state: T) => void, keys?: keys) => void;
export type Dispatch<T> = (actionKey: string, payload?: any) => T | {};
export type State<T> = () => T;

export interface Store<T> {
    getState: State<T>;
    getPrevState: State<T>;
    subscribe: Subscribe<T>;
    dispatch: Dispatch<T>;
}

export interface StoreAction<T> {
    [key: string]: (state: T | {}, payload: any) => T;
}

export interface StoreSettings<T> {
    actions?: StoreAction<T>;
    initialState: T;
}

export interface Observer {
    callback: Function;
    keys: keys;
}

export type Observers = Array<Observer>;
