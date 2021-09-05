import { applesoftExamples } from
'../../../helpers/parsing/basic/applesoftExamples.js';
import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { bbcBasicExamples } from
'../../../helpers/parsing/basic/bbcBasicExamples.js';
import { isLikelyTrueBasic } from
'../../../../modules/parsing/basic/true-basic/isLikelyTrueBasic.js';
import { microAExamples } from
'../../../helpers/parsing/basic/microAExamples.js';
import { qbasicExamples } from
'../../../helpers/parsing/basic/qbasicExamples.js';
import { sinclairBasicExamples } from
'../../../helpers/parsing/basic/sinclairBasicExamples.js';
import { tektronix405XExamples } from
'../../../helpers/parsing/basic/tektronix405XExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { trs80BasicExamples } from
'../../../helpers/parsing/basic/trs80BasicExamples.js';
import { trueBasicExamples } from
'../../../helpers/parsing/basic/trueBasicExamples.js';

const nonExamples = [];
const arrays = [applesoftExamples, bbcBasicExamples, microAExamples,
qbasicExamples, sinclairBasicExamples, tektronix405XExamples, trs80BasicExamples];
for (const array of arrays) {
	ArrayUtils.pushAll(nonExamples, array);
}

export function testIsLikelyTrueBasic(logger) {
	const cases = [];
	nonExamples.forEach(function(content) {
		cases.push({
			'in': content,
			'out': false
		});
	});
	trueBasicExamples.forEach(function(content) {
		cases.push({
			'in': content,
			'out': true
		});
	});
	testInOutPairs(cases, isLikelyTrueBasic, logger);
};