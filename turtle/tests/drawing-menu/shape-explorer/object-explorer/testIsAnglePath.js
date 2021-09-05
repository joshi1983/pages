import { isAnglePath } from '../../../../modules/drawing-menu/shape-explorer/object-explorer/isAnglePath.js';

export function testIsAnglePath(logger) {
	const cases = [
		['x', false],
		['rotation.x', false],
		['rotation', true],
		['rotation1', true],
		['angle', true],
		['angle1', true],
		['angle2', true],
	];
	cases.forEach(function(caseInfo, index) {
		const result = isAnglePath(caseInfo[0]);
		if (result !== caseInfo[1])
			logger(`Case ${index} expected ${caseInfo[1]} but got ${result}`);
	});
};