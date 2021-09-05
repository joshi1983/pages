import { applesoftExamples } from
'../../../../helpers/parsing/basic/applesoftExamples.js';
import { ArrayUtils } from
'../../../../../modules/ArrayUtils.js';
import { bbcBasicExamples } from
'../../../../helpers/parsing/basic/bbcBasicExamples.js';
import { chipmunkBasicExamples } from
'../../../../helpers/parsing/basic/chipmunkBasicExamples.js';
import { htBasicExamples } from
'../../../../helpers/parsing/basic/htBasicExamples.js';
import { isLikelyTrueBasic } from
'../../../../../modules/parsing/other-languages/basic/true-basic/isLikelyTrueBasic.js';
import { microAExamples } from
'../../../../helpers/parsing/basic/microAExamples.js';
import { qbasicExamples } from
'../../../../helpers/parsing/basic/qbasicExamples.js';
import { sinclairBasicExamples } from
'../../../../helpers/parsing/basic/sinclairBasicExamples.js';
import { tektronix405XExamples } from
'../../../../helpers/parsing/basic/tektronix405XExamples.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { trs80BasicExamples } from
'../../../../helpers/parsing/basic/trs80BasicExamples.js';
import { trueBasicExamples } from
'../../../../helpers/parsing/basic/trueBasicExamples.js';
import { vbDotNetExamples } from
'../../../../helpers/parsing/basic/vbDotNetExamples.js';

const nonExamples = ArrayUtils.combine(applesoftExamples, bbcBasicExamples,
chipmunkBasicExamples, htBasicExamples, microAExamples,
qbasicExamples, sinclairBasicExamples, tektronix405XExamples,
trs80BasicExamples, vbDotNetExamples);

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