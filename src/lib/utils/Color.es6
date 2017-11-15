export let isDark = function (hexaColor, threshold = 100) {
    let c = hexaColor.substring(1), // strip #
        rgb = parseInt(c, 16),      // convert rrggbb to decimal
        r = (rgb >> 16) & 0xff,     // extract red
        g = (rgb >>  8) & 0xff,     // extract green
        b = (rgb >>  0) & 0xff,     // extract blue
        luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

    return luma <= threshold;
};