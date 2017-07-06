"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Test = function () {
    function Test(a, b) {
        _classCallCheck(this, Test);

        this._a = a;
        this._b = b;
    }

    _createClass(Test, [{
        key: "a",
        get: function get() {
            return this._a;
        },
        set: function set(a) {
            this._a = a;
        }
    }, {
        key: "b",
        get: function get() {
            return this._a;
        },
        set: function set(b) {
            this._b = b;
        }
    }]);

    return Test;
}();