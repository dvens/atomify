import { ComponentConstructor } from '../declarations';
import { addRemoveEventListeners } from '../decorators';
import { safeCall, removeTemplate } from '../component';

export const disconnectedCallback = async( target: ComponentConstructor, instance: any ) => {

    await safeCall( target, instance, 'disconnectedCallback' );
    await addRemoveEventListeners( target, 'removeEventListener' );
    await removeTemplate( target );

    target.connected = false;
    ( target as any ).removeAttribute('initialized');

    safeCall( target, instance, 'componentDidUnLoad' );

};