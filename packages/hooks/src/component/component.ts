import { clear, Hooks, ListenMap, Property, setCurrentElement } from '../hooks';
import {
    DID_LOAD_SYMBOL,
    DID_UNLOAD_SYMBOL,
    Phase,
    PHASE_SYMBOL,
    REFLECTING_TO_ATTRIBUTE,
    REFLECTING_TO_PROPERTY,
    SIDE_EFFECT_PHASE_SYMBOL,
    SideEffectPhase,
    UPDATE_SYMBOL,
} from '../symbols';
import {
    camelCaseToDash,
    defer,
    DefferObject,
    generateQuickGuid,
    scheduleMicrotask,
    toProperty,
    validateSelector,
} from '../utilities';
import { defaultRenderer, RenderFunction } from './render';

export type Container = HTMLElement | ShadowRoot;
export interface ComponentMeta {
    $listeners$: ListenMap;
    $onComponentReadyResolve$: DefferObject<any>;
    $hooks$: Hooks;
    $tagName$: string;
    $id$: string;
    $clearElementOnUpdate$: boolean;
    $dependencies$: Set<symbol>;
    $watchers$: Array<{
        callback: () => void;
        dependencies: Set<symbol>;
    }>;
}
export interface Component extends HTMLElement {
    container: Container;
    connected: boolean | null;
    styles: string;
    update(): void;
    [PHASE_SYMBOL]: Phase | null;
    [SIDE_EFFECT_PHASE_SYMBOL]: SideEffectPhase | null;
    hasShadowDom: boolean;
    componentOnReady: () => Promise<any>;
    $cmpMeta$: ComponentMeta;
    props: Property;
}
export interface FC<P = unknown> {
    ({ element, update }: { element: P & Component; update: () => void }): any;
    props?: Property;
}

interface Options {
    renderer?: RenderFunction;
    useShadowDom?: boolean;
}

export function defineElement(name: string, fn: FC<any>, options?: Options) {
    const { renderer = defaultRenderer, useShadowDom = false } = options || {};

    validateSelector(name);

    class Element extends HTMLElement implements Component {
        /**
         * Node or ShadowRoot into which element DOM should be rendered.
         * Which is being set in the constructor.
         * @type {Container}
         */
        public container: Container;

        /**
         * Tells the components when it is connected to DOM
         * @type {boolean}
         */
        public connected: boolean | null = null;

        /**
         * Holds the state of the element
         * @type {(Phase | null)}
         */
        public [PHASE_SYMBOL]: Phase | null = null;

        /**
         * Holds the state of the element side effects such as reflecting to attribute and reflecting to property
         * @type {(SideEffectPhase | null)}
         */
        public [SIDE_EFFECT_PHASE_SYMBOL]: SideEffectPhase | null = null;

        /**
         * Holds the styles of the component that can be reused within a template.
         * @type {string}
         */
        public styles: string = '';

        /**
         * Holds the properties that can be set through Component.props
         * @type {Property}
         * @memberof Element
         */
        public props: Property = fn.props || {};

        /**
         * Tells the component if ShadowDom is supported.
         * @type {boolean} hasShadowDom
         */
        public hasShadowDom: boolean = useShadowDom;

        public $cmpMeta$: ComponentMeta = {
            $listeners$: new Map(),
            $onComponentReadyResolve$: defer<any>(),
            $hooks$: {
                state: [],
                callbacks: [],
            },
            $tagName$: name,
            $id$: generateQuickGuid(),
            $clearElementOnUpdate$: false,
            $dependencies$: new Set(),
            $watchers$: [],
        };

        /**
         * Returns a list of attributes based on the registrated properties.
         **/
        static get observedAttributes() {
            return fn.props ? Object.keys(fn.props).map((key) => camelCaseToDash(key)) : [];
        }

        /**
         * Called when the component is created
         */
        constructor() {
            super();

            if (options && options.useShadowDom) {
                this.attachShadow({ mode: 'open' });
                this.container = this.shadowRoot ? this.shadowRoot : this;
            } else {
                this.container = this;
            }
        }

        /**
         * ConnectedCallback is fired each time the custom element is appended into a document-connected element.
         **/
        connectedCallback() {
            this.update();
        }

        /**
         * DisconnectedCallback is fired each time the custom element is disconnected from the document's DOM.
         **/
        disconnectedCallback() {
            this.handlePhase(DID_UNLOAD_SYMBOL);
        }

        /**
         * Is called each time a attribute that is defined in the observedAttributes is changed.
         **/
        attributeChangedCallback(
            attrName: string,
            oldValue: string | null,
            newValue: string | null,
        ) {
            if (this[SIDE_EFFECT_PHASE_SYMBOL] === REFLECTING_TO_ATTRIBUTE) return;

            if (oldValue !== newValue) {
                this[SIDE_EFFECT_PHASE_SYMBOL] = REFLECTING_TO_PROPERTY;

                const { name, value } = toProperty(attrName, newValue, this);
                this[name as keyof this] = value;

                this[SIDE_EFFECT_PHASE_SYMBOL] = null;
            }
        }

        /**
         * Updates the component with a microtask.
         * @public
         */
        public update() {
            scheduleMicrotask(() => {
                const phase = this.connected ? UPDATE_SYMBOL : DID_LOAD_SYMBOL;
                this.handlePhase(phase);
            });
        }

        /**
         * Is called when the component is fully rendered.
         * @returns { Promise<any> }
         */
        public componentOnReady() {
            return this.$cmpMeta$.$onComponentReadyResolve$.promise;
        }

        /**
         * @param phase
         */
        private flushPhaseCallbacks(phase: Phase) {
            const callbacks = this.$cmpMeta$.$hooks$.callbacks;

            callbacks.forEach((callback, key) => {
                if (callback.type === phase) {
                    callback.callback();
                    delete callbacks[key];
                }
            });
        }

        /**
         * Handles the phase of the component and updates the component according the selected phase.
         * @private
         * @param {Phase} phase
         * @returns
         */
        private handlePhase(phase: Phase) {
            this[PHASE_SYMBOL] = phase;

            switch (phase) {
                case DID_LOAD_SYMBOL:
                    this.connected = true;
                    this.render();
                    this.$cmpMeta$.$onComponentReadyResolve$.resolve(this);
                    this.flushPhaseCallbacks(DID_LOAD_SYMBOL);
                    this.$cmpMeta$.$onComponentReadyResolve$ = defer<any>();
                    this.setAttribute('initialized', '');
                    break;
                case UPDATE_SYMBOL:
                    this.render();
                    this.flushPhaseCallbacks(UPDATE_SYMBOL);
                    break;
                case DID_UNLOAD_SYMBOL:
                    this.connected = false;
                    this.flushPhaseCallbacks(DID_UNLOAD_SYMBOL);
                    this.removeAttribute('initialized');
                    break;
            }
            this[PHASE_SYMBOL] = null;
        }

        private render() {
            setCurrentElement(this);

            renderer(
                fn({ element: this, update: this.update.bind(this) }),
                this.container,
                name,
                this,
            );
            clear();
        }
    }

    if (!customElements.get(name)) {
        customElements.define(name, Element);
    }
}
