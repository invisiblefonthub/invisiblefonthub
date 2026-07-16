/**
 * Invisible Font Hub
 * core/service-container.js
 * Part 1A
 *
 * Enterprise Dependency Injection Container
 * Mobile-first
 * Blogger + GitHub Pages Compatible
 */

(function (global) {
    'use strict';

    const REGISTRY = new Map();
    const SINGLETONS = new Map();
    const RESOLVING = new Set();

    function assertName(name) {
        if (typeof name !== 'string' || name.trim() === '') {
            throw new TypeError('Service name must be a non-empty string.');
        }
    }

    function assertFactory(factory) {
        if (typeof factory !== 'function') {
            throw new TypeError('Service factory must be a function.');
        }
    }

    function freezeDefinition(definition) {
        return Object.freeze({
            name: definition.name,
            factory: definition.factory,
            singleton: definition.singleton === true
        });
    }

    class ServiceContainer {

        register(name, factory, options) {

            assertName(name);
            assertFactory(factory);

            if (REGISTRY.has(name)) {
                throw new Error('Service already registered: ' + name);
            }

            const definition = freezeDefinition({
                name,
                factory,
                singleton: options && options.singleton === true
            });

            REGISTRY.set(name, definition);

            return this;
        }

        singleton(name, factory) {
            return this.register(name, factory, {
                singleton: true
            });
        }

        has(name) {
            assertName(name);
            return REGISTRY.has(name);
        }

        remove(name) {

            assertName(name);

            REGISTRY.delete(name);
            SINGLETONS.delete(name);

            return this;
        }

        clear() {

            REGISTRY.clear();
            SINGLETONS.clear();
            RESOLVING.clear();

            return this;
        }

        keys() {
            return Object.freeze(Array.from(REGISTRY.keys()));
        }

    }

    global.ServiceContainer = ServiceContainer;

})(self);
    ServiceContainer.prototype.resolve = function (name) {

        assertName(name);

        if (!REGISTRY.has(name)) {
            throw new Error('Unknown service: ' + name);
        }

        if (SINGLETONS.has(name)) {
            return SINGLETONS.get(name);
        }

        if (RESOLVING.has(name)) {
            throw new Error('Circular dependency detected: ' + name);
        }

        RESOLVING.add(name);

        try {

            const definition = REGISTRY.get(name);

            const instance = definition.factory(Object.freeze({
                resolve: this.resolve.bind(this),
                has: this.has.bind(this),
                keys: this.keys.bind(this)
            }));

            if (instance === undefined) {
                throw new Error('Factory returned undefined: ' + name);
            }

            if (definition.singleton) {
                SINGLETONS.set(name, instance);
            }

            return instance;

        } finally {
            RESOLVING.delete(name);
        }
    };

    ServiceContainer.prototype.get = ServiceContainer.prototype.resolve;

    ServiceContainer.prototype.createScope = function () {
        return new ServiceContainer();
    };

    Object.freeze(ServiceContainer.prototype);

    Object.defineProperty(global, 'DIContainer', {
        value: Object.freeze(new ServiceContainer()),
        writable: false,
        enumerable: true,
        configurable: false
    });

    Object.freeze(ServiceContainer);
    ServiceContainer.prototype.invoke = function (factory, context) {

        assertFactory(factory);

        const resolver = Object.freeze({
            resolve: this.resolve.bind(this),
            get: this.get.bind(this),
            has: this.has.bind(this),
            keys: this.keys.bind(this)
        });

        return factory.call(context || null, resolver);
    };


    ServiceContainer.prototype.snapshot = function () {

        return Object.freeze({
            services: this.keys(),
            singletons: Object.freeze(
                Array.from(SINGLETONS.keys())
            )
        });
    };


    ServiceContainer.prototype.lock = function () {

        const container = this;

        Object.freeze(REGISTRY);

        return Object.freeze({
            resolve: container.resolve.bind(container),
            get: container.get.bind(container),
            has: container.has.bind(container),
            keys: container.keys.bind(container),
            snapshot: container.snapshot.bind(container)
        });
    };


    ServiceContainer.prototype.isLocked = function () {
        return Object.isFrozen(REGISTRY);
    };


    Object.defineProperty(ServiceContainer.prototype, 'constructor', {
        value: ServiceContainer,
        enumerable: false,
        writable: false,
        configurable: false
    });


    Object.freeze(ServiceContainer.prototype);

})(typeof globalThis !== 'undefined'
    ? globalThis
    : (typeof self !== 'undefined'
        ? self
        : this));
