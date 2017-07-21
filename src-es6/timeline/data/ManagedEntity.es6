export default class ManagedEntity {
    constructor (id = null) {
        this._id = id;
    }

    get id () { return this._id; }
    set id (id) { this._id = id; }
}