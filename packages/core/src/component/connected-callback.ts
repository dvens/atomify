import { setInitialPropertyValues } from './set-initial-property-values';
import { ComponentOptions, ComponentConstructor } from '../declarations';
import { initializePropertyToAttributes, addRemoveEventListeners } from '../decorators';
import { updateComponent, safeCall } from '../component';

export const connectedCallback = async( target: ComponentConstructor, options: ComponentOptions, instance: any ) => {

    await safeCall( target, instance, 'connectedCallback' );

    await setInitialPropertyValues( target, instance );

    await safeCall( target, instance, 'componentWillLoad' );
    await safeCall( target, instance, 'componentWillRender' );

    await initializePropertyToAttributes( target );
    await updateComponent( target, options );
    await addRemoveEventListeners( target );

    target.connected = true;

    ( target as any ).setAttribute('initialized', '');

    await safeCall( target, instance, 'componentDidRender' );
    await safeCall( target, instance, 'componentDidLoad' );
    await safeCall( target, instance, 'componentOnReady' );

};