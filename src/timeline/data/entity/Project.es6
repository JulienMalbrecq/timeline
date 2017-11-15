import ManagedEntity from "../ManagedEntity.es6";
import {AbstractDataFactory} from "../AbstractDataFactory.es6";

export class Project extends ManagedEntity {
    constructor (name, color) {
        super();

        this.name = name;
        this.color = color;
    }
}

export default class ProjectFactory extends AbstractDataFactory {
    createEntity (name, color) {
        return new Project(name, color);
    }
}