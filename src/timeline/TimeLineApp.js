var TimeLineApp = (function () {
    var App = function (wrapper, refDate) {
        this.wrapper = wrapper;
        this.refDate = refDate;

        this.eventManager = new EventsManager({private: true});

        this.overlapResolver = new OverlapResolver(this.eventManager);
        this.timeLine = new TimeLine(wrapper, refDate);
        this.renderer = new TimeLineRenderer(wrapper, refDate);

        this.toolBox = new TimeLineToolbox(timeLine);

        // add a data manager which will manage the loading and rendering of the timelines
    };



    return App;
})();