import { Vector3D } from './Vector3D.js';

export class Matrix3D extends Array {
	constructor() {
		if (arguments.length === 0)
			super([1, 0, 0], [0, 1, 0], [0, 0, 1]);
		else if (arguments.length === 3)
			super(...arguments);
		else if (arguments.length === 1)
			super(...arguments[0]);
		else
			throw new Error('Either 0, 1, or 3 arguments required but got ' + arguments.length);
	}

	static getRotationMatrix1(angle) {
		// the pitch matrix
		const cosTheta = Math.cos(angle);
		const sinTheta = Math.sin(angle);
		return new Matrix3D(
			[1, 0, 0],
			[0, cosTheta, -sinTheta],
			[0, sinTheta, cosTheta]
		);
	}

	static getRotationMatrix2(angle) {
		// the roll matrix
		const cosTheta = Math.cos(angle);
		const sinTheta = Math.sin(angle);
		return new Matrix3D(
			[cosTheta, 0, sinTheta],
			[0, 1, 0],
			[-sinTheta, 0, cosTheta]
		);
	}

	static getRotationMatrix3(angle) {
		// heading matrix
		const cosTheta = Math.cos(angle);
		const sinTheta = Math.sin(angle);
		return new Matrix3D(
			[cosTheta, -sinTheta, 0],
			[sinTheta, cosTheta, 0],
			[0, 0, 1]
		);
	}

	static createFromRotations(angle1, angle2, angle3) {
		return Matrix3D.multiply(
			Matrix3D.multiply(
				Matrix3D.getRotationMatrix3(angle3),
				Matrix3D.getRotationMatrix2(angle2)
			),
			Matrix3D.getRotationMatrix1(angle1)
		);
	}

	static multiplyWithVector(m, v) {
		if (m.length !== 3) {
			throw new Error('The matrix must have a width of 3 to multiply by a 3D vector');
		}
		const coords = v.coords;
		return new Vector3D([
			coords[0] * m[0][0] + coords[1] * m[1][0] + coords[2] * m[2][0],
			coords[0] * m[0][1] + coords[1] * m[1][1] + coords[2] * m[2][1],
			coords[0] * m[0][2] + coords[1] * m[1][2] + coords[2] * m[2][2]
		]);
	}

	static multiply(m1, m2) {
		if (m1.length !== m2[0].length) {
			throw new Error('Matrix multiplication requires dimensions to match. ' + m1.length + " must equal " + m2[0].length);
		}
		let result = [];
		for (var i = 0; i < m1.length; i++) {
			result.push([]);
			for (var j = 0; j < m1[0].length; j++) {
				// calculate m1's row dot m2's column.
				let cellResult = 0;
				for (var i2 = 0; i2 < m1.length; i2++) {
					cellResult += m1[i2][j] * m2[i][i2];
				}
				result[i].push(cellResult);
			}
		}
		return result;
	}
};