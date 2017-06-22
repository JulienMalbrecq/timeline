var OverlapResolver = (function (){
    var OverlapResolver = function () {},
        ONEHOUR = 3600000,
        flags = {
            REF_START: 1,
            REF_END: 2,
            NEW_START: 4,
            NEW_END: 8
        },
        masks = {
            SURROUND: flags.REF_START | flags.REF_END,
            OVERLAP_START: flags.REF_START | flags.NEW_END,
            OVERLAP_END: flags.REF_END | flags.NEW_START,
            WITHIN: flags.NEW_START | flags.NEW_END
        };

    function isWithinRange (refSlice, searchDate) {
        return searchDate >= refSlice.startDate && searchDate <= refSlice.endDate;
    }

    function computeOverlapScore (refSlice, newSlice) {
        var score = 0;

        if (isWithinRange(newSlice, refSlice.startDate)) {
            score |= flags.REF_START;
        }

        if (isWithinRange(newSlice, refSlice.endDate)) {
            score |= flags.REF_END;
        }

        if (isWithinRange(refSlice, newSlice.startDate)) {
            score |= flags.NEW_START;
        }

        if (isWithinRange(refSlice, newSlice.endDate)) {
            score |= flags.NEW_END;
        }

        return score;
    }

    function compareAgainstMask(score, mask) {
        return (score & mask) === mask;
    }

    function isOverlapping (refSlice, newSlice) {
        return computeOverlapScore(refSlice, newSlice) === 0;
    }

    function resolveMerge(refSlice, newSlice) {
        var score = computeOverlapScore(refSlice, newSlice);

        if (compareAgainstMask(score, masks.WITHIN)) {
            // return 'within' event
        } else if (compareAgainstMask(score, masks.OVERLAP_START)) {
            refSlice.startDate = newSlice.startDate;
            // return 'overlap_start' event
        } else if (compareAgainstMask(score, masks.OVERLAP_END)) {
            refSlice.endDate = newSlice.endDate;
            // return 'overlap_end' event
        } else if (compareAgainstMask(score, masks.SURROUND)) {
            refSlice.startDate = newSlice.startDate;
            refSlice.endDate = newSlice.endDate;
            // return 'surround' event
        }
    }

    function resolveOverlap(refSlice, newSlice) {
        var score = computeOverlapScore(refSlice, newSlice);
        if (compareAgainstMask(score, masks.WITHIN)) {
            // return 'within' event
        } else if (compareAgainstMask(score, masks.OVERLAP_START)) {
            refSlice.startDate.setTime(newSlice.endDate.getTime() + ONEHOUR);
            // return 'overlap_start' event
        } else if (compareAgainstMask(score, masks.OVERLAP_END)) {
            refSlice.endDate.setTime(newSlice.startDate.getTime() - ONEHOUR);
            // return 'overlap_end' event
        } else {
            var duplicate = TimeSliceFactory.create(refSlice.project, refSlice.startDate, refSlice.endDate);

            duplicate.startDate.setTime(newSlice.endDate.getTime() + ONEHOUR);
            refSlice.endDate.setTime(newSlice.startDate.getTime() - ONEHOUR);
            // return 'surround' event
        }
    }

    OverlapResolver.prototype = {
        resolve: function (refSlice, newSlice) {
            if (isOverlapping(refSlice, newSlice)) {
                var event = refSlice.project === newSlice.project
                    ? resolveMerge(refSlice, newSlice)
                    : resolveOverlap(refSlice, newSlice);
                // dispatch event
            }
        }
    };

    return OverlapResolver;
})();

