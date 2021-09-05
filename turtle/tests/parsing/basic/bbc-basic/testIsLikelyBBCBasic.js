import { applesoftExamples } from
'../../../helpers/parsing/basic/applesoftExamples.js';
import { bbcBasicExamples } from
'../../../helpers/parsing/basic/bbcBasicExamples.js';
import { commodoreBasicExamples } from
'../../../helpers/parsing/basic/commodoreBasicExamples.js';
import { isLikelyBBCBasic } from
'../../../../modules/parsing/basic/bbc-basic/isLikelyBBCBasic.js';
import { qbasicExamples } from
'../../../helpers/parsing/basic/qbasicExamples.js';
import { sinclairBasicExamples } from
'../../../helpers/parsing/basic/sinclairBasicExamples.js';
import { smallVisualBasicExamples } from
'../../../helpers/parsing/basic/smallVisualBasicExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { trueBasicExamples } from
'../../../helpers/parsing/basic/trueBasicExamples.js';

export function testIsLikelyBBCBasic(logger) {
	const cases = [
	];
	qbasicExamples.concat(applesoftExamples).concat(commodoreBasicExamples).
	concat(sinclairBasicExamples).concat(smallVisualBasicExamples).
	concat(trueBasicExamples).
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