import { Vector } from '../drawing/vector/Vector.js';
import { Vector3D } from '../drawing/vector/Vector3D.js';

export class LinearAlgebraCommands {
	constructor() {
		this.dot = Vector.dotProduct;
	}

	cross(val1, val2) {
		const v1 = new Vector3D(val1);
		const v2 = new Vector3D(val2);
		return Vector3D.cross(v1, v2).coords;
	}

	vectorAdd(vector1, vector2) {
		const result = [];
		for (let i = 0; i < vector1.length; i++) {
			result[i] = vector1[i] + vector2[i];
		}
		return result;
	}

	vectorProject(onToVector, fromVector) {
		if (onToVector.length !== fromVector.length)
			throw new Error(`vector lengths must be equal but given ${onToVector.length} and ${fromVector.length}`);
		const magnitudeSquared = this.dot(onToVector, onToVector);
		if (magnitudeSquared === 0)
			throw new Error('project can not be calculated because onToVector has a magnitude of 0');
		const scaleFactor = this.dot(onToVector, fromVector) / magnitudeSquared;
		const result = [];
		for (let i = 0; i < fromVector.length; i++) {
			result.push(onToVector[i] * scaleFactor);
		}
		return result;
	}

	vectorScale(vector, scaleFactor) {
		const result = [];
		for (let i = 0; i < vector.length; i++) {
			result[i] = vector[i] * scaleFactor;
		}
		return result;
	}

	vectorSubtract(vector1, vector2) {
		const result = [];
		for (let i = 0; i < vector1.length; i++) {
			result[i] = vector1[i] - vector2[i];
		}
		return result;
	}
};