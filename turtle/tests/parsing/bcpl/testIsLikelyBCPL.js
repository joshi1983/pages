import { ArrayUtils } from
'../../../modules/ArrayUtils.js';
import { bcplExamples } from
'../../helpers/parsing/bcplExamples.js';
import { cssExamples } from
'../../helpers/parsing/cssExamples.js';
import { hpglExamples } from
'../../helpers/parsing/hpglExamples.js';
import { isLikelyBCPL } from
'../../../modules/parsing/bcpl/isLikelyBCPL.js';
import { povRayExamples } from
'../../helpers/parsing/povRayExamples.js';
import { processingExamples } from
'../../helpers/parsing/processingExamples.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

const nonExamples = [];
const arrays = [cssExamples, hpglExamples, povRayExamples, processingExamples];
for (const array of arrays) {
	ArrayUtils.pushAll(nonExamples, array);
}

export function testIsLikelyBCPL(logger) {
	const cases = bcplExamples.map(code => {
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
	
	testInOutPairs(cases, isLikelyBCPL, logger);
};