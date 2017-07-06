class Project {
    constructor (name, color) {
        this.name = name;
        this.color = color;
    }
}

export default class ProjectFactory {
    static create (name, color) {
        return new Project(name, color);
    }
}