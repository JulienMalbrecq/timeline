'use strict';

var EventsManager = function () {
    var _EventsManager, CustomEvent, EventCallback;

    function sortCallbacks(callbacks) {
        callbacks.sort(function (a, b) {
            return a.weight <= b.weight ? 1 : -1;
        });
    }

    EventCallback = function EventCallback(callback, weight) {
        this.setEnabled();
        this.setCallback(callback);
        this.setWeight(weight);
    };

    EventCallback.prototype = {
        setEnabled: function setEnabled(enabled) {
            this.enabled = enabled === undefined ? true : !!enabled;
        },

        setCallback: function setCallback(callback) {
            if (!(callback && callback.constructor && callback.call && callback.apply)) {
                throw 'The callback argument is not a function.';
            }

            this.callback = callback;
        },

        setWeight: function setWeight(weight) {
            this.weight = weight === undefined ? 0 : parseInt(weight, 10);
        },

        fire: function fire(context, arg) {
            if (!this.enabled) {
                return;
            }

            arg = Array.isArray(arg) ? arg : [arg];
            context = context || this;
            return this.callback.apply(context, arg);
        }
    };

    CustomEvent = function CustomEvent(name) {
        this.name = name;
        this.enabled = true;
        this.callbacks = [];
        this.defaultPrevented = false;

        this.setEnabled();
    };

    CustomEvent.prototype = {
        setEnabled: function setEnabled(enabled) {
            this.enabled = enabled === undefined ? enabled : !!enabled;
        },

        addCallback: function addCallback(callback) {
            var eventCallback = new EventCallback(callback);
            this.callbacks.push(eventCallback);
            return eventCallback;
        },

        removeCallback: function removeCallback(eventCallback) {
            var index = this.callbacks.findIndex(function (callback) {
                return callback === eventCallback;
            });
            if (index > -1) {
                this.callbacks.splice(index, 1);
            }
        },

        fire: function fire(context, arg) {
            context = context || this;
            sortCallbacks(this.callbacks);

            this.callbacks.forEach(function (callback) {
                callback.fire(context, arg);
            });
        }
    };

    _EventsManager = function EventsManager(config) {
        // default config
        this.private = false;

        if (config !== undefined) {
            Object.keys(config).forEach(function (name) {
                this[name] = config[name];
            });
        }

        this.events = {};

        if (false === this.private) {
            if (_EventsManager.instance === undefined) {
                _EventsManager.instance = this;
            }

            return _EventsManager.instance;
        }
    };

    _EventsManager.prototype = {
        bind: function bind(eventName, callback) {
            //- check if 'eventName' is already defined
            if (false === this.hasEvent(eventName)) {
                this.events[eventName] = new CustomEvent(eventName);
            }

            return this.events[eventName].addCallback(callback);
        },

        detachEvent: function detachEvent(eventName) {
            var events = this.events[eventName];
            this.removeEvent(eventName);
            return events;
        },

        hasEvent: function hasEvent(eventName) {
            return this.events[eventName] !== undefined;
        },

        getEvent: function getEvent(eventName) {
            if (false === this.hasEvent(eventName)) {
                throw 'Unknown event ' + eventName;
            }

            return this.events[eventName];
        },

        fireEvent: function fireEvent(event, arg, context) {
            context = context || this;

            if (event instanceof CustomEvent === false) {
                if (!this.hasEvent(event)) {
                    return this;
                }

                event = this.getEvent(event);
            }

            if (event instanceof CustomEvent) {
                event.fire(context, arg);
            }
        },

        fireEventAsync: function fireEventAsync(event, arg, context) {
            var self = this;
            setTimeout(function () {
                self.fireEvent(event, arg, context);
            }, 1);
        },

        fireEventOnce: function fireEventOnce(eventName, arg, context) {
            this.fireEvent(this.detachEvent(eventName), arg, context);
        },

        fireEventOnceAsync: function fireEventOnceAsync(event, arg, context) {
            var self = this;
            setTimeout(function () {
                self.fireEventOnce(event, arg, context);
            }, 1);
        },

        disableEvent: function disableEvent(eventName, disabled) {
            this.getEvent(eventName).enabled = disabled === undefined ? false : !disabled;
        },

        removeEvent: function removeEvent(eventName) {
            delete this.events[eventName];
        }
    };

    return _EventsManager;
}();