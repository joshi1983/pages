import { amosBasicExamples } from
'../../../helpers/parsing/basic/amosBasicExamples.js';
import { applesoftExamples } from
'../../../helpers/parsing/basic/applesoftExamples.js';
import { bbcBasicExamples } from
'../../../helpers/parsing/basic/bbcBasicExamples.js';
import { commodoreBasicExamples } from
'../../../helpers/parsing/basic/commodoreBasicExamples.js';
import { isLikelySinclairBasic } from
'../../../../modules/parsing/basic/sinclair-basic/isLikelySinclairBasic.js';
import { microAExamples } from
'../../../helpers/parsing/basic/microAExamples.js';
import { qbasicExamples } from
'../../../helpers/parsing/basic/qbasicExamples.js';
import { sinclairBasicExamples } from
'../../../helpers/parsing/basic/sinclairBasicExamples.js';
import { smallVisualBasicExamples } from
'../../../helpers/parsing/basic/smallVisualBasicExamples.js';
import { tektronix405XExamples } from
'../../../helpers/parsing/basic/tektronix405XExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsLikelySinclairBasic(logger) {
	const cases = [];
	qbasicExamples.concat(amosBasicExamples).concat(applesoftExamples).concat(bbcBasicExamples).
	concat(commodoreBasicExamples).concat(microAExamples).concat(smallVisualBasicExamples).
	concat(tektronix405XExamples).
	forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	sinclairBasicExamples.forEach(function(content) {
		cases.push({
			'in': content,
			'out': true
		});
	});
	testInOutPairs(cases, isLikelySinclairBasic, logger);
};