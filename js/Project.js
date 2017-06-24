var ProjectFactory = (function () {
    var Project = function (name, color) {
        this.name = name;
        this.color = color;
    };

    Project.prototype = {};

    return {
        create : function (name, color) {
            return new Project(name, color);
        }
    };
})();