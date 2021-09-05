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
import { isLikelyMicroABasic } from
'../../../../modules/parsing/basic/micro-a/isLikelyMicroABasic.js';
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
import { texasInstruments99_4aExamples } from
'../../../helpers/parsing/basic/texasInstruments99_4aExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { trs80BasicExamples } from
'../../../helpers/parsing/basic/trs80BasicExamples.js';
import { trueBasicExamples } from
'../../../helpers/parsing/basic/trueBasicExamples.js';

const nonExamples = [];
for (const nonExamplesPart of [ansiBasicExamples,applesoftExamples,
bbcBasicExamples, commodoreBasicExamples,
qbasicExamples, sinclairBasicExamples, smallVisualBasicExamples, tektronix405XExamples,
texasInstruments99_4aExamples, trs80BasicExamples, trueBasicExamples]) {
	ArrayUtils.pushAll(nonExamples, nonExamplesPart);
}

export function testIsLikelyMicroABasic(logger) {
	const cases = [
		{'in': 'make "x 1\nmake "y 2\nswap\n"x "\y', 'out': false}, // could be WebLogo code.
	];
	nonExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	microAExamples.forEach(function(content) {
		cases.push({
			'in': content,
			'out': true
		});
	});
	testInOutPairs(cases, isLikelyMicroABasic, logger);
};