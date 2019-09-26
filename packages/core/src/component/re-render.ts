import { ComponentOptions, ComponentConstructor } from '../declarations';
import { addRemoveEventListeners } from '../decorators';
import { updateComponent, safeCall } from '../component';
import { setInitialPropertyValues } from './set-initial-property-values';

export const reRender = async( target: ComponentConstructor, options: ComponentOptions, instance: any ) => {

    await safeCall( target, instance, 'componentWillRender' );

    await setInitialPropertyValues( target, instance );
    await addRemoveEventListeners( target, 'removeEventListener' );
    await updateComponent( target, options, true );
    await addRemoveEventListeners( target );

    await safeCall( target, instance, 'componentDidRender' );

};