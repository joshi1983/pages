import { applesoftExamples } from
'../../../../helpers/parsing/basic/applesoftExamples.js';
import { ArrayUtils } from
'../../../../../modules/ArrayUtils.js';
import { bbcBasicExamples } from
'../../../../helpers/parsing/basic/bbcBasicExamples.js';
import { commodoreBasicExamples } from
'../../../../helpers/parsing/basic/commodoreBasicExamples.js';
import { isLikelyBBCBasic } from
'../../../../../modules/parsing/other-languages/basic/bbc-basic/isLikelyBBCBasic.js';
import { qbasicExamples } from
'../../../../helpers/parsing/basic/qbasicExamples.js';
import { sinclairBasicExamples } from
'../../../../helpers/parsing/basic/sinclairBasicExamples.js';
import { smallVisualBasicExamples } from
'../../../../helpers/parsing/basic/smallVisualBasicExamples.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { trueBasicExamples } from
'../../../../helpers/parsing/basic/trueBasicExamples.js';

export function testIsLikelyBBCBasic(logger) {
	const cases = [
	];
	ArrayUtils.combine(applesoftExamples, commodoreBasicExamples,
	qbasicExamples, sinclairBasicExamples, smallVisualBasicExamples, trueBasicExamples).
	forEach(function(code) {
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