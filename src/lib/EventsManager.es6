class EventCallback {
    constructor(callback, weight) {
        this.setEnabled();
        this.setCallback(callback);
        this.setWeight(weight);
    }

    setEnabled (enabled = true) {
        this.enabled = enabled;
    }

    setCallback (callback) {
        if (!(callback && callback.constructor && callback.call && callback.apply)) {
            throw 'The callback argument is not a function.';
        }

        this.callback = callback;
    }

    setWeight (weight = 0) {
        this.weight = parseInt(weight, 10);
    }

    fire (context = this, arg) {
        if (!this.enabled) {
            return;
        }

        arg = Array.isArray(arg) ? arg : [arg];
        return this.callback.apply(context, arg);
    }
}

class CustomEvent {
    constructor(name) {
        this.name = name;
        this.enabled = true;
        this.callbacks = [];
        this.setEnabled();
    }

    setEnabled (enabled = true) {
        this.enabled = enabled;
    }

    addCallback (callback) {
        let eventCallback = new EventCallback(callback);
        this.callbacks.push(eventCallback);
        return eventCallback;
    }

    removeCallback (eventCallback) {
        let index = this.callbacks.findIndex(callback => callback === eventCallback);
        if (index > -1) {
            this.callbacks.splice(index, 1);
        }
    }

    fire (context = this, arg) {
        this.callbacks.sort((a, b) => a.weight <= b.weight ? 1 : -1);
        this.callbacks.forEach(callback => callback.fire(context, arg));
    }
}

export default class EventsManager {
    constructor (config = {}) {
        // default config
        this.private = false;
        this.events = {};

        Object.assign(this, config);

        if (false === this.private) {
            if (EventsManager.instance === undefined) {
                EventsManager.instance = this;
            }

            return EventsManager.instance;
        }
    }

    bind (eventName, callback) {
        if (Array.isArray(eventName)) {
            let callbacks = {};
            eventName.forEach(name => callbacks[name] = this.bind(name, callback));
            return callbacks;
        }

        //- check if 'eventName' is already defined
        if (false === this.hasEvent(eventName)) {
            this.events[eventName] = new CustomEvent(eventName);
        }

        return this.events[eventName].addCallback(callback);
    }

    detachEvent (eventName) {
        let event = this.events[eventName];
        this.removeEvent(eventName);
        return event;
    }

    hasEvent (eventName) {
        return this.events[eventName] !== undefined;
    }

    getEvent (eventName) {
        if (false === this.hasEvent(eventName)) {
            throw 'Unknown event ' + eventName;
        }

        return this.events[eventName];
    }

    fireEvent (event, arg, context = this) {
        if (event instanceof CustomEvent === false) {
            if (!this.hasEvent(event)) {
                return this;
            }

            event = this.getEvent(event);
        }

        if (event instanceof CustomEvent) {
            event.fire(context, arg);
        }
    }

    fireEventAsync (event, arg, context) {
        setTimeout(() => this.fireEvent(event, arg, context), 1);
    }

    fireEventOnce (eventName, arg, context) {
        this.fireEvent(this.detachEvent(eventName), arg, context);
    }

    fireEventOnceAsync (event, arg, context = this) {
        setTimeout(()  => this.fireEventOnce(event, arg, context), 1);
    }

    disableEvent (eventName, disabled = false) {
        this.getEvent(eventName).enabled = disabled;
    }

    removeEvent (eventName) {
        delete this.events[eventName];
    }
}
