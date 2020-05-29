import { WATCHED_PROPERTIES } from '../constants';

/**
 * The @Watch decorators validates the prop and triggers the method with the old and the new value.
 */
export const Watch = (propertyName: string) => {
    return (target: any, functionName: string) => {
        if (!target.constructor[WATCHED_PROPERTIES]) {
            target.constructor[WATCHED_PROPERTIES] = new Map();
        }

        if (target.constructor.properties.has(propertyName)) {
            target.constructor[WATCHED_PROPERTIES].set(propertyName, functionName);
        } else {
            throw Error(`Watcher: can't find property name ${propertyName}`);
        }
    };
};
