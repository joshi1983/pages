import { cgjenningsExamples } from
'../../../helpers/parsing/l-systems/cgjenningsExamples.js';
import { fractintExamples } from
'../../../helpers/parsing/l-systems/fractintExamples.js';
import { isLikelyCGJennings } from
'../../../../modules/parsing/l-systems/cgjennings/isLikelyCGJennings.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { zeroLExamples } from
'../../../helpers/parsing/l-systems/zeroLExamples.js';

export function testIsLikelyCGJennings(logger) {
	const cases = [];
	fractintExamples.concat(zeroLExamples).
	forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	cgjenningsExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': true
		});
	});
	testInOutPairs(cases, isLikelyCGJennings, logger);
};