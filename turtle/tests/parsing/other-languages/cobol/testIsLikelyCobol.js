import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { cobolExamples } from
'../../../helpers/parsing/cobolExamples.js';
import { isLikelyCobol } from
'../../../../modules/parsing/other-languages/cobol/isLikelyCobol.js';
import { povRayExamples } from '../../../helpers/parsing/povRayExamples.js';
import { prologExamples } from '../../../helpers/parsing/prologExamples.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';

const nonExamples = ArrayUtils.combine(povRayExamples, prologExamples);

export function testIsLikelyCobol(logger) {
	const cases = nonExamples.map(function(code) {
		return {
			'in': code,
			'out': false
		};
	});
	cobolExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': true
		});
	});
	testInOutPairs(cases, isLikelyCobol, logger);
};