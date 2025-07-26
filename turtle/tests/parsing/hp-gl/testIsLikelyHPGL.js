import { ArrayUtils } from
'../../../modules/ArrayUtils.js';
import { hpglExamples } from
'../../helpers/parsing/hpglExamples.js';
import { isLikelyHPGL } from
'../../../modules/parsing/hp-gl/isLikelyHPGL.js';
import { povRayExamples } from '../../helpers/parsing/povRayExamples.js';
import { processingExamples } from '../../helpers/parsing/processingExamples.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

const nonExamples = [];
const arrays = [povRayExamples, processingExamples];
for (const array of arrays) {
	ArrayUtils.pushAll(nonExamples, array);
}

export function testIsLikelyHPGL(logger) {
	const cases = hpglExamples.map(code => {
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
	
	testInOutPairs(cases, isLikelyHPGL, logger);
};