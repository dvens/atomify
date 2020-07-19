import proxyContainer from './polyfill';
import { Observers, Store, StoreSettings } from './store.types';

export function createStore<State>(settings: StoreSettings<State>): Store<State> {
    const actionsHolder = settings.actions || {};
    const observers: Observers = [];

    let prevState: State = settings.initialState;

    function valueHasChanged(value: unknown, old: unknown): boolean {
        // This ensures (old==NaN, value==NaN) always returns false
        return old !== value && (old === old || value === value);
    }

    const validator = {
        set(state: State, key: any, value: any) {
            if (valueHasChanged(state[key as keyof typeof state], value)) {
                state[key as keyof typeof state] = value;
                callObservers(state, key);
            }

            return true;
        },
    };

    let state: any = proxyContainer(settings.initialState || {}, validator);

    function subscribe(observer: Function, keys?: undefined | string[]) {
        if (typeof observer !== 'function')
            new Error('You can only subscribe to Store changes with a valid function!');
        observers.push({
            callback: observer,
            keys,
        });
        return true;
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
        dispatch,
        getState: () => state,
        getPrevState: () => prevState,
    };
}
