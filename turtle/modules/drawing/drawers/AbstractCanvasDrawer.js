import { isNumber } from '../../isNumber.js';
import { Vector2DDrawer } from '../vector/Vector2DDrawer.js';

export class AbstractCanvasDrawer extends Vector2DDrawer {
	constructor(canvases, width, height) {
		if (canvases === undefined) {
			canvases = [];
			for (let i = 0; i < 3; i++) {
				const canvas = document.createElement('canvas');
				canvas.setAttribute('width', width);
				canvas.setAttribute('height', height);
				canvases.push(canvas);
			}
		}
		if (!(canvases instanceof Array))
			throw new Error('canvases must be an Array');
		if (canvases.length < 3)
			throw new Error('There must be at least 3 canvases');

		super();
		this.contexts = canvases.map(function(canvas) {
			return canvas.getContext('2d');
		});
		this.canvases = canvases;
		this.background = this.contexts[0];
		this.foreground = this.contexts[1];
		this.turtleContext = this.contexts[2];
		this.setDimensions(width, height);
	}

	clear() {
		const s = 10000;
		this.foreground.clearRect(0, 0, s, s);
	}

	clearScreen(c) {
		const s = 10000;
		this.background.fillStyle = c.toString();
		this.background.fillRect(-s, -s, s * 2, s * 2);
	}

	copyToSingleCanvas(canvas) {
		if (!(canvas instanceof Element))
			throw new Error('canvas must be an Element');
		canvas.setAttribute('width', this.width);
		canvas.setAttribute('height', this.height);
		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, this.width, this.height);
		this.canvases.forEach(function(canvas) {
			ctx.drawImage(canvas, 0, 0);
		});
	}

	getForegroundCanvas() {
		return this.canvases[1];
	}

	setDimensions(width, height) {
		if (!isNumber(width))
			throw new Error('width must be a number');
		if (!isNumber(height))
			throw new Error('height must be a number');
		this.width = width;
		this.height = height;
	}
};