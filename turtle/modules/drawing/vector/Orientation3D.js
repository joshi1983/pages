import { AbstractOrientation } from './AbstractOrientation.js';
import { clampRadianAngle } from '../../clampRadianAngle.js';
import { isNumber } from '../../isNumber.js';
import { matrixMultiplyInPlace3By3 } from './matrixMultiplyInPlace3By3.js';
import { Vector3D } from './Vector3D.js';

export class Orientation3D extends AbstractOrientation {
	constructor() {
		super();
		this.reset();
		if (arguments.length === 1 && isNumber(arguments[0]))
			this.setHeadingRadians(arguments[0]);
	}

	clearCache() {
		this.cachedHeadingRadians = undefined;
		this.cachedPitchRadians = undefined;
		this.cachedRollRadians = undefined;
	}

	clone() {
		const result = new Orientation3D();
		const thisM = this.m;
		result.m = [
			thisM[0].slice(),
			thisM[1].slice(),
			thisM[2].slice()
		];
		result.cachedHeadingRadians = this.cachedHeadingRadians;
		result.cachedPitchRadians = this.cachedPitchRadians;
		result.cachedRollRadians = this.cachedRollRadians;
		return result;
	}

	getDataTransferObject() {
		const thisM = this.m;
		return [
			thisM[0].slice(),
			thisM[1].slice(),
			thisM[2].slice()
		];
	}

	getHeadingRadians() {
		if (this.cachedHeadingRadians === undefined) {
			const m = this.m;
			if ((1.0 - Math.abs(m[1][2])) < 0)
				this.cachedHeadingRadians = Math.atan2(m[0][1], m[0][0]);
			else
				this.cachedHeadingRadians = Math.atan2(-m[1][0], m[1][1]);
			this.cachedHeadingRadians = clampRadianAngle(this.cachedHeadingRadians);
		}
		return this.cachedHeadingRadians;
	}

	getPitchRadians() {
		if (this.cachedPitchRadians === undefined) {
			const m = this.m;
			const val12 = m[1][2];
			if ((1.0 - Math.abs(val12)) < 0.000001)
				this.cachedPitchRadians = (val12 < 0.0) ? Math.PI / 2 : Math.PI * 1.5;
			else
			{
				const val02 = m[0][2];
				const val22 = m[2][2];
				const ry = Math.atan2(-val02, val22);

				let a;
				if (Math.abs(Math.abs(ry) - Math.PI / 2) < 0.00001)
					a = val02 / Math.sin(-ry);
				else
					a = val22 / Math.cos(ry);

				this.cachedPitchRadians = Math.atan2(-val12, a);
			}
			this.cachedPitchRadians = clampRadianAngle(this.cachedPitchRadians);
		}
		return this.cachedPitchRadians;
	}

	getRollRadians() {
		if (this.cachedRollRadians === undefined) {
			const m = this.m;
			if ((1.0 - Math.abs(m[1][2])) < 0.000001)
				this.cachedRollRadians = 0;
			else
				this.cachedRollRadians = Math.atan2(m[0][2], m[2][2]);
			this.cachedRollRadians = clampRadianAngle(this.cachedRollRadians);
		}
		return this.cachedRollRadians;
	}

	isInitial() {
		return this.getHeadingRadians() === 0 &&
			this.getPitchRadians() === 0 &&
			this.getRollRadians() === 0;
	}

	pitchUp(radians) {
		this.clearCache();
		const cos = Math.cos(radians);
		const sin = Math.sin(radians);

		const rotationMatrix = [
			[1, 0, 0],
			[0, cos, -sin],
			[0, sin, cos]
		];
		matrixMultiplyInPlace3By3(this.m, rotationMatrix);
	}

	reset() {
		this.m = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
		this.cachedHeadingRadians = 0;
		this.cachedPitchRadians = 0;
		this.cachedRollRadians = 0;
	}

	right(radians) {
		this.clearCache();
		const cos = Math.cos(-radians);
		const sin = Math.sin(-radians);
		const rotationMatrix = [
			[cos, -sin, 0],
			[sin, cos, 0],
			[0, 0, 1]
		];
		matrixMultiplyInPlace3By3(this.m, rotationMatrix);
	}

	rollRight(radians) {
		this.clearCache();
		const cos = Math.cos(radians);
		const sin = Math.sin(radians);

		const rotationMatrix = [
		[cos, 0, sin],
		[0, 1, 0],
		[-sin, 0, cos]
		];
		matrixMultiplyInPlace3By3(this.m, rotationMatrix);
	}

	rotate(v3d) {
		const coords = v3d.coords;
		const m = this.m;
		const x = coords[0] * m[0][0] + coords[1] * m[0][1] + coords[2] * m[0][2];
		const y = coords[0] * m[1][0] + coords[1] * m[1][1] + coords[2] * m[1][2];
		const z = coords[0] * m[2][0] + coords[1] * m[2][1] + coords[2] * m[2][2];
		return new Vector3D(x, y, z);
	}

	setHeadingRadians(radians) {
		this.right(radians - this.getHeadingRadians());
	}

	setPitchRadians(radians) {
		this.pitchUp(radians - this.getPitchRadians());
	}

	setRollRadians(radians) {
		this.rollRight(radians - this.getRollRadians());
	}
};