import { setInitialPropertyValues } from './set-initial-property-values';
import { initializePropertyToAttributes, addRemoveEventListeners } from '../decorators';
import { updateComponent, safeCall } from '../component';
export const connectedCallback = async (target, options, instance) => {
    await safeCall(target, instance, 'connectedCallback');
    await setInitialPropertyValues(target, instance);
    await safeCall(target, instance, 'componentWillLoad');
    await safeCall(target, instance, 'componentWillRender');
    await initializePropertyToAttributes(target);
    await updateComponent(target, options);
    await addRemoveEventListeners(target);
    target.connected = true;
    target.setAttribute('initialized', '');
    await safeCall(target, instance, 'componentDidRender');
    await safeCall(target, instance, 'componentDidLoad');
    await safeCall(target, target, 'componentOnReady');
};
//# sourceMappingURL=connected-callback.js.map