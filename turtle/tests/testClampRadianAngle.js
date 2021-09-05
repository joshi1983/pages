import { clampRadianAngle } from '../modules/clampRadianAngle.js';

export function testClampRadianAngle(logger) {
	const cases = [
		{'in': 0, 'out': 0},
		{'in': -1, 'out': 2 * Math.PI - 1},
		{'in': 2 * Math.PI, 'out': 0},
		{'in': -10, 'out': 4 * Math.PI - 10},
		{'in': 10, 'out': 10 - 2 * Math.PI}
	];
	cases.forEach(function(caseInfo) {
		const result = clampRadianAngle(caseInfo.in);
		if (result !== caseInfo.out)
			logger(`Expected clampRadianAngle(${caseInfo.in}) to return ${caseInfo.out} but got ${result}`);
	});
};