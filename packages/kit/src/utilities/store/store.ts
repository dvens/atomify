import { isServer } from '@atomify/shared';

import { defaultObject, Observers, Store, StoreSettings } from './store.types';

let proxyContainer: any = null;

export function createStore<State>(settings: StoreSettings<State>): Store<State> {
    const actionsHolder = settings.actions || {};
    const observers: Observers = [];

    let prevState: State = settings.initialState;

    const validator = {
        set(state: State, key: any, value: any) {
            if (valueHasChanged(state[key as keyof typeof state], value)) {
                state[key as keyof typeof state] = value;
                callObservers(state, key);
            }

            return true;
        },
    };

    let state: any = getProxyConatiner(settings.initialState || {}, validator);

    function subscribe(observer: (data: State) => void, keys?: undefined | string[]) {
        if (typeof observer !== 'function')
            new Error('You can only subscribe to Store changes with a valid function!');
        observers.push({
            callback: observer,
            keys,
        });
        return true;
    }

    function unsubscribe(observer: (data: State) => void) {
        if (typeof observer !== 'function')
            new Error('You can only subscribe to Store changes with a valid function!');

        const match = observers.find(({ callback }) => callback === observer);
        if (match) {
            observers.splice(observers.indexOf(match), 1);
        }
    }

    async function dispatch(actionKey: string, payload: any) {
        const action = actionsHolder[actionKey];
        if (typeof action !== 'function') new Error(`Action "${actionKey}" doesn't exist.`);

        prevState = Object.assign({}, state);

        const newState = await action(state, payload);
        state = newState;

        return true;
    }

    function callObservers(data: State, key: any) {
        observers.forEach(({ keys, callback }) => {
            if (!keys) {
                callback(data);
            } else if (Array.isArray(keys) && keys.indexOf(key) > -1) {
                callback(data);
            }
        });
    }

    return {
        subscribe,
        unsubscribe,
        dispatch,
        getState: () => state,
        getPrevState: () => prevState,
    };
}

export const setProxyContainer = (proxy: () => void) => {
    proxyContainer = proxy;
};

function getProxyConatiner(services = {}, handler: defaultObject = {}) {
    if (!isServer && !window.Proxy) {
        return new proxyContainer(services, handler);
    }

    return new Proxy(services, handler);
}

function valueHasChanged(value: unknown, old: unknown): boolean {
    // This ensures (old==NaN, value==NaN) always returns false
    return old !== value && (old === old || value === value);
}
