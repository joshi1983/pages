import { ArcShape } from
'../../../../../modules/drawing/vector/shapes/ArcShape.js';
import { getPathDirectionVectorAtEndOfArcShape } from
'../../../../../modules/drawing/vector/shapes/math/getPathDirectionVectorAtEndOfArcShape.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { Vector } from
'../../../../../modules/drawing/vector/Vector.js';
import { Vector3D } from
'../../../../../modules/drawing/vector/Vector3D.js';

export function testGetPathDirectionVectorAtEndOfArcShape(logger) {
	const cases = [
		{
			'in': new ArcShape(new Vector3D(0, 0, 0), 0, 1, Math.PI / 2),
			'out': [1, 0, 0]
		}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const out = caseInfo.out;
		const result = getPathDirectionVectorAtEndOfArcShape(caseInfo.in);
		if (!(result instanceof Vector3D))
			plogger(`Expected result to be an Vector3D but got ${result}`);
		else {
			const vOut = new Vector3D(out);
			const d = Vector.euclideanDistance(result.minus(vOut));
			if (d > 0.00001) {
				plogger(`Expected ${vOut} but got ${result} which is at a distance of ${d}`);
			}
		}
	});
};