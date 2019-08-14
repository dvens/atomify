import { setInitialPropertyValues } from './set-initial-property-values';
import { ComponentOptions, ComponentConstructor } from '../declarations';
import { initializePropertyToAttributes, addRemoveEventListeners } from '../decorators';
import { updateComponent, safeCall } from '../component';

export const connectedCallback = async( target: ComponentConstructor, options: ComponentOptions, instance: any ) => {

    safeCall( target, instance, 'connectedCallback' );
    safeCall( target, instance, 'componentWillLoad' );

    await setInitialPropertyValues( target, instance );
    await initializePropertyToAttributes( target );
    await updateComponent( target, options );
    await addRemoveEventListeners( target );

    target.connected = true;

    ( target as any ).setAttribute('initialized', '');

    safeCall( target, instance, 'componentDidLoad' );
    safeCall( target, instance, 'componentOnReady' );

};