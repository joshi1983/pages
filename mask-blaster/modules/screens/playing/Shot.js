import { clamp } from '../../clamp.js';
import { MaskZVelocity } from './Mask.js';
const shotLength = 1;
const shotZVelocity = 0.001;

function getNextZ(startZ, delta) {
	return startZ + delta * shotZVelocity;
}

export class Shot {
	constructor(x, y) {
		if (typeof x !== 'number')
			throw new Error(`x must be a number but specified ${x}`);
		if (typeof y !== 'number')
			throw new Error(`y must be a number but specified ${y}`);

		this.x = x;
		this.y = y;
		this.z = 0.1;
	}

	getCollisionWithMask(mask, delta) {
		// check if the z is in range.
		const dz1 = mask.z - this.z;
		if (dz1 < 0)
			return; // shot is starting behind the mask so it can't collide.

		const dz2 = (mask.z - delta * MaskZVelocity) - getNextZ(this.z, delta);
		if (dz2 < 0) {
			// this might hit.
			const timeToCollision = delta * dz1 / (dz1 - dz2);
			const collisionPoint = {
				'x': this.x,
				'y': this.y,
				'z': getNextZ(this.z, timeToCollision)
			};
			// is collisionPoint in the mask?
			const maskInfo = mask.getInfoAtPoint(collisionPoint.x, collisionPoint.y);
			if (maskInfo !== undefined) {
				collisionPoint.maskInfo = maskInfo;
				return collisionPoint;
			}
		}
	}

	render(context2D, width, height, viewpoint) {
		const dx = viewpoint.x - this.x;
		const dy = viewpoint.y - this.y;
		const scaleFactor = width;
		const w = scaleFactor * 0.1 / this.z;
		const cx = width / 2 + scaleFactor * dx / this.z, cy = height / 2 + scaleFactor * dy / this.z;
		const left = cx - w / 2;
		const bottom = cy;
		const topX = width / 2 + scaleFactor * dx / (this.z + shotLength);
		const topY = height / 2 + scaleFactor * dy / (this.z + shotLength);
		context2D.fillStyle = '#ff8';
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
		this.z = getNextZ(this.z, delta);
	}
};