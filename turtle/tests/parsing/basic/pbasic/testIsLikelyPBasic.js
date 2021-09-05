import { ansiBasicExamples } from
'../../../helpers/parsing/basic/ansiBasicExamples.js';
import { applesoftExamples } from
'../../../helpers/parsing/basic/applesoftExamples.js';
import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { bbcBasicExamples } from
'../../../helpers/parsing/basic/bbcBasicExamples.js';
import { commodoreBasicExamples } from
'../../../helpers/parsing/basic/commodoreBasicExamples.js';
import { isLikelyPBasic } from
'../../../../modules/parsing/basic/pbasic/isLikelyPBasic.js';
import { microAExamples } from
'../../../helpers/parsing/basic/microAExamples.js';
import { pBasicExamples } from
'../../../helpers/parsing/basic/pBasicExamples.js';
import { playBasicExamples } from
'../../../helpers/parsing/basic/playBasicExamples.js';
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
import { trs80BasicExamples } from
'../../../helpers/parsing/basic/trs80BasicExamples.js';
import { trueBasicExamples } from
'../../../helpers/parsing/basic/trueBasicExamples.js';

const nonExamples = [];
for (const examples of [ansiBasicExamples, applesoftExamples, bbcBasicExamples,
commodoreBasicExamples, microAExamples, playBasicExamples, qbasicExamples,
sinclairBasicExamples, smallVisualBasicExamples, tektronix405XExamples,
trs80BasicExamples, trueBasicExamples]) {
	ArrayUtils.pushAll(nonExamples, examples);
}

export function testIsLikelyPBasic(logger) {
	const cases = pBasicExamples.map(function(code) {
		return {'in': code, 'out': true};
	});
	nonExamples.forEach(function(content) {
		cases.push({
			'in': content,
			'out': false
		});
	});
	testInOutPairs(cases, isLikelyPBasic, logger);
};