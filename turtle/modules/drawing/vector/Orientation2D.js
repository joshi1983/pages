import { AbstractOrientation } from './AbstractOrientation.js';
import { Vector3D } from './Vector3D.js';

/*
Orientation2D is a simpler and slightly more efficient alternative to the Orientation class for use when pitch and roll are 0.
*/
export class Orientation2D extends AbstractOrientation {
	constructor() {
		super(...arguments);
	}

	clone() {
		return new Orientation2D(this);
	}

	getDataTransferObject() {
		return this.headingRadians;
	}

	getPitchRadians() {
		return 0;
	}

	getRollRadians() {
		return 0;
	}

	isInitial() {
		return this.headingRadians === 0;
	}

	reset() {
		super.setHeadingRadians(0);
	}

	rotate(v3d) {
		if (this.m === undefined) {
			const angleRadians = -this.headingRadians;
			this.m = {
				'cosA': Math.cos(angleRadians),
				'sinA': Math.sin(angleRadians)
			};
		}
		const cosA = this.m.cosA;
		const sinA = this.m.sinA;
		return new Vector3D(
			v3d.coords[0] * cosA - v3d.coords[1] * sinA,
			v3d.coords[1] * cosA + v3d.coords[0] * sinA,
			0
		);
	}
};