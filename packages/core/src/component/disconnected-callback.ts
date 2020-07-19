import { removeTemplate, safeCall } from '../component';
import { IS_DISCONNECTING } from '../constants';
import { ComponentConstructor } from '../declarations';
import { addRemoveEventListeners } from '../decorators';

export const disconnectedCallback = async (target: ComponentConstructor, instance: any) => {
    await safeCall(target, instance, 'disconnectedCallback');
    await addRemoveEventListeners(target, 'removeEventListener');
    await removeTemplate(target);

    target.connected = false;
    (target as any).removeAttribute('initialized');

    // Resolve when the component is fully disconnected
    if (target[IS_DISCONNECTING]) {
        target[IS_DISCONNECTING].resolve();
        (target[IS_DISCONNECTING] as unknown) = false;
    }

    safeCall(target, instance, 'componentDidUnLoad');
};
