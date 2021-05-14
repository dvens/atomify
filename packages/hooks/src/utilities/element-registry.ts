export const ELEMENT_REGISTRY = new WeakMap<Function, Set<HTMLElement>>();

export const registerElement = (constructor: Function, element: HTMLElement) => {
    let connected = ELEMENT_REGISTRY.get(constructor);
    if (!connected) {
        connected = new Set();
        ELEMENT_REGISTRY.set(constructor, connected);
    }
    connected.add(element);
};

export const deleteElement = (constructor: Function, element: HTMLElement) => {
    const registery = ELEMENT_REGISTRY.get(constructor);
    if (registery) {
        registery.delete(element);
    }
};
