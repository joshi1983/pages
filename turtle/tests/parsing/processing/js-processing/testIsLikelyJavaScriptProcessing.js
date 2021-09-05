import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { isLikelyJavaScriptProcessing } from
'../../../../modules/parsing/processing/js-processing/isLikelyJavaScriptProcessing.js';
import { javascript2DCanvasExamples } from
'../../../helpers/parsing/javascript2DCanvasExamples.js';
import { javascriptProcessingExamples } from
'../../../helpers/parsing/javascriptProcessingExamples.js';
import { processingExamples } from
'../../../helpers/parsing/processingExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

const nonExamples = javascript2DCanvasExamples.slice();
ArrayUtils.pushAll(nonExamples, processingExamples);

export function testIsLikelyJavaScriptProcessing(logger) {
	const cases = [];
	javascriptProcessingExamples.forEach(function(code) {
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
	testInOutPairs(cases, isLikelyJavaScriptProcessing, logger);
};