import {INTERVAL} from '../lib/utils/Date';
import TimeSliceFactory from './data/TimeSlice';

let flags = {
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

export let resolutionType = {
    RESOLUTION_WITHIN: 0,
    RESOLUTION_OVERLAP_START: 1,
    RESOLUTION_OVERLAP_END: 2,
    RESOLUTION_SURROUND: 3
};

export let event = {
    RESOLVED_OVERLAP: 'overlap-resolver-resolved-overlap',
    RESOLVED_MERGE: 'overlap-resolver-resolved-overlap'
};

function isWithinRange (refSlice, searchDate) {
    return searchDate >= refSlice.startDate && searchDate <= refSlice.endDate;
}

function computeOverlapScore (refSlice, newSlice) {
    let score = 0;

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

function resolveMerge(refSlice, newSlice) {
    let score = computeOverlapScore(refSlice, newSlice),
        resolution = [refSlice, newSlice];

    if (compareAgainstMask(score, masks.WITHIN)) {
        resolution.push(resolutionType.RESOLUTION_WITHIN);
    } else if (compareAgainstMask(score, masks.OVERLAP_START)) {
        refSlice.startDate = newSlice.startDate;
        resolution.push(resolutionType.RESOLUTION_OVERLAP_START);
    } else if (compareAgainstMask(score, masks.OVERLAP_END)) {
        refSlice.endDate = newSlice.endDate;
        resolution.push(resolutionType.RESOLUTION_OVERLAP_END);
    } else if (compareAgainstMask(score, masks.SURROUND)) {
        refSlice.startDate = newSlice.startDate;
        refSlice.endDate = newSlice.endDate;
        resolution.push(resolutionType.RESOLUTION_SURROUND);
    } else {
        resolution = null;
    }

    return resolution;
}

function resolveOverlap(refSlice, newSlice) {
    let score = computeOverlapScore(refSlice, newSlice),
        resolution = [refSlice, newSlice],
        duplicate;

    if (compareAgainstMask(score, masks.WITHIN)) {
        resolution.push(resolutionType.RESOLUTION_WITHIN);
    } else if (compareAgainstMask(score, masks.OVERLAP_START)) {
        refSlice.startDate.setTime(newSlice.endDate.getTime() + INTERVAL.ONEHOUR);
        resolution.push(resolutionType.RESOLUTION_OVERLAP_START);
    } else if (compareAgainstMask(score, masks.OVERLAP_END)) {
        refSlice.endDate.setTime(newSlice.startDate.getTime() - INTERVAL.ONEHOUR);
        resolution.push(resolutionType.RESOLUTION_OVERLAP_END);
    } else {
        duplicate = TimeSliceFactory.create(refSlice.project, refSlice.startDate, refSlice.endDate);
        duplicate.startDate.setTime(newSlice.endDate.getTime() + INTERVAL.ONEHOUR);
        refSlice.endDate.setTime(newSlice.startDate.getTime() - INTERVAL.ONEHOUR);
        resolution.push(resolutionType.RESOLUTION_SURROUND);
        resolution.push(duplicate);
    }

    return duplicate;
}

export default class OverlapResolver {
    constructor (eventManager) {
        this.eventManager = eventManager;
    }

    static isOverlapping (refSlice, newSlice) {
        return computeOverlapScore(refSlice, newSlice) > 0;
    }

    resolve (refSlice, newSlice) {
        let resolveEvent, resolution;
        if (OverlapResolver.isOverlapping(refSlice, newSlice)) {
            resolveEvent = refSlice.project === newSlice.project ? event.RESOLVED_MERGE : event.RESOLVED_OVERLAP;
            resolution = refSlice.project === newSlice.project ? resolveMerge(refSlice, newSlice) : resolveOverlap(refSlice, newSlice);
            this.eventManager.fire(resolveEvent, resolution);
        }
    }
}
