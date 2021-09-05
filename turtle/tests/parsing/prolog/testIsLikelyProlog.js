import { isLikelyProlog } from
'../../../modules/parsing/prolog/isLikelyProlog.js';
import { prologExamples } from
'../../helpers/parsing/prologExamples.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

export function testIsLikelyProlog(logger) {
	const cases = [];
	prologExamples.forEach(function(code) {
		cases.push({'in': code, 'out': true});
	});
	testInOutPairs(cases, isLikelyProlog, logger);
};