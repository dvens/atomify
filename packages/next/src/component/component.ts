import { clear, setCurrentElement } from '../hooks';
import { connectingSymbol, disconnectedSymbol, Phase, phaseSymbol, updateSymbol } from '../symbols';
import { defer, DefferObject, scheduleMicrotask, validateSelector } from '../utilities';
import { defaultRenderer, FC, RenderFunction } from './render';

export type Container = Element | DocumentFragment;

export interface Component extends HTMLElement {
    container: Container;
    connected: boolean | null;
    update(): void;
    [phaseSymbol]: Phase | null;
    componentOnReady: () => Promise<any>;
    componentOnDisconnecting: () => Promise<any>;
    __onConnectedResolve: DefferObject<any>;
    __onDisconnectedResolve: DefferObject<any>;
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
            public [phaseSymbol]: Phase | null = null;

            /**
             * @type {DefferObject<any>}
             */
            __onConnectedResolve: DefferObject<any> = defer<any>();

            /**
             * @type {DefferObject<any>}
             */
            __onDisconnectedResolve: DefferObject<any> = defer<any>();

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
                this._handlePhase(disconnectedSymbol);
            }

            /**
             * Updates the component with a microtask.
             * @public
             */
            public update() {
                scheduleMicrotask(() => {
                    const phase = this.connected ? updateSymbol : connectingSymbol;
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
             * Is called when the component is removed from the dom.
             * @returns { Promise<any> }
             */
            public componentOnDisconnecting() {
                return this.__onDisconnectedResolve.promise;
            }

            /**
             * Handles the phase of the component and updates the component according the selected phase.
             * @private
             * @param {Phase} phase
             * @returns
             */
            private _handlePhase(phase: Phase) {
                this[phaseSymbol] = phase;

                switch (phase) {
                    case connectingSymbol:
                        this._render();
                        this.__onConnectedResolve.resolve(this);
                        this.connected = true;
                        this.__onConnectedResolve = defer<any>();
                        break;
                    case updateSymbol:
                        this._render();
                        break;
                    case disconnectedSymbol:
                        this.__onDisconnectedResolve.resolve(this);
                        this.connected = false;
                        this.__onDisconnectedResolve = defer<any>();
                        break;
                }
                this[phaseSymbol] = null;
            }

            private _render() {
                setCurrentElement(this);
                renderer(fn({ element: this, update: this.update }), this.container, name);
                clear();
            }
        },
    );
}
