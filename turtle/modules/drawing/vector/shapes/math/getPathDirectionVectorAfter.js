import { Vector3D } from '../../Vector3D.js';

export function getPathDirectionVectorAfter(elements, index) {
	let nextPoint = elements[index + 1];
	if (typeof nextPoint.getStartPoint === 'function')
		nextPoint = prevPoint.getStartPoint();
	const e = elements[index];
	if (e instanceof Vector3D) {
		const result = e.minus(nextPoint);
		return Vector3D.normalize(result);
	}
	// FIXME: handle case when e is an ArcShape.
	
};