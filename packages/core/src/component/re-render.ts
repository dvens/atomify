import { safeCall, updateComponent } from '../component';
import { ComponentConstructor, ComponentOptions } from '../declarations';
import { addRemoveEventListeners } from '../decorators';

export const reRender = async (
    target: ComponentConstructor,
    options: ComponentOptions,
    instance: any,
) => {
    await safeCall(target, instance, 'componentWillRender');
    await updateComponent(target, options, true);
    await addRemoveEventListeners(target);

    await safeCall(target, instance, 'componentDidRender');
};
