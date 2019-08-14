import { setInitialPropertyValues } from './set-initial-property-values';
import { initializePropertyToAttributes, addRemoveEventListeners } from '../decorators';
import { updateComponent, safeCall } from '../component';
export const connectedCallback = async (target, options, instance) => {
    safeCall(target, instance, 'connectedCallback');
    safeCall(target, instance, 'componentWillLoad');
    safeCall(target, instance, 'componentWillRender');
    await setInitialPropertyValues(target, instance);
    await initializePropertyToAttributes(target);
    await updateComponent(target, options);
    await addRemoveEventListeners(target);
    target.connected = true;
    target.setAttribute('initialized', '');
    safeCall(target, instance, 'componentDidRender');
    safeCall(target, instance, 'componentDidLoad');
    safeCall(target, instance, 'componentOnReady');
};
//# sourceMappingURL=connected-callback.js.map