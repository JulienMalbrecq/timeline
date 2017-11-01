import AbstractDataManager from '../AbstractDataManager.es6';
import {factory} from '../entity/TimeSlice.es6';

export default class TimeSliceDataManager extends AbstractDataManager {
    constructor (eventsManager, factory) { super('timeslice', eventsManager, factory); }

    parseData (data) {
        if (false === Array.isArray(data)) {
            data = [data];
        }

        return data.map(data => factory.create(data.project, null /* @todo replace by timeline line */, data.startDate, data.endDate, false, false));
    }
}
