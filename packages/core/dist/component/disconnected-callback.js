import { addRemoveEventListeners } from '../decorators';
import { safeCall, removeTemplate } from '../component';
export const disconnectedCallback = async (target, instance) => {
    await safeCall(target, instance, 'disconnectedCallback');
    await addRemoveEventListeners(target, 'removeEventListener');
    await removeTemplate(target);
    target.connected = false;
    target.removeAttribute('initialized');
    safeCall(target, instance, 'componentDidUnLoad');
};
//# sourceMappingURL=disconnected-callback.js.map