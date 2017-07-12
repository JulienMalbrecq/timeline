import TimeLineTool from './TimeLineTool.es6';

export default class CreateTool extends TimeLineTool {
    constructor(timeLine, timeSliceFactory, timeSliceManager, projectManager) {
        super('create', timeLine);

        this.timeSliceManager = timeSliceManager;
        this.projectManager = projectManager;
        this.timeSliceFactory = timeSliceFactory;

        this.lastSlice = null;
        this._currentProject = null;

        this.projectList = [];
    }

    get currentProject () { return this._currentProject; }
    set currentProject (name) { this._currentProject = this.projectList.find(project => project.name === name); }

    initInterface() {
        this.projectManager.findAll().then(projects => {
            let selectors = document.querySelectorAll('[data-tool-create="selector"]'),
                optionWrapper = document.createDocumentFragment();

            this.projectList = projects;
            if (this.projectList.length > 0) {
                this.currentProject = this.projectList[0].name;
            }

            projects.forEach(project => {
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
        });
    }

    mouseDown(line, tile) {
        if (line !== null) {
            console.log('here');
            let date = this.timeLine.getDateFromTile(tile);
            this.lastSlice = this.timeSliceFactory.create(this.currentProject, line, date, date);
        }
    }

    mouseMove(line, tile) {
        let date = this.timeLine.getDateFromTile(tile);
        if (this.lastSlice && date >= this.lastSlice.startDate) {
            this.lastSlice.endDate = date;
        }
    }

    mouseUp(line, tile) {
        if (line) {
            this.timeSliceManager.persist(this.lastSlice);
        }

        this.lastSlice = null;
    }
}
