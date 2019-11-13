import { ComponentOptions, ComponentConstructor } from '../declarations';
import { addRemoveEventListeners } from '../decorators';
import { updateComponent, safeCall } from '../component';

export const reRender = async( target: ComponentConstructor, options: ComponentOptions, instance: any ) => {

    await safeCall( target, instance, 'componentWillRender' );
    await updateComponent( target, options, true );
    await addRemoveEventListeners( target );

    await safeCall( target, instance, 'componentDidRender' );

};
