class Test {
    constructor (a, b) {
        this._a = a;
        this._b = b;
    }

    get a () { return this._a; }
    get b () { return this._a; }
    set a (a) { this._a = a; }
    set b (b) { this._b = b; }
}