import { clear, Hooks, setCurrentElement } from '../hooks';
import { DID_LOAD_SYMBOL, DID_UNLOAD_SYMBOL, Phase, PHASE_SYMBOL, UPDATE_SYMBOL } from '../symbols';
import { defer, DefferObject, scheduleMicrotask, validateSelector } from '../utilities';
import { defaultRenderer, FC, RenderFunction } from './render';

export type Container = Element | DocumentFragment;

export interface Component extends HTMLElement {
    container: Container;
    connected: boolean | null;
    update(): void;
    [PHASE_SYMBOL]: Phase | null;
    componentOnReady: () => Promise<any>;
    __onConnectedResolve: DefferObject<any>;
    __hooks: Hooks;
}

interface Options {
    rerender?: RenderFunction;
    useShadowDom?: boolean;
}

export function defineElement(name: string, fn: FC, options?: Options) {
    const renderer = options && options.rerender ? options.rerender : defaultRenderer;

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
             *
             * @type {(Phase | null)}
             */
            public [PHASE_SYMBOL]: Phase | null = null;

            /**
             * @type {DefferObject<any>}
             */
            __onConnectedResolve: DefferObject<any> = defer<any>();

            /**
             * Holds the hook state values and the callbacks
             */
            __hooks: Hooks = {
                state: [],
                callbacks: [],
            };

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
                return this.__onConnectedResolve.promise;
            }

            /**
             * @param phase
             */
            private _flushPhaseCallbacks(phase: Phase) {
                const callbacks = this.__hooks.callbacks;

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
                        this.__onConnectedResolve.resolve(this);
                        this._flushPhaseCallbacks(DID_LOAD_SYMBOL);
                        this.__onConnectedResolve = defer<any>();
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
                renderer(fn({ element: this, update: this.update }), this.container, name);
                clear();
            }
        },
    );
}
