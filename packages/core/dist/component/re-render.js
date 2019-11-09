import { addRemoveEventListeners } from '../decorators';
import { updateComponent, safeCall } from '../component';
export const reRender = async (target, options, instance) => {
    await safeCall(target, instance, 'componentWillRender');
    await addRemoveEventListeners(target, 'removeEventListener');
    await updateComponent(target, options, true);
    await addRemoveEventListeners(target);
    await safeCall(target, instance, 'componentDidRender');
};
//# sourceMappingURL=re-render.js.map