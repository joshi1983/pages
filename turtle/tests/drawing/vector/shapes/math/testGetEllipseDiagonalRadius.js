import { getEllipseDiagonalRadius } from '../../../../../modules/drawing/vector/shapes/math/getEllipseDiagonalRadius.js';

export function testGetEllipseDiagonalRadius(logger) {
	const cases = [
	{'in': [0, 100, 200], 'result': 100},
	{'in': [Math.PI * 0.5, 100, 200], 'result': 200},
	{'in': [Math.PI, 100, 200], 'result': 100},
	{'in': [Math.PI * 1.5, 100, 200], 'result': 200},
	{'in': [Math.PI * 2, 100, 200], 'result': 100},
	{'in': [Math.PI * 0.25, 100, 200], 'result': 126.49110640673516}
	];
	for (let angle = Math.PI * 2; angle > 0; angle -= 0.01) {
		const r = getEllipseDiagonalRadius(angle, 100, 200);
		if (r < 100 || r > 200)
			logger(`Any diagonal passing through the centre of an ellipse of radii 100 and 200 must be with a radius in that range.  ${r} is out of range 100..200.`);
	}
	cases.forEach(function(caseInfo) {
		const result = getEllipseDiagonalRadius(...caseInfo.in);
		if (result !== caseInfo.result)
			logger(`Expected ${caseInfo.result} but got ${result}`);
	});
};