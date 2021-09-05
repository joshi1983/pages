import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { TurtleDrawState } from '../../modules/drawing/TurtleDrawState.js';

export function testTurtleDrawStateEllipseArc2(logger) {
	const cases = [
		[ [90, 100, 200, 0], [0, 100, 200, 0]]
	];
	const turtleDrawState = new TurtleDrawState();
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const angle = caseInfo[0][0] * Math.PI / 180;
		const radius1 = caseInfo[0][1];
		const radius2 = caseInfo[0][2];
		const startAngle = caseInfo[0][3] * Math.PI / 180;
		const shape = turtleDrawState.ellipseArc2(angle, radius1, radius2, startAngle);
		if (typeof shape !== 'object')
			plogger(`Expected ellispeArc2 to return a shape but got ${shape}`);
	});
};