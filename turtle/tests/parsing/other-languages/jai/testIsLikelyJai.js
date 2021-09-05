import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { cssExamples } from '../../../helpers/parsing/cssExamples.js';
import { holyCExamples } from
'../../../helpers/parsing/holyCExamples.js';
import { hpglExamples } from
'../../../helpers/parsing/hpglExamples.js';
import { isLikelyJai } from
'../../../../modules/parsing/other-languages/jai/isLikelyJai.js';
import { jaiExamples } from
'../../../helpers/parsing/jaiExamples.js';
import { luaExamples } from
'../../../helpers/parsing/luaExamples.js';
import { povRayExamples } from '../../../helpers/parsing/povRayExamples.js';
import { processingExamples } from
'../../../helpers/parsing/processingExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

const nonExamples = ArrayUtils.combine(cssExamples,
holyCExamples, hpglExamples, luaExamples,
povRayExamples, processingExamples);

export function testIsLikelyJai(logger) {
	const cases = jaiExamples.map(code => {
		return {
			'in': code,
			'out': true
		};
	});
	nonExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	
	testInOutPairs(cases, isLikelyJai, logger);
};