import { AspectRatioDrawer } from './AspectRatioDrawer.js';
import { Colour } from '../Colour.js';
import { Vector3D } from './vector/Vector3D.js';
await Colour.asyncInit();

function getLineWidth(interval, val) {
	// use wider lines for larger intervals.
	if (val % (interval * 10) === 0)
		return 0.15;
	if (val % (interval * 5) === 0)
		return 0.03;
	return 0.02;
}

function refreshWidthAndHeight(canvas) {
	const b = canvas.getBoundingClientRect();
	b.width = Math.floor(b.width);
	b.height = Math.floor(b.height);
	canvas.setAttribute('width', b.width);
	canvas.setAttribute('height', b.height);
	return b;
}

export class Canvas2DGridDrawer {
	constructor() {
		this.canvas = document.createElement('canvas');
		this.canvas.classList.add('grid-2d');
		this.ctx = this.canvas.getContext('2d');
		this.setGridColour(new Colour('#000'));
	}

	drawLine(camera, drawer, lineInfo, w, h) {
		var from, to;
		if (lineInfo.y === undefined) {
			if (isNaN(lineInfo.x)) {
				console.error('lineInfo = ', lineInfo);
				throw new Error('Invalid x in lineInfo.  lineInfo = ' + JSON.stringify(lineInfo));
			}
			from = [lineInfo.x, 0];
			to = [lineInfo.x, h];
		}
		else {
			if (isNaN(lineInfo.y))
				throw new Error('Invalid y in lineInfo.  lineInfo = ' + JSON.stringify(lineInfo));
			from = [0, lineInfo.y];
			to = [w, lineInfo.y];
		}
		const vfrom = drawer.getTranslatedPosition(camera.transform(new Vector3D(from[0], from[1], 0)));
		const vto = drawer.getTranslatedPosition(camera.transform(new Vector3D(to[0], to[1], 0)));
		if (lineInfo.y === undefined) {
			if (vfrom.getX() < 0 || vfrom.getX() > w)
				return;
			vfrom.setY(0);
			vto.setY(h);
		}
		else {
			if (vfrom.getY() < 0 || vfrom.getY() > h)
				return;
			vfrom.setX(0);
			vto.setX(w);
		}
		this.ctx.lineWidth = lineInfo.width;
		this.ctx.beginPath();
		this.ctx.moveTo(vfrom.getX(), vfrom.getY());
		this.ctx.lineTo(vto.getX(), vto.getY());
		this.ctx.closePath();
		this.ctx.stroke();
	}

	redraw(camera, drawer) {
		const b = refreshWidthAndHeight(this.canvas);
		const w = b.width, h = b.height;
		this.ctx.clearRect(0, 0, w, h);
		const lines = [{'y': 0, 'width': 0.5}, {'x': 0, 'width': 0.5}];
		const log = Math.log10(Math.abs(camera.getZoomScale() / Math.max(w, h)));
		const logScale = 1.5 - Math.abs(log % 1);
		const lineInterval = Math.pow(10, -Math.floor(log) - 2);
		const xOffset = Math.round(-camera.position.getX()  / lineInterval) * lineInterval;
		const yOffset = Math.round(-camera.position.getY() / lineInterval) * lineInterval;

		// numIntervals needs to be large enough that the grid fills the full width and height at all times.
		const numIntervals = 50;
		if (!isNaN(xOffset) && !isNaN(yOffset)) {
			for (let i = -numIntervals; i < numIntervals; i++) {
				const s = lineInterval * i;
				lines.push({'x': s + xOffset, 'width': logScale * getLineWidth(lineInterval, s + xOffset)});
				lines.push({'y': s + yOffset, 'width': logScale * getLineWidth(lineInterval, s + yOffset)});
			}
		}
		this.ctx.strokeStyle = this.gridColour.to6DigitHTMLCode();
		const outer = this;
		lines.forEach(function(lineInfo) {
			outer.drawLine(camera, drawer, lineInfo, w, h);
		});

		this.ctx.stroke();
		if (AspectRatioDrawer.shouldAspectRatiosAppear())
			AspectRatioDrawer.draw(this.ctx, camera, drawer);
	}

	setGridColour(c) {
		this.gridColour = c;
	}
};