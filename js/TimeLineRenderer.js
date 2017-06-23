var TimeLineRenderer = (function (doc, config) {
    var TimeLineRenderer = function (wrapper, refDate) {
        this.wrapper = wrapper;
        this.refDate = refDate;
        this.slices = [];
    };

    TimeLineRenderer.prototype = {
        addSlice: function (timeSlice, line) {
            var element = doc.createElement('div');
            element.setAttribute('class', 'time-slice');
            element.style.top = line.wrapper.offsetTop + 'px';
            wrapper.appendChild(element);

            this.slices.push({
                element: element,
                line: line,
                timeSlice: timeSlice
            });

            this.refresh();
        },

        refresh: function () {
            var refDate = this.refDate;
            this.slices.forEach(function (slice) {
                var startTile = DateUtils.tileFromDate(slice.timeSlice.startDate, refDate, config.startHour, config.tilesPerDay),
                    endTile = DateUtils.tileFromDate(slice.timeSlice.endDate, refDate, config.startHour, config.tilesPerDay) + 1,
                    totalTiles = endTile - startTile;

                slice.element.style.width = (totalTiles * config.tileSize) + 'px';
                slice.element.style.left = (startTile * config.tileSize) + 'px';

            });
        }
    };

    return TimeLineRenderer;
})(document, MainConfig);