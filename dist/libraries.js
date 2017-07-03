2017-07-03
var EventsManager = (function () {
    var EventsManager,
        CustomEvent,
        EventCallback;

    function sortCallbacks (callbacks) {
        callbacks.sort(function(a, b) {
            return a.weight <= b.weight ? 1 : -1;
        });
    }

    EventCallback = function(callback, weight) {
        this.setEnabled();
        this.setCallback(callback);
        this.setWeight(weight);
    };

    EventCallback.prototype = {
        setEnabled : function(enabled) {
            this.enabled = enabled === undefined ? true : !!enabled;
        },

        setCallback: function(callback) {
            if (!(callback && callback.constructor && callback.call && callback.apply)) {
                throw 'The callback argument is not a function.';
            }

            this.callback = callback;
        },

        setWeight: function(weight) {
            this.weight = weight === undefined ? 0 : parseInt(weight, 10);
        },

        fire: function(context, arg) {
            if (!this.enabled) {
                return;
            }

            arg = Array.isArray(arg) ? arg : [arg];
            context = context || this;
            return this.callback.apply(context, arg);
        }
    };

    CustomEvent = function(name) {
        this.name = name;
        this.enabled = true;
        this.callbacks = [];
        this.defaultPrevented = false;

        this.setEnabled();
    };

    CustomEvent.prototype = {
        setEnabled: function(enabled) {
            this.enabled = enabled === undefined ? enabled : !!enabled;
        },

        addCallback: function(callback) {
            var eventCallback = new EventCallback(callback);
            this.callbacks.push(eventCallback);
            return eventCallback;
        },

        removeCallback: function(eventCallback) {
            var index = this.callbacks.findIndex(function (callback) { return callback === eventCallback; });
            if (index > -1) {
                this.callbacks.splice(index, 1);
            }
        },

        fire: function(context, arg) {
            context = context || this;
            sortCallbacks(this.callbacks);

            this.callbacks.forEach(function (callback) {
                callback.fire(context, arg);
            });
        }
    };

    EventsManager = function(config) {
        // default config
        this.private = false;

        if (config !== undefined) {
            Object.keys(config).forEach(function (name) {
                this[name] = config[name];
            });
        }

        this.events = {};

        if (false === this.private) {
            if (EventsManager.instance === undefined) {
                EventsManager.instance = this;
            }

            return EventsManager.instance;
        }
    };

    EventsManager.prototype = {
        bind: function(eventName, callback) {
            //- check if 'eventName' is already defined
            if (false === this.hasEvent(eventName)) {
                this.events[eventName] = new CustomEvent(eventName);
            }

            return this.events[eventName].addCallback(callback);
        },

        detachEvent: function (eventName) {
            var events = this.events[eventName];
            this.removeEvent(eventName);
            return events;
        },


        hasEvent: function(eventName) {
            return this.events[eventName] !== undefined;
        },

        getEvent: function(eventName) {
            if (false === this.hasEvent(eventName)) {
                throw 'Unknown event ' + eventName;
            }

            return this.events[eventName];
        },

        fireEvent: function(event, arg, context) {
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

        fireEventAsync: function(event, arg, context) {
            var self = this;
            setTimeout(function () { self.fireEvent(event, arg, context); }, 1);
        },

        fireEventOnce: function(eventName, arg, context) {
            this.fireEvent(this.detachEvent(eventName), arg, context);
        },

        fireEventOnceAsync: function(event, arg, context) {
            var self = this;
            setTimeout(function () { self.fireEventOnce(event, arg, context); }, 1);
        },

        disableEvent: function(eventName, disabled) {
            this.getEvent(eventName).enabled = disabled === undefined ? false : !disabled
            ;
        },

        removeEvent: function(eventName) {
            delete this.events[eventName];
        }
    };

    return EventsManager;
})();

var MouseStateListener = (function () {
    var mouseIsDown = false,
        MouseStateListener = function () {},
        html = document.getElementsByTagName('html')[0];

    html.addEventListener('mousedown', function () { mouseIsDown = true; });
    html.addEventListener('mouseup', function () { mouseIsDown = false; });

    MouseStateListener.prototype = {
        isDown: function () { return mouseIsDown; }
    };

    return new MouseStateListener();
})();
var DateUtils = {
    INTERVAL: {
        ONEMINUTE: 60000,
        ONEHOUR: 3600000,
        ONEDAY: 86400000
    },

    setHour: function(date, hour, minutes, seconds, milliseconds) {
        minutes = minutes || 0;
        seconds = seconds || 0;
        milliseconds = milliseconds || 0;

        date.setHours(hour);
        date.setMinutes(minutes);
        date.setSeconds(seconds);
        date.setMilliseconds(milliseconds);

        return date;
    },

    toMidnight: function (date) {
        return DateUtils.setHour(date, 0);
    },

    tileFromDate: function (date, refDate, startHour, tilePerDay) {
        var startOfDay = DateUtils.setHour(new Date(date.getTime()), startHour),
            timeDiff = date.getTime() - refDate.getTime(),
            days = Math.floor(timeDiff/DateUtils.INTERVAL.ONEDAY);

        return days * tilePerDay + Math.floor((date.getTime() - startOfDay.getTime()) / DateUtils.INTERVAL.ONEHOUR);
    }
};
var Utils = Utils || {};
Utils.CSS = {
    manipulateClassNames: function (element, className, add) {
        add = add === undefined ? true : add;
        var classes = (element.className || '')
                .trim().split(' ')
                .filter(function (currentClass) {
                    return currentClass !== className;
            });
        
        if (add) {
            classes.push(className);
        }

        element.className = classes.join(' ').trim();
    },

    batchAction: function (elements, className, add) {
        if (!Array.isArray(elements)) {
            elements = [elements];
        }

        var i = 0,
            total = elements.length;

        for (; i < total; i += 1) {
            Utils.CSS.manipulateClassNames(elements[i], className, add);
        }
    },

    addClass: function (element, className) {
        Utils.CSS.batchAction(element, className, true);
    },

    removeClass: function (element, className) {
        Utils.CSS.batchAction(element, className, false);
    },

    toggleClass: function (element, className) {
        var add = !Utils.CSS.hasClass(element, className);
        Utils.CSS.batchAction(element, className, add);
    },

    hasClass: function (element, className) {
        return (element.className || '')
            .trim()
            .split(' ')
            .filter(function(currentClass) { return currentClass === className; }).length > 0;
    }
};