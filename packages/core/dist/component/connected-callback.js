import { setInitialPropertyValues } from './set-initial-property-values';
import { initializePropertyToAttributes, addRemoveEventListeners } from '../decorators';
import { updateComponent, safeCall } from '../component';
import { defer } from '../utilities';
export const connectedCallback = async (target, options, instance) => {
    target.__onReadyResolve = defer();
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
    target.__onReadyResolve.resolve(target);
};
//# sourceMappingURL=connected-callback.js.map