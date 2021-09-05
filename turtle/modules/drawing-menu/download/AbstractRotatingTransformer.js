import { Vector2D } from '../../drawing/vector/Vector2D.js';
import { Vector3D } from '../../drawing/vector/Vector3D.js';

export class AbstractRotatingTransformer {
	constructor(mode, initialAngle) {
		this.mode = mode;
		this.angle = initialAngle;
		this.startTime = (new Date).getTime();
	}

	dispose() {
		clearInterval(this.t);
		this.t = undefined;
	}

	getAngleRadians() {
		const time = (new Date).getTime();
		const elapsedMilliseconds = time - this.startTime;
		return elapsedMilliseconds * Math.PI * 2 / 5000;
	}

	static rotateXZ(v, centre, angleRadians) {
		v = v.minus(centre);
		const v2 = Vector2D.rotate(new Vector2D(v.getX(), v.getZ()), angleRadians);
		return new Vector3D(v2.getX(), v.getY(), v2.getY());
	}

	static rotateYZ(v, centre, angleRadians) {
		v = v.minus(centre);
		const v2 = Vector2D.rotate(new Vector2D(v.getY(), v.getZ()), angleRadians);
		return new Vector3D(v.getX(), v2.getX(), v2.getY());
	}

	setMode(mode) {
		if (!Number.isInteger(mode))
			throw new Error(`mode must be an integer but got ${mode}`);
		this.mode = mode;
	}
};