import { getPathDirectionVectorAtEndOfArcShape } from './getPathDirectionVectorAtEndOfArcShape.js';
import { Vector3D } from '../../Vector3D.js';

export function getPathDirectionVectorBefore(elements, index) {
	let prevPoint = elements[index - 1];
	if (prevPoint !== undefined && typeof prevPoint.getEndPoint === 'function')
		prevPoint = prevPoint.getEndPoint();
	const e = elements[index];
	if (e instanceof Vector3D) {
		if (prevPoint === undefined)
			return; // unable to determine.
		const result = e.minus(prevPoint);
		return Vector3D.normalize(result);
	}
	return getPathDirectionVectorAtEndOfArcShape(e);
};