import proxyPolyfill from './proxy';

const proxyContainer = ( services = {}, handler: object = {} ) => {

    if (!window.Proxy) {
        const ProxyPolyfill: any = proxyPolyfill();
        return new ProxyPolyfill(services, ( handler as any ) );
    }

    return new Proxy(services, handler);

};

export default proxyContainer;