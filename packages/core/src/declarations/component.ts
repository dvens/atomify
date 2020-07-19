export interface IDefferObject<T> {
    promise: Promise<T>;
    resolve: (value?: T) => void;
}
export interface ComponentConstructor {
    connectedCallback?: () => void;
    attributeChangedCallback?: (
        name: string,
        oldValue: string | null,
        newValue: string | null,
    ) => void;
    disconnectedCallback?: () => void;
    render?: () => any;
    renderRoot: CustomElementRenderRoot;
    connected: boolean;
    properties: any;
    __canAttachShadowDom: boolean;
    __hasShadowdomPolyfill: boolean;
    __nodeName: string;
    __jsxProps?: Map<string, unknown>;
    componentOnReady: () => Promise<any>;
    __onReadyResolve: IDefferObject<any>;
    __isDisconnecting: IDefferObject<any>;
}

export interface ComponentOptions {
    tag: string;
    style?: string;
    styles?: string[];
    shadow?: boolean;
}

export interface CustomElement extends HTMLElement {
    connectedCallback?(): void;
    disconnectedCallback?(): void;
    observedAttributes?(): void;
    render?(): void;
}

export interface CustomElementConstructor {
    new (...args: any[]): CustomElement;
}

export type CustomElementRenderRoot = Element | DocumentFragment;

export interface RenderRoot {
    renderRoot: CustomElementRenderRoot;
}

export type StyleString = string | boolean;

export interface RenderTemplate {
    template: HTMLTemplateElement;
    styles: StyleString;
    templateResult: DocumentFragment;
}

export type QueryTarget = Element | DocumentFragment;
