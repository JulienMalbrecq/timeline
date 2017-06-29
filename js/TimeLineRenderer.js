var TimeLineRenderer = (function (doc, config) {
    var TimeLineRenderer = function (wrapper, refDate) {
        this.wrapper = wrapper;
        this.refDate = refDate;
        this.slices = [];
    };

    TimeLineRenderer.prototype = {
        addSlice: function (timeSlice, line) {
            var element = doc.createElement('div');
            element.appendChild(doc.createTextNode(timeSlice.project.name));

            element.setAttribute('class', 'time-slice');
            element.style.top = line.wrapper.offsetTop + 'px';
            this.wrapper.appendChild(element);

            this.slices.push({
                element: element,
                line: line,
                timeSlice: timeSlice
            });

            this.refresh();
        },

        removeSlice: function (timeSlice) {
            var slice = this.slices.findIndex(function (slice) { return slice.timeSlice === timeSlice; });
            if (slice >= 0) {
                this.wrapper.removeChild(this.slices[slice].element);
                this.slices.splice(slice, 1);
            }
        },

        refresh: function () {
            var refDate = this.refDate;
            this.slices.forEach(function (slice) {
                var startTile = DateUtils.tileFromDate(slice.timeSlice.startDate, refDate, config.startHour, config.tilesPerDay),
                    endTile = DateUtils.tileFromDate(slice.timeSlice.endDate, refDate, config.startHour, config.tilesPerDay) + 1,
                    totalTiles = endTile - startTile;

                slice.element.style.width = (totalTiles * config.tileSize) + 'px';
                slice.element.style.left = (startTile * config.tileSize) + 'px';
                slice.element.style.top = slice.line.wrapper.offsetTop + 'px';
                slice.element.style.backgroundColor = slice.timeSlice.project.color;
            });
        }
    };

    return TimeLineRenderer;
})(document, MainConfig);