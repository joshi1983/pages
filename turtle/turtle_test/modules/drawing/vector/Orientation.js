import { AbstractOrientation } from './AbstractOrientation.js';
import { clampRadianAngle } from '../../clampRadianAngle.js';
import { isNumber } from '../../isNumber.js';
import { Matrix3D } from './Matrix3D.js';

export class Orientation extends AbstractOrientation {
	constructor() {
		if (arguments.length === 3)
			super(arguments[2]);
		else if (arguments.length === 1 && arguments[0] instanceof AbstractOrientation)
			super(arguments[0].headingRadians);
		else
			super();

		this.rollRadians = 0;
		this.pitchRadians = 0;
		if (arguments.length !== 0) {
			if (arguments.length === 3) {
				if (isNumber(arguments[0]) && isNumber(arguments[1]) && isNumber(arguments[2])) {
					this.rollRadians = clampRadianAngle(arguments[0]);
					this.pitchRadians = clampRadianAngle(arguments[1]);
				}
				else
					throw new Error(
						'If 3 arguments are passed to Orientation constructor, they must be numbers. [0] = '
						+ arguments[0] + ', [1] = ' + arguments[1] + ', [2] = ' + arguments[2]);
			}
			else if (arguments.length === 1 && arguments[0] instanceof Orientation) {
				const other = arguments[0];
				this.rollRadians = other.rollRadians;
				this.pitchRadians = other.pitchRadians;
			}
			else if (arguments.length !== 1 || !(arguments[0] instanceof Orientation2D))
				throw new Error('Invalid arguments.  Either 1 or 3 arguments expected but got '
				+ arguments.length + '.  If 1 argument, it must be an Orientation');
		}
	}

	clone() {
		return new Orientation(this);
	}

	getPitchRadians() {
		return this.pitchRadians;
	}

	getRollRadians() {
		return this.rollRadians;
	}

	isInitial() {
		return this.headingRadians === 0 &&
			this.rollRadians === 0 &&
			this.pitchRadians === 0;
	}

	rotate(v3d) {
		if (this.m === undefined)
			this.m = Matrix3D.createFromRotations(-this.pitchRadians, this.rollRadians, this.headingRadians);
		return Matrix3D.multiplyWithVector(this.m, v3d);
	}

	setPitchRadians(newPitch) {
		this.pitchRadians = clampRadianAngle(newPitch);
		this.m = undefined; // clear cache.
	}

	setRollRadians(newRoll) {
		this.rollRadians = clampRadianAngle(newRoll);
		this.m = undefined; // clear cache.
	}
};