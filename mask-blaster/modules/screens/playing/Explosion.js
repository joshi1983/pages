import { clamp } from '../../clamp.js';
import { MaskZVelocity } from './Mask.js';
const shotLength = 4;

const explosionSpeed = 0.01;

export class Explosion {
	constructor(x, y, z, isDud) {
		if (typeof z !== 'number')
			throw new Error(`z must be a number but found z=${z}`);
		if (typeof isDud !== 'boolean')
			throw new Error(`isDud must be boolean but found isDud=${isDud}`);

		this.x = x;
		this.y = y;
		this.z = z;
		this.size = 0;
		this.maxOpacity = 1;
		this.isDud = isDud;
	}

	render(context2D, width, height, viewpoint) {
		const numSlices = 1;
		const scale = width / this.z;
		const dx = viewpoint.x - this.x;
		const dy = viewpoint.y - this.y;

		const cx = width / 2 + scale * dx;
		const cy = height / 2 + scale * dy;
		const radius = scale * this.size;
		if (radius < 0)
			throw new Error(`negative radius.  radius=${radius}, scale=${scale}, this.size=${this.size}, this.z=${this.z}`);
		const oldOperation = context2D.globalCompositeOperation;
		context2D.globalCompositeOperation = 'lighter';
		
		context2D.globalAlpha = this.maxOpacity;

		let colours = ['#fff', 'rgba(255, 255, 200, 0.2)'];
		if (this.isDud)
			colours = ['#fff', 'rgba(0, 200, 255, 0.2)'];

		for (let i = 0; i < colours.length; i++) {
			const colour = colours[i];
			let ratio = (i + 1) / colours.length;
			ratio = Math.pow(ratio, 1.1);
			const radius1 = radius * ratio;
			context2D.fillStyle = colour;
			context2D.beginPath();
			context2D.arc(cx, cy, radius1, 0, Math.PI * 2);
			context2D.fill();
			context2D.closePath();
		}
		context2D.globalAlpha = 1;
		context2D.globalCompositeOperation = oldOperation;
	}

	simulateTime(interval) {
		this.z -= interval * MaskZVelocity;
		this.size += interval * explosionSpeed;
		let fadeFactor;
		if (this.isDud)
			fadeFactor = 0.01;
		else
			fadeFactor = 0.005;
		this.maxOpacity *= Math.max(0.1, 1 - interval * fadeFactor);
	}
};