"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Project = function Project(name, color) {
    _classCallCheck(this, Project);

    this.name = name;
    this.color = color;
};

var ProjectFactory = function () {
    function ProjectFactory() {
        _classCallCheck(this, ProjectFactory);
    }

    _createClass(ProjectFactory, null, [{
        key: "create",
        value: function create(name, color) {
            return new Project(name, color);
        }
    }]);

    return ProjectFactory;
}();

exports.default = ProjectFactory;