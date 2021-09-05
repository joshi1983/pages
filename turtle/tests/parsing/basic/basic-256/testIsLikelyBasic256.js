import { applesoftExamples } from
'../../../helpers/parsing/basic/applesoftExamples.js';
import { basic256Examples } from
'../../../helpers/parsing/basic/basic256Examples.js';
import { basilBasicExamples } from
'../../../helpers/parsing/basic/basilBasicExamples.js';
import { bbcBasicExamples } from
'../../../helpers/parsing/basic/bbcBasicExamples.js';
import { commodoreBasicExamples } from
'../../../helpers/parsing/basic/commodoreBasicExamples.js';
import { isLikelyBasic256 } from
'../../../../modules/parsing/basic/basic-256/isLikelyBasic256.js';
import { pBasicExamples } from
'../../../helpers/parsing/basic/pBasicExamples.js';
import { pythonTurtleExampleFiles } from
'../../../helpers/parsing/pythonTurtleExampleFiles.js';
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

export function testIsLikelyBasic256(logger) {
	const cases = [
	];
	basilBasicExamples.concat(bbcBasicExamples).concat(qbasicExamples).
	concat(applesoftExamples).concat(commodoreBasicExamples).
	concat(pBasicExamples).concat(pythonTurtleExampleFiles).concat(sinclairBasicExamples).concat(smallVisualBasicExamples).concat(trueBasicExamples).
	forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	basic256Examples.forEach(function(content) {
		cases.push({
			'in': content,
			'out': true
		});
	});
	testInOutPairs(cases, isLikelyBasic256, logger);
};