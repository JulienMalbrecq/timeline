import TimeLineTool from './TimeLineTool.es6';
import * as TileUtils from "../../lib/utils/Tile.es6";

export default class CreateTool extends TimeLineTool {
    constructor(timeLine, timeSliceFactory, entityBank, timeSliceManager) {
        super('create', timeLine);

        this.timeSliceManager = timeSliceManager;
        this.timeSliceFactory = timeSliceFactory;
        this.entityBank = entityBank;

        this.lastSlice = null;
        this._currentProject = null;

        this.projectList = [];
    }

    get currentProject () { return this._currentProject; }
    set currentProject (name) { this._currentProject = this.projectList.find(project => project.name === name); }

    initInterface() {
        let selectors = document.querySelectorAll('[data-tool-create="selector"]'),
            optionWrapper = document.createDocumentFragment();

        this.projectList = this.entityBank.getBank('projects');

        if (this.projectList.length > 0) {
            this.currentProject = this.projectList[0].name;
        }

        this.projectList.forEach(project => {
            let option = document.createElement('option'),
                label = document.createTextNode(project.name);

            option.appendChild(label);
            option.setAttribute('value', project.name);
            optionWrapper.appendChild(option);
        });

        [...selectors].forEach(selector => {
            selector.appendChild(optionWrapper); // @todo find a way to duplicate optionWrapper
            selector.addEventListener('change', ev => this.currentProject = ev.target.value);
        });
    }

    mouseDown(line, tile) {
        if (line !== null) {
            console.log(line);
            let date = TileUtils.getDateFromTile(tile);
            this.lastSlice = this.timeSliceFactory.create(this.currentProject, line, date, date);
        }
    }

    mouseMove(line, tile) {
        let date = TileUtils.getDateFromTile(tile);
        if (this.lastSlice && date >= this.lastSlice.startDate) {
            this.lastSlice.endDate = date;
        }
    }

    mouseUp(line, tile) {
        if (line) {
            if (false === this.timeSliceManager.persist(this.lastSlice)) {
                this.timeLine.removeSlice(this.lastSlice);
            }
        }

        this.lastSlice = null;
    }
}
