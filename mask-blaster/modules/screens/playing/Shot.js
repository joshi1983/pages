import { clamp } from '../../clamp.js';
const shotLength = 4;

export class Shot {
	constructor() {
		this.x = 0;
		this.z = 0.1;
	}

	render(context2D, width, height, viewpoint) {
		const w = (width + height) * 0.2 / this.z;
		const cx = width / 2 + w * viewpoint.x / this.z, cy = height / 2 + w * 0.5 / this.z;
		const left = cx - w / 2;
		const bottom = cy;
		const topX = cx;
		const r1 = clamp(shotLength / this.z, 0.6, 0.9);
		const r2 = 1 - r1;
		const midY = height / 2;
		const topY = height / 2 + w * 0.5 / (this.z + shotLength);
		context2D.fillStyle = '#ff8';
		//context2D.fillBlendMode = 'lighter';
		const oldOperation = context2D.globalCompositeOperation;
		context2D.globalCompositeOperation = 'lighter';
		context2D.beginPath();
		context2D.moveTo(left, bottom);
		context2D.lineTo(left + w, bottom);
		context2D.lineTo(topX, topY);
		
		context2D.fill();
		context2D.closePath();
		context2D.globalCompositeOperation = oldOperation;
	}

	simulateTime(delta) {
		this.z += delta * 0.01;
	}
};