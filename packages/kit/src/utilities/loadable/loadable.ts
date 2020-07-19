import { inviewObserver } from '@utilities/inview';

export interface LoadableOptions {
    hook: string;
    loader: () => Promise<any>;
    loading?: string;
    onError?: (error: string) => void;
    onLoaded?: () => void;
    inViewOptions?: IntersectionObserverInit;
}

export interface LoadableElement extends Element {
    __initializedHookReference: string[];
    componentOnReady?: () => Promise<any>;
}

const INITIALIZERS = new Map<string, LoadableElement[]>();
const INITIALIZED_HOOKS: string[] = [];

/**
 * Loads components with dynamic imports
 * @param {LoadableOptions} options
 */
export const Loadable = (options: LoadableOptions) => {
    const elements = document.querySelectorAll(options.hook);

    // Check if there are any elements
    if (elements.length !== 0) {
        // Creates a map from the hook and related elements.
        Array.from(elements).forEach((element: LoadableElement) => {
            const currentElements = INITIALIZERS.get(options.hook);
            if (currentElements) {
                INITIALIZERS.set(options.hook, [...currentElements, element]);
            } else {
                INITIALIZERS.set(options.hook, [element]);
            }

            // Keep a reference of already intialized elements
            element.__initializedHookReference = element.__initializedHookReference || [];

            // Check if the element is already initialized by this hook.
            if (element.__initializedHookReference.indexOf(options.hook) !== -1) return;

            // Observe element when added to the map.
            observeComponent(element, options);
        });
    }
};

/**
 * Observes the components when they are not inview and intializes them when they are in view.
 * @param {Element} element
 * @param {LoadableOptions} options
 */
function observeComponent(element: LoadableElement, options: LoadableOptions) {
    const loadingState = createLoadingState(element, options);

    inviewObserver.observe(
        element,
        inView => {
            if (inView) {
                options
                    .loader()
                    .then(() => {
                        // Check if module is already loaded
                        if (INITIALIZED_HOOKS.indexOf(options.hook) !== -1) return;

                        // Unobserve when component is inview
                        unObserveRelatedElements(options.hook, inviewObserver);

                        // Trigger onload callback when the module is successfully loaded
                        if (options.onLoaded) {
                            options.onLoaded();
                        }

                        // Keep track of the loaded modules
                        INITIALIZED_HOOKS.push(options.hook);

                        // Remove loading state
                        if (loadingState) loadingState.remove();
                    })
                    .catch(error => {
                        // Trigger onerror callback when the module is not successfully loaded.
                        if (options.onError) options.onError(error);
                    });
            }
        },
        options.inViewOptions || {},
    );
}

/**
 * Un observe other elements that are related to initialized hook.
 * @param {string} hook
 * @param {typeof inviewObserver} observer
 */
function unObserveRelatedElements(hook: string, observer: typeof inviewObserver) {
    const relatedElements = INITIALIZERS.get(hook);

    if (relatedElements) {
        Array.from(relatedElements).map(element => {
            element.__initializedHookReference.push(hook);
            observer.unobserve(element);
        });
    }
}

/**
 * Returns a loading state based upon the loading option.
 * @param {LoadableElement} element
 * @param {LoadableOptions} options
 * @returns {boolean | HTMLDivElement}
 */
function createLoadingState(element: LoadableElement, options: LoadableOptions) {
    if (!options.loading) return false;

    const loadingPlaceholder = document.createElement('div');

    loadingPlaceholder.innerHTML = options.loading;
    element.appendChild(loadingPlaceholder);

    return {
        remove: () => {
            if (element.componentOnReady) {
                element.componentOnReady().then(() => {
                    loadingPlaceholder.remove();
                });
            } else {
                loadingPlaceholder.remove();
            }
        },
    };
}
