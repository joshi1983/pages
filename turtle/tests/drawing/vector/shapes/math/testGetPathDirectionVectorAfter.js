import { ArcShape } from
'../../../../../modules/drawing/vector/shapes/ArcShape.js';
import { getPathDirectionVectorAfter } from
'../../../../../modules/drawing/vector/shapes/math/getPathDirectionVectorAfter.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { Vector } from
'../../../../../modules/drawing/vector/Vector.js';
import { Vector3D } from
'../../../../../modules/drawing/vector/Vector3D.js';

export function testGetPathDirectionVectorAfter(logger) {
	const cases = [{
		'elements': [new Vector3D(0, 0, 0), new Vector3D(0, 100, 0)],
		'out': [0, -1, 0]
	}, {
		'elements': [new Vector3D(0, 0, 0), new Vector3D(0, -100, 0)],
		'out': [0, 1, 0]
	}, {
		'elements': [new Vector3D(0, 0, 0), new Vector3D(100, 0, 0)],
		'out': [-1, 0, 0]
	}, {
		'elements': [new Vector3D(0, 0, 0), new Vector3D(100, 100, 0)],
		'out': [-Math.cos(Math.PI / 4), -Math.cos(Math.PI / 4), 0]
	}];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const elements = caseInfo.elements;

		// push [0] to more realistically simulate what will be found in a PathShape.
		// 0 will never be an index requested of getPathDirectionVectorAfter.
		elements.unshift(new Vector3D(0, 0, 0));

		const result = getPathDirectionVectorAfter(elements, 1);
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