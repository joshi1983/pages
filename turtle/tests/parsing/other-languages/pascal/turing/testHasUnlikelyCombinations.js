import { hasUnlikelyCombinations } from
'../../../../../modules/parsing/other-languages/pascal/turing/isLikelyTuring.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { turingExamples } from
'../../../../helpers/parsing/pascal/turingExamples.js';

export function testHasUnlikelyCombinations(logger) {
	const cases = [
		{'in': 'module x end x', 'out': false},
		{'in': 'module x ', 'out': true},
		{'in': 'if x < 2 then end if', 'out': false},
		{'in': 'module x end module', 'out': true},
		{'in': 'module x\nend module', 'out': true},
		{'in': 'if x < 2 then', 'out': true},
		{'in': 'IF x < 2 then', 'out': true},
	];
	turingExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	testInOutPairs(cases, hasUnlikelyCombinations, logger);
};