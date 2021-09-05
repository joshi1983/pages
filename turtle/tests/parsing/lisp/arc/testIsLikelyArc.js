import { arcExamples } from
'../../../helpers/parsing/lisp/arcExamples.js';
import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { basic256Examples } from
'../../../helpers/parsing/basic/basic256Examples.js';
import { isLikelyArc } from
'../../../../modules/parsing/lisp/arc/isLikelyArc.js';
import { processingExamples } from
'../../../helpers/parsing/processingExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
const nonExamples = [];
ArrayUtils.pushAll(nonExamples, basic256Examples);
ArrayUtils.pushAll(nonExamples, processingExamples);

export function testIsLikelyArc(logger) {
	// all the examples in tests/data/logo-scripts/kturtle should be found to be likely.
	const cases = [
		{'in': '', 'out': false},
	];
	nonExamples.forEach(function(code) {
		cases.push({'in': code, 'out': false});
	});
	arcExamples.forEach(function(code) {
		cases.push({'in': code, 'out': true});
	});
	testInOutPairs(cases, isLikelyArc, logger);
};