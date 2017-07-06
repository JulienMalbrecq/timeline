export default class MouseStateListener {
    constructor (container) {
        this._isDown = false;
        container.addEventListener('mousedown', () => this._isDown = true);
        container.addEventListener('mouseup', () => this._isDown = false);
    }

    get isDown () { return this._isDown; }
}
