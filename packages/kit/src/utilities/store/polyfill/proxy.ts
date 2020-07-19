// @ts-nocheck
/* eslint-disable */
export default function proxyPolyfill() {
    let lastRevokeFn: any = null;

    /**
     * @param {*} o
     * @return {boolean} whether this is probably a (non-null) Object
     */
    function isObject(o: any) {
        return o ? typeof o === 'object' || typeof o === 'function' : false;
    }

    /**
     * @constructor
     * @param {!Object} target
     * @param {{apply, construct, get, set}} handler
     */

    const ProxyPolyfill = function(target: any, handler: any) {
        if (!isObject(target) || !isObject(handler)) {
            throw new TypeError('Cannot create proxy with a non-object as target or handler');
        }

        // Construct revoke function, and set lastRevokeFn so that Proxy.revocable can steal it.
        // The caller might get the wrong revoke function if a user replaces or wraps scope.Proxy
        // to call itself, but that seems unlikely especially when using the polyfill.
        let throwRevoked: any = function() {
            return;
        };
        lastRevokeFn = function() {
            throwRevoked = function(trap: string) {
                throw new TypeError(`Cannot perform '${trap}' on a proxy that has been revoked`);
            };
        };

        // Fail on unsupported traps: Chrome doesn't do this, but ensure that users of the polyfill
        // are a bit more careful. Copy the internal parts of handler to prevent user changes.
        const unsafeHandler = handler;
        handler = { get: null, set: null, apply: null, construct: null };
        for (const k in unsafeHandler) {
            if (!(k in handler)) {
                // throw new TypeError(`Proxy polyfill does not support trap '${k}'`);
            } else {
                handler[k] = unsafeHandler[k];
            }
        }
        if (typeof unsafeHandler === 'function') {
            // Allow handler to be a function (which has an 'apply' method). This matches what is
            // probably a bug in native versions. It treats the apply call as a trap to be configured.
            handler.apply = unsafeHandler.apply.bind(unsafeHandler);
        }

        // Define proxy as this, or a Function (if either it's callable, or apply is set).
        // TODO(samthor): Closure compiler doesn't know about 'construct', attempts to rename it.

        let proxy = this;
        let isMethod = false;
        let isArray = false;
        if (typeof target === 'function') {
            proxy = function ProxyPolyfill() {
                const usingNew = this && this.constructor === proxy;
                const args = Array.prototype.slice.call(arguments);

                throwRevoked(usingNew ? 'construct' : 'apply');

                if (usingNew && handler['construct']) {
                    return handler['construct'].call(this, target, args);
                } else if (!usingNew && handler.apply) {
                    return handler.apply(target, this, args);
                }

                // since the target was a function, fallback to calling it directly.
                if (usingNew) {
                    // inspired by answers to https://stackoverflow.com/q/1606797
                    args.unshift(target); // pass class as first arg to constructor, although irrelevant
                    // nb. cast to convince Closure compiler that this is a constructor
                    const f = /** @type {!Function} */ target.bind.apply(target, args);
                    /* eslint new-cap: "off" */
                    return new f();
                }

                return target.apply(this, args);
            };
            isMethod = true;
        } else if (target instanceof Array) {
            proxy = [];
            isArray = true;
        }

        // Create default getters/setters. Create different code paths as handler.get/handler.set can't
        // change after creation.

        const getter = handler.get
            ? function(prop: any) {
                  throwRevoked('get');

                  return handler.get(this, prop, proxy);
              }
            : function(prop: any) {
                  throwRevoked('get');

                  return this[prop];
              };
        const setter = handler.set
            ? function(prop: any, value: any) {
                  throwRevoked('set');

                  handler.set(this, prop, value, proxy);
              }
            : function(prop: any, value: any) {
                  throwRevoked('set');

                  this[prop] = value;
              };

        // Clone direct properties (i.e., not part of a prototype).
        const propertyNames = Object.getOwnPropertyNames(target);
        const propertyMap = {};
        propertyNames.forEach(function(prop) {
            if ((isMethod || isArray) && prop in proxy) {
                return; // ignore properties already here, e.g. 'bind', 'prototype' etc
            }
            const real = Object.getOwnPropertyDescriptor(target, prop);
            const desc = {
                enumerable: !!real.enumerable,
                get: getter.bind(target, prop),
                set: setter.bind(target, prop),
            };
            Object.defineProperty(proxy, prop, desc);

            propertyMap[prop] = true;
        });

        // Set the prototype, or clone all prototype methods (always required if a getter is provided).
        // TODO(samthor): We don't allow prototype methods to be set. It's (even more) awkward.
        // An alternative here would be to _just_ clone methods to keep behavior consistent.
        let prototypeOk = true;
        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(proxy, Object.getPrototypeOf(target));
            /* eslint no-proto: "off" */
        } else if (proxy.__proto__) {
            proxy.__proto__ = target.__proto__;
        } else {
            prototypeOk = false;
        }
        if (handler.get || !prototypeOk) {
            for (const k in target) {
                if (propertyMap[k]) {
                    continue;
                }
                Object.defineProperty(proxy, k, { get: getter.bind(target, k) });
            }
        }

        // The Proxy polyfill cannot handle adding new properties. Seal the target and proxy.
        Object.seal(target);
        Object.seal(proxy);

        return proxy; // nb. if isMethod is true, proxy != this
    };

    ProxyPolyfill.revocable = function(target, handler) {
        const p = new ProxyPolyfill(target, handler);

        return { proxy: p, revoke: lastRevokeFn };
    };

    return ProxyPolyfill;
}
