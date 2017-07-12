import ManagedEntity from "../ManagedEntity.es6";
import {AbstractDataFactory} from "../AbstractDataFactory.es6";

class User extends ManagedEntity {
    constructor(name, group) {
        super();

        this.name = name;
        this.group = group;
    }
}

export default class UserFactory extends AbstractDataFactory {
    createEntity (name, group) {
        return new User(name, group);
    }
}