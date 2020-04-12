interface DelegatedEvent extends Event {
    delegateTarget: Element;
}

interface SharedOptions {
    selector: string;
    type: string;
    callback: ( event: Event ) => void;
    useCapture?: boolean;
}

interface DelegateOptions extends SharedOptions {
    target: EventTarget
}

function _delegate( options: DelegateOptions ) {

    const { target, selector, type, callback, useCapture = false } = options;

    const listenerFn = ( event: DelegatedEvent ) => {

        const delegateTarget = (event.target as Element).closest( selector );

		if ( !delegateTarget ) return;

		event.delegateTarget = delegateTarget;

		if ( ( event.currentTarget as Element ).contains(event.delegateTarget) ) {

            callback.call( target, event );

        }

	};

    ( target as any ).addEventListener(type, listenerFn, useCapture );

    return {
        destroy() {
            ( target as any ).removeEventListener( type, listenerFn, useCapture );
        }
    }

}

/**
    * Lightweight event delegation.
*/
export const delegate = ( options: DelegateOptions ) => {

    const { target, type } = options;

	if ( typeof target === 'object' || typeof type === 'function' ) {

        return _delegate({ ...options, target });

	}

	if ( typeof target === 'string' ) {

        return Array.from( document.querySelectorAll( target ) )
            .map( ( element: EventTarget ) => _delegate({ ...options, target: element }) );

	}

    return null;

};