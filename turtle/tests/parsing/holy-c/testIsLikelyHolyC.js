import { holyCExamples } from
'../../helpers/parsing/holyCExamples.js';
import { isLikelyHolyC } from
'../../../modules/parsing/holy-c/isLikelyHolyC.js';
import { logoInterpreterExamples } from
'../../helpers/parsing/logoInterpreterExamples.js';
import { terrapinExamples } from
'../../helpers/parsing/terrapinExamples.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

const nonExamples = logoInterpreterExamples.concat(terrapinExamples);

export function testIsLikelyHolyC(logger) {
	const cases = [];
	holyCExamples.forEach(function(code) {
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
	testInOutPairs(cases, isLikelyHolyC, logger);
};