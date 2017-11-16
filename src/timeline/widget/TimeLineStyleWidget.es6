export default class TimeLineStyleWidget {

    constructor(refDate, tileSize = 25, tilePerDay = 8, strokeColor = '#CCCCCC', fillColor = '#EEEEEE') {
        this.refDate = refDate;
        this.tileSize = tileSize;
        this.tilePerDay = tilePerDay;
        this.strokeColor = strokeColor;
        this.fillColor = fillColor;
    }

    initInterface () {
        let style = document.createElement('style'),
            gridData = this.createGridImage();

        style.innerHTML = `[data-timeline] { background: url(${gridData}); height: ${this.tileSize}px; }`;
        document.querySelector('head').appendChild(style);
    }

    createGridImage () {
        let grid = document.createElement('canvas'),
            ctx = grid.getContext('2d'),
            totalGrid = this.tilePerDay * 7,
            i, x,
            dayIndex = 6 + (this.refDate.getDay()) % 7,
            currentDay = dayIndex * this.tilePerDay;

        grid.setAttribute('width', totalGrid * this.tileSize);
        grid.setAttribute('height', this.tileSize);

        ctx.fillStyle = this.fillColor;

        for (i = 0; i < totalGrid; currentDay += 1, i += 1) {
            ctx.beginPath();
            ctx.strokeStyle = (i % this.tilePerDay === 0) ? '#666666' : this.strokeColor;
            x = (this.tileSize * i) + 0.5;

            // check weekend day
            if ((currentDay >> 3) % 7 > 4) {
                ctx.fillRect(x, 0, this.tileSize, this.tileSize);
            }

            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.tileSize);
            ctx.stroke();
        }

        return grid.toDataURL();
    }
}