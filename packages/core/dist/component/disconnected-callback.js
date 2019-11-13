import { addRemoveEventListeners } from '../decorators';
import { safeCall, removeTemplate } from '../component';
import { IS_DISCONNECTING } from '../constants';
export const disconnectedCallback = async (target, instance) => {
    await safeCall(target, instance, 'disconnectedCallback');
    await addRemoveEventListeners(target, 'removeEventListener');
    await removeTemplate(target);
    target.connected = false;
    target.removeAttribute('initialized');
    // Resolve when the component is fully disconnected
    if (target[IS_DISCONNECTING]) {
        target[IS_DISCONNECTING].resolve();
        target[IS_DISCONNECTING] = false;
    }
    safeCall(target, instance, 'componentDidUnLoad');
};
//# sourceMappingURL=disconnected-callback.js.map