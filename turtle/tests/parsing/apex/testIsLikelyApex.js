import { apexExamples } from
'../../helpers/parsing/apexExamples.js';
import { ArrayUtils } from
'../../../modules/ArrayUtils.js';
import { isLikelyApex } from
'../../../modules/parsing/apex/isLikelyApex.js';
import { javascript2DCanvasExamples } from
'../../helpers/parsing/javascript2DCanvasExamples.js';
import { processingExamples } from
'../../helpers/parsing/processingExamples.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

const nonExamples = [];
for (const examples of [javascript2DCanvasExamples, processingExamples]) {
	ArrayUtils.pushAll(nonExamples, examples);
}

export function testIsLikelyApex(logger) {
	const cases = [];
	apexExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': true
		});
	});
	nonExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	testInOutPairs(cases, isLikelyApex, logger);
};