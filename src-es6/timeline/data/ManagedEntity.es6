export default class ManagedEntity {
    constructor () {
        this._id = null;
    }

    get id () { return this._id; }
    set id (id) { this._id = id; }
}