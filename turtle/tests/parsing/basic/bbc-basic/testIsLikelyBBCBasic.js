import { bbcBasicExamples } from
'../../../helpers/parsing/basic/bbcBasicExamples.js';
import { isLikelyBBCBasic } from
'../../../../modules/parsing/basic/bbc-basic/isLikelyBBCBasic.js';
import { qbasicExamples } from
'../../../helpers/parsing/basic/qbasicExamples.js';
import { smallVisualBasicExamples } from
'../../../helpers/parsing/basic/smallVisualBasicExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsLikelyBBCBasic(logger) {
	const cases = [
	];
	qbasicExamples.concat(smallVisualBasicExamples).forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	bbcBasicExamples.forEach(function(content) {
		cases.push({
			'in': content,
			'out': true
		});
	});
	testInOutPairs(cases, isLikelyBBCBasic, logger);
};