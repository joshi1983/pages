import { modula2Examples } from
'../../helpers/parsing/modula2Examples.js';
import { isLikelyModula2 } from
'../../../modules/parsing/modula-2/isLikelyModula2.js';
import { processingExamples } from '../../helpers/parsing/processingExamples.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

const nonExamples = processingExamples;

export function testIsLikelyModula2(logger) {
	const cases = [];
	modula2Examples.forEach(function(code) {
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
	testInOutPairs(cases, isLikelyModula2, logger);
};