export default class MouseStateListener {
    constructor (wrapper) {
        this._isDown = false;
        this.wrapper = wrapper;
        wrapper.addEventListener('mousedown', ev => this._isDown = true);
        wrapper.addEventListener('mouseup', ev => this._isDown = false);
    }

    get isDown () { return this._isDown; }
}
