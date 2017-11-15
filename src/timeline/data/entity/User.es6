import ManagedEntity from "../ManagedEntity.es6";
import {AbstractDataFactory} from "../AbstractDataFactory.es6";

export class User extends ManagedEntity {
    constructor(id, name, group) {
        super(id);

        this.name = name;
        this.group = group;
    }
}

export default class UserFactory extends AbstractDataFactory {
    createEntity ({id, name, group}) {
        return new User(id, name, group);
    }
}