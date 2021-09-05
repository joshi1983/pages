import { Vector } from '../../drawing/vector/Vector.js';

export function vectorProject(onToVector, fromVector) {
	if (onToVector.length !== fromVector.length)
		throw new Error(`vector lengths must be equal but given onToVector length ${onToVector.length} and fromVector length ${fromVector.length}`);
	const magnitudeSquared = Vector.dotProduct(onToVector, onToVector);
	if (magnitudeSquared === 0)
		throw new Error('project can not be calculated because onToVector has a magnitude of 0');
	const scaleFactor = Vector.dotProduct(onToVector, fromVector) / magnitudeSquared;
	const result = [];
	for (let i = 0; i < fromVector.length; i++) {
		result.push(onToVector[i] * scaleFactor);
	}
	return result;
};