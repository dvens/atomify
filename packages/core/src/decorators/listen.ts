import { InitializedEvents, ListenOptions } from '../declarations';
import { supportsPassive } from '../utilities';
import { BOUND_LISTENERS, ELEMENT_ID } from '../constants';

// Keeps track of the bound events of the components
const BOUND_EVENTS = new Map();

/**
    * @Listen decorator is handling events( custom or normal ) that are being dispatched by elements or components.
*/
export const Listen = ( eventType: string, options?: ListenOptions ) => {

    return ( target: any, methodName: string ) => {

        if( !target.constructor[BOUND_LISTENERS] ) {

            target.constructor[BOUND_LISTENERS] = [];

        }

        if( methodName && typeof target[methodName] === 'function' ) {

            const listenerOptions = supportsPassive && options ? {
                capture: !!options.capture,
                passive: !!options.passive,
            } : options && options.capture ? options.capture : false;

            target.constructor[BOUND_LISTENERS].push({
                type: eventType,
                handler: target[methodName],
                options: listenerOptions,
                eventTarget: options && options.target ? options.target : false,
            });

        } else {

            throw Error('The listen decorator needs a valid method name');

        }

    };

};

/**
    * Adds and removes event listeners based up on the connected and disconnected callback.
*/
export const addRemoveEventListeners = ( targetElement: any, type: string = 'addEventListener' ) => {

    const items: Array<InitializedEvents> = targetElement.constructor[BOUND_LISTENERS];
    const defaultTarget = targetElement;

    return new Promise(( resolve ) => {

        if( !items ) return resolve();

        items.forEach( ( item ) => {

            const eventTarget = getEventTarget( targetElement, defaultTarget, item.eventTarget );
            const eventId = `${targetElement[ELEMENT_ID]}${ item.type }${item.eventTarget}${ item.handler.toString()}`;

            if(
                ( NodeList.prototype.isPrototypeOf(eventTarget) || Array.isArray( eventTarget ) ) &&
                eventTarget.length > 0
            ) {

                Array.from(eventTarget).map((target) => initializeEvent( target, eventId, item, targetElement, type ));

            } else {

                initializeEvent( eventTarget, eventId, item, targetElement, type );

            }

        });

        resolve();

    });

}

function initializeEvent(target: any, eventId: string, item: InitializedEvents , targetElement: any, type: string ) {

    const hasTarget = typeof target[type] === 'function';

    // Check if even is bound. If so remove it first before applying new one.
    if( BOUND_EVENTS.has(eventId) && hasTarget ) {
        target.removeEventListener(item.type, BOUND_EVENTS.get(eventId).callbackWrapper, item.options);
    }

    // Save event to use as reference.
    BOUND_EVENTS.set(eventId, {
        callbackWrapper: (e: Event) => { item.handler.call(targetElement, e); }
    });

    if( type === 'removeEventListener' ) {
        BOUND_EVENTS.delete(eventId);
    } else if( hasTarget ){
        target[type](item.type, BOUND_EVENTS.get(eventId).callbackWrapper, item.options);
    }

}

function getEventTarget( target: any, defaultTarget: any, eventTarget: any ) {

    if( eventTarget && typeof eventTarget !== 'string' ) {

        return eventTarget;

    }

    if( eventTarget && typeof eventTarget === 'string' ) {

        if( !target[eventTarget] ) throw new Error(`${ eventTarget } has to be called by the @Query or @QueryAll decorator`);
        return target[eventTarget];

    }

    return defaultTarget;

}