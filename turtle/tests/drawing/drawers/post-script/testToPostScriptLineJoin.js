import { LineJoinStyle } from '../../../../modules/drawing/vector/shapes/style/LineJoinStyle.js';
import { toPostScriptLineJoin } from '../../../../modules/drawing/drawers/post-script/toPostScriptLineJoin.js';

export function testToPostScriptLineJoin(logger) {
	const cases = [
		{'in': LineJoinStyle.Miter, 'num': 0},
		{'in': LineJoinStyle.Round, 'num': 1},
		{'in': LineJoinStyle.Bevel, 'num': 2}
	];
	cases.forEach(function(caseInfo) {
		const result = toPostScriptLineJoin(caseInfo.in);
		if (result !== caseInfo.num)
			logger(`Expected ${caseInfo.num} for input ${caseInfo.in} with name ${LineJoinStyle.getNameFor(caseInfo.in)} but got ${result}`);
	});
};