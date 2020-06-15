import { clear, Hooks, ListenMap, setCurrentElement } from '../hooks';
import { DID_LOAD_SYMBOL, DID_UNLOAD_SYMBOL, Phase, PHASE_SYMBOL, UPDATE_SYMBOL } from '../symbols';
import {
    defer,
    DefferObject,
    generateQuickGuid,
    scheduleMicrotask,
    validateSelector,
} from '../utilities';
import { CFE, defaultRenderer, RenderFunction } from './render';

export type Container = HTMLElement | ShadowRoot;

export interface ComponentMeta {
    $listeners$: ListenMap;
    $onComponentReadyResolve$: DefferObject<any>;
    $hooks$: Hooks;
    $tagName$: string;
    $id$: string;
    $clearElementOnUpdate$: boolean;
}
export interface Component extends HTMLElement {
    container: Container;
    connected: boolean | null;
    styles: string;
    update(): void;
    [PHASE_SYMBOL]: Phase | null;
    hasShadowDom: boolean;
    componentOnReady: () => Promise<any>;
    $cmpMeta$: ComponentMeta;
}

interface Options {
    renderer?: RenderFunction;
    useShadowDom?: boolean;
    observedAttributes?: string[];
}

export function defineElement(name: string, fn: CFE, options?: Options) {
    const { renderer = defaultRenderer, observedAttributes = [], useShadowDom = false } =
        options || {};

    validateSelector(name);

    customElements.define(
        name,
        class extends HTMLElement implements Component {
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
             * Holds the styles of the component that can be reused within a template.
             * @type {string}
             */
            public styles: string = '';

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
            };

            /**
             * Returns a list of attributes based on the registrated properties.
             **/
            static get observedAttributes() {
                return observedAttributes;
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
                this._handlePhase(DID_UNLOAD_SYMBOL);
            }

            /**
             * Is called each time a attribute that is defined in the observedAttributes is changed.
             **/
            attributeChangedCallback(
                name: string,
                oldValue: string | null,
                newValue: string | null,
            ) {
                console.log(name, oldValue, newValue);
            }

            /**
             * Updates the component with a microtask.
             * @public
             */
            public update() {
                scheduleMicrotask(() => {
                    const phase = this.connected ? UPDATE_SYMBOL : DID_LOAD_SYMBOL;
                    this._handlePhase(phase);
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
            private _flushPhaseCallbacks(phase: Phase) {
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
            private _handlePhase(phase: Phase) {
                this[PHASE_SYMBOL] = phase;

                switch (phase) {
                    case DID_LOAD_SYMBOL:
                        this.connected = true;
                        this._render();
                        this.$cmpMeta$.$onComponentReadyResolve$.resolve(this);
                        this._flushPhaseCallbacks(DID_LOAD_SYMBOL);
                        this.$cmpMeta$.$onComponentReadyResolve$ = defer<any>();
                        break;
                    case UPDATE_SYMBOL:
                        this._render();
                        this._flushPhaseCallbacks(UPDATE_SYMBOL);
                        break;
                    case DID_UNLOAD_SYMBOL:
                        this.connected = false;
                        this._flushPhaseCallbacks(DID_UNLOAD_SYMBOL);
                        break;
                }
                this[PHASE_SYMBOL] = null;
            }

            private _render() {
                setCurrentElement(this);

                if (this.$cmpMeta$.$clearElementOnUpdate$) {
                    this.container.innerHTML = '';
                }

                renderer(
                    fn({ element: this, update: this.update.bind(this) }),
                    this.container,
                    name,
                    this,
                );
                clear();
            }
        },
    );
}
