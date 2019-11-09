import { ComponentOptions, ComponentConstructor } from '../declarations';
import { initializePropertyToAttributes, addRemoveEventListeners } from '../decorators';
import { updateComponent, safeCall } from '../component';
import { defer } from '../utilities';

export const connectedCallback = async( target: ComponentConstructor, options: ComponentOptions, instance: any ) => {

    target.__onReadyResolve = defer<any>();

    await safeCall( target, instance, 'connectedCallback' );
    await safeCall( target, instance, 'componentWillLoad' );
    await safeCall( target, instance, 'componentWillRender' );

    await initializePropertyToAttributes( target );
    await updateComponent( target, options );
    await addRemoveEventListeners( target );

    target.connected = true;

    ( target as any ).setAttribute('initialized', '');

    await safeCall( target, instance, 'componentDidRender' );
    await safeCall( target, instance, 'componentDidLoad' );

    target.__onReadyResolve.resolve( target );

};