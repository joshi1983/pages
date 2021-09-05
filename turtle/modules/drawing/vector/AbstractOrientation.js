import { clampRadianAngle } from '../../clampRadianAngle.js';
import { isNumber } from '../../isNumber.js';

export class AbstractOrientation {
	constructor() {
		this.headingRadians = 0;
		this.m = undefined;
		if (arguments.length !== 0) {
			if (arguments.length === 1) {
				if (isNumber(arguments[0])) {
					this.headingRadians = clampRadianAngle(arguments[0]);
				}
				else if (arguments[0] instanceof AbstractOrientation) {
					const other = arguments[0];
					this.headingRadians = other.headingRadians;
				}
				else
					throw new Error(
						'If 1 argument is passed to Orientation2D constructor, is must be a number or AbstractOrientation. [0] = '
						+ arguments[0]);
			}
			else
				throw new Error('Invalid arguments.  Either 0 or 1 arguments expected but got '
				+ arguments.length);
		}
	}

	getHeadingRadians() {
		return this.headingRadians;
	}

	setHeadingRadians(newHeading) {
		this.headingRadians = clampRadianAngle(newHeading);
		this.m = undefined; // clear cache.
	}
};