import { createHook } from '@atomify/hooks';

import { Store, Subscribe } from '../utilities/store/store.types';
/**
 * Store wrapper for functional components
 * @template T
 * @param {Store<T>} store
 */
export const useStore = <T>(store: Store<T>) =>
    createHook<[T, Subscribe<T>, T]>({
        onDidLoad: () => {
            const state = store.getState();
            const subscribe = store.subscribe;
            const prevState = store.getPrevState();

            return [state, subscribe, prevState];
        },
    });
