var MouseStateListener = (function () {
    var mouseIsDown = false,
        MouseStateListener = function () {},
        html = document.getElementsByTagName('html')[0];

    html.addEventListener('mousedown', function () { mouseIsDown = true; console.log('true') });
    html.addEventListener('mouseup', function () { mouseIsDown = false; console.log('false') });

    MouseStateListener.prototype = {
        isDown: function () { return mouseIsDown; }
    };

    return new MouseStateListener();
})();