import { applesoftExamples } from
'../../../helpers/parsing/basic/applesoftExamples.js';
import { bbcBasicExamples } from
'../../../helpers/parsing/basic/bbcBasicExamples.js';
import { commodoreBasicExamples } from
'../../../helpers/parsing/basic/commodoreBasicExamples.js';
import { basilBasicExamples } from
'../../../helpers/parsing/basic/basilBasicExamples.js';
import { isLikelyBasilBasic } from
'../../../../modules/parsing/basic/basil/isLikelyBasilBasic.js';
import { qbasicExamples } from
'../../../helpers/parsing/basic/qbasicExamples.js';
import { sinclairBasicExamples } from
'../../../helpers/parsing/basic/sinclairBasicExamples.js';
import { smallVisualBasicExamples } from
'../../../helpers/parsing/basic/smallVisualBasicExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsLikelyBasilBasic(logger) {
	const cases = [
	];
	bbcBasicExamples.concat(qbasicExamples).concat(applesoftExamples).concat(commodoreBasicExamples).
	concat(sinclairBasicExamples).concat(smallVisualBasicExamples).
	forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	basilBasicExamples.forEach(function(content) {
		cases.push({
			'in': content,
			'out': true
		});
	});
	testInOutPairs(cases, isLikelyBasilBasic, logger);
};