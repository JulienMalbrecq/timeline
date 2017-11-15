import ManagedEntity from "./data/ManagedEntity.es6";

export default class TimeLineEntityBank  {
    constructor () {
        this._banks = {};
    }

    addBank (bankName, data) {
        // validate data
        let invalidData = !Array.isArray(data) || data.find(entity => false === entity instanceof ManagedEntity);
        if (invalidData) {
            throw Error('Data must be an array of ManagedEntity');
        }

        this._banks[bankName] = data;
    }

    getBank(bankName) {
        return this.hasBank(bankName) ? this._banks[bankName] : null;
    }

    getFromBank(bankName, id, defaultValue = null) {
        let bank = this._banks[bankName];
        return bank !== null ? bank.find(entity => entity.id === id) : defaultValue;
    }

    hasBank (bankName) {
        return this._banks[bankName] !== undefined;
    }
}