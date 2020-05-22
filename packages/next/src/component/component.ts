export interface DefferObject<T> {
    promise: Promise<T>;
    resolve: (value?: T) => void;
}

export type Container = Element | DocumentFragment;

export interface Component {
    container: Container;
    connected: boolean;
    properties: any;
    update(): void;
    componentOnReady: () => Promise<any>;
    __canAttachShadowDom: boolean;
    __nodeName: string;
    __onReadyResolve: DefferObject<any>;
    __isDisconnecting: DefferObject<any>;
}

// Functional Component
export type FC = () => unknown;
