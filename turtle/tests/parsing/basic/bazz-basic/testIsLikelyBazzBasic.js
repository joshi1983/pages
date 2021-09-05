import { applesoftExamples } from
'../../../helpers/parsing/basic/applesoftExamples.js';
import { basilBasicExamples } from
'../../../helpers/parsing/basic/basilBasicExamples.js';
import { bazzBasicExamples } from
'../../../helpers/parsing/basic/bazzBasicExamples.js';
import { bbcBasicExamples } from
'../../../helpers/parsing/basic/bbcBasicExamples.js';
import { commodoreBasicExamples } from
'../../../helpers/parsing/basic/commodoreBasicExamples.js';
import { isLikelyBazzBasic } from
'../../../../modules/parsing/basic/bazz-basic/isLikelyBazzBasic.js';
import { pBasicExamples } from
'../../../helpers/parsing/basic/pBasicExamples.js';
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

export function testIsLikelyBazzBasic(logger) {
	const cases = [
	];
	basilBasicExamples.concat(bbcBasicExamples).concat(qbasicExamples).concat(applesoftExamples).
	concat(commodoreBasicExamples).
	concat(pBasicExamples).concat(sinclairBasicExamples).concat(smallVisualBasicExamples).
	concat(trueBasicExamples).
	forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	bazzBasicExamples.forEach(function(content) {
		cases.push({
			'in': content,
			'out': true
		});
	});
	testInOutPairs(cases, isLikelyBazzBasic, logger);
};