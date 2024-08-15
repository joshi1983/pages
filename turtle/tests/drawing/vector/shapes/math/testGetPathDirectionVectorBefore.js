import { ArcShape } from
'../../../../../modules/drawing/vector/shapes/ArcShape.js';
import { getPathDirectionVectorBefore } from
'../../../../../modules/drawing/vector/shapes/math/getPathDirectionVectorBefore.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { Vector } from
'../../../../../modules/drawing/vector/Vector.js';
import { Vector3D } from
'../../../../../modules/drawing/vector/Vector3D.js';

export function testGetPathDirectionVectorBefore(logger) {
	const cases = [{
		'elements': [new Vector3D(0, 0, 0), new Vector3D(0, 100, 0)],
		'out': [0, 1, 0]
	}, {
		'elements': [new Vector3D(0, 0, 0), new Vector3D(0, -100, 0)],
		'out': [0, -1, 0]
	}, {
		'elements': [new Vector3D(0, 0, 0), new Vector3D(100, 0, 0)],
		'out': [1, 0, 0]
	}, {
		'elements': [new Vector3D(0, 0, 0), new Vector3D(100, 100, 0)],
		'out': [Math.cos(Math.PI / 4), Math.cos(Math.PI / 4), 0]
	}, {
		'elements': [new ArcShape(new Vector3D(0, 0, 0), 0, 0.0001, Math.PI), new Vector3D(100, 0, 0)],
		// shouldn't be exactly this but should be very close:
		'out': [1, 0, 0]
	}];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const elements = caseInfo.elements;
		const result = getPathDirectionVectorBefore(elements, 1);
		if (!(result instanceof Vector3D))
			plogger(`Expected result to be a Vector3D but got ${result}`);
		else {
			const expected = new Vector3D(caseInfo.out);
			const d = Vector.euclideanDistance(result.minus(expected).coords);
			if (d > 0.00001) {
				plogger(`Expected ${expected} but got ${result} which has a distance of ${d}.`);
			}
		}
	});
};