export class DependencyResolver {
    constructor(resolveCallback) {
        this.resolveCallback =  resolveCallback;
        this.resolved = false;
        this.resolvedObject = null;
    }

    resolve () {
        if (this.resolved === true) {
            return this.resolvedObject;
        }
        this.resolvedObject = this.resolveCallback();
        this.resolved = true;
        return this.resolvedObject;
    }
}

export class Container {
    constructor(config = {}) {
        this.config = config;
        this._services = {};
    }

    addService (name, resolver) {
        if (false === resolver instanceof  DependencyResolver) {
            throw Error('resolver must be an instance of DependencyResolver');
        }

        this._services[name] = resolver;
    }

    get (serviceName) {
        let service = Container.FindInObject(this._services, serviceName);
        if (service === null){
            throw `Undefined service ${serviceName}`;
        }
        return service instanceof DependencyResolver ? service.resolve() : service;
    }

    getConfig (pathString, defaultValue = null) {
        return Container.FindInObject(this.config, pathString, defaultValue);
    }

    static FindInObject(object, pathString, defaultValue = null) {
        let splitPath = pathString.split('.'),
            pathPart = splitPath.shift();
        while (pathPart) {
            object = object[pathPart];
            pathPart = splitPath.shift();
        }
        return object !== undefined ? object : defaultValue;
    }
}
