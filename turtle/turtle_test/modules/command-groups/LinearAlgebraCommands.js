import { linePointDistance } from './helpers/linePointDistance.js';
import { Vector } from '../drawing/vector/Vector.js';
import { Vector3D } from '../drawing/vector/Vector3D.js';
import { vectorProject } from './helpers/vectorProject.js';

export class LinearAlgebraCommands {
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

const mappings = [['dot', Vector.dotProduct], vectorProject, linePointDistance];
mappings.forEach(function(pair) {
	if (typeof pair === 'function')
		pair = [pair.name, pair];
	LinearAlgebraCommands.prototype[pair[0]] = pair[1];
});