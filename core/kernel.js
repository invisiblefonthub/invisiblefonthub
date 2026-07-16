'use strict';

/**
 * Invisible Font Hub
 * Enterprise Kernel
 * Version: Enterprise
 * Status: Production
 */

const Kernel = (() => {

    const VERSION = 'Enterprise';

    const state = Object.seal({

        initialized: false,

        booted: false,

        modules: new Map(),

        services: new Map(),

        plugins: new Map(),

        events: new Map(),

        capabilities: new Map(),

        configuration: new Map(),

        bootQueue: [],

        errors: []

    });

    function assert(condition, message) {

        if (!condition) {

            throw new Error(message);

        }

    }

    function freeze(object) {

        return Object.freeze(object);

    }

    function registerService(name, service) {

        assert(name, 'Service name required.');

        assert(!state.services.has(name), `Duplicate service: ${name}`);

        state.services.set(name, freeze(service));

    }

    function getService(name) {

        return state.services.get(name);

    }

    function registerModule(name, module) {

        assert(name, 'Module name required.');

        assert(!state.modules.has(name), `Duplicate module: ${name}`);

        state.modules.set(name, freeze(module));

    }

    function getModule(name) {

        return state.modules.get(name);

    }

    function registerCapability(name, value = true) {

        state.capabilities.set(name, value);

    }

    function hasCapability(name) {

        return state.capabilities.get(name) === true;

    }

    return {

        VERSION,

        registerService,

        getService,

        registerModule,

        getModule,

        registerCapability,

        hasCapability

    };

})();
    function registerPlugin(name, plugin) {

        assert(name, 'Plugin name required.');

        assert(plugin, 'Plugin instance required.');

        assert(!state.plugins.has(name), `Duplicate plugin: ${name}`);

        state.plugins.set(name, freeze(plugin));

    }

    function getPlugin(name) {

        return state.plugins.get(name);

    }

    function hasPlugin(name) {

        return state.plugins.has(name);

    }

    function registerEvent(eventName) {

        assert(eventName, 'Event name required.');

        if (!state.events.has(eventName)) {

            state.events.set(eventName, []);

        }

    }

    function on(eventName, listener) {

        registerEvent(eventName);

        state.events.get(eventName).push(listener);

    }

    function emit(eventName, payload = null) {

        if (!state.events.has(eventName)) {

            return;

        }

        const listeners = state.events.get(eventName);

        for (const listener of listeners) {

            try {

                listener(payload);

            } catch (error) {

                state.errors.push(error);

            }

        }

    }

    function off(eventName, listener) {

        if (!state.events.has(eventName)) {

            return;

        }

        const listeners = state.events.get(eventName);

        const index = listeners.indexOf(listener);

        if (index >= 0) {

            listeners.splice(index, 1);

        }

    }

    function queueBoot(task) {

        assert(typeof task === 'function', 'Boot task must be a function.');

        state.bootQueue.push(task);

    }

    function boot() {

        if (state.booted) {

            return;

        }

        for (const task of state.bootQueue) {

            task();

        }

        state.booted = true;

    }
    function setConfiguration(key, value) {

        assert(key, 'Configuration key required.');

        state.configuration.set(key, value);

    }

    function getConfiguration(key, fallback = null) {

        if (!state.configuration.has(key)) {

            return fallback;

        }

        return state.configuration.get(key);

    }

    function hasConfiguration(key) {

        return state.configuration.has(key);

    }

    function removeConfiguration(key) {

        state.configuration.delete(key);

    }

    function initialize() {

        if (state.initialized) {

            return;

        }

        registerCapability('kernel');

        registerCapability('modules');

        registerCapability('plugins');

        registerCapability('events');

        registerCapability('services');

        registerCapability('configuration');

        registerCapability('boot');

        registerCapability('security');

        registerCapability('performance');

        state.initialized = true;

    }

    function status() {

        return freeze({

            version: VERSION,

            initialized: state.initialized,

            booted: state.booted,

            modules: state.modules.size,

            services: state.services.size,

            plugins: state.plugins.size,

            events: state.events.size,

            capabilities: state.capabilities.size,

            configuration: state.configuration.size,

            errors: state.errors.length

        });

    }

    function getErrors() {

        return [...state.errors];

    }

    function clearErrors() {

        state.errors.length = 0;

    }
    function hasService(name) {

        return state.services.has(name);

    }

    function hasModule(name) {

        return state.modules.has(name);

    }

    function removeService(name) {

        state.services.delete(name);

    }

    function removeModule(name) {

        state.modules.delete(name);

    }

    function listServices() {

        return freeze([...state.services.keys()]);

    }

    function listModules() {

        return freeze([...state.modules.keys()]);

    }

    function listPlugins() {

        return freeze([...state.plugins.keys()]);

    }

    function listCapabilities() {

        return freeze([...state.capabilities.keys()]);

    }

    function reset() {

        state.modules.clear();

        state.services.clear();

        state.plugins.clear();

        state.events.clear();

        state.capabilities.clear();

        state.configuration.clear();

        state.bootQueue.length = 0;

        state.errors.length = 0;

        state.initialized = false;

        state.booted = false;

    }

    return freeze({

        VERSION,

        initialize,

        boot,

        reset,

        status,

        registerService,

        getService,

        hasService,

        removeService,

        listServices,

        registerModule,

        getModule,

        hasModule,

        removeModule,

        listModules,

        registerPlugin,

        getPlugin,

        hasPlugin,

        listPlugins,

        registerCapability,

        hasCapability,

        listCapabilities,

        setConfiguration,

        getConfiguration,

        hasConfiguration,

        removeConfiguration,

        registerEvent,

        on,

        off,

        emit,

        queueBoot,

        getErrors,

        clearErrors

    });

})();
    const lifecycle = Object.seal({

        phase: 'created',

        startedAt: null,

        initializedAt: null,

        bootedAt: null

    });

    function setPhase(phase) {

        assert(phase, 'Lifecycle phase required.');

        lifecycle.phase = phase;

    }

    function getPhase() {

        return lifecycle.phase;

    }

    function markInitialized() {

        lifecycle.initializedAt = Date.now();

        setPhase('initialized');

    }

    function markBooted() {

        lifecycle.bootedAt = Date.now();

        setPhase('booted');

    }

    function startRuntime() {

        if (lifecycle.startedAt !== null) {

            return;

        }

        lifecycle.startedAt = Date.now();

        setPhase('starting');

        initialize();

        markInitialized();

        boot();

        markBooted();

    }

    function getLifecycle() {

        return freeze({

            phase: lifecycle.phase,

            startedAt: lifecycle.startedAt,

            initializedAt: lifecycle.initializedAt,

            bootedAt: lifecycle.bootedAt

        });

    }

    registerCapability('lifecycle');

    registerCapability('runtime');

    registerCapability('status');

    registerCapability('diagnostics');
