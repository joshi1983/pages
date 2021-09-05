import { applesoftExamples } from
'../../../helpers/parsing/basic/applesoftExamples.js';
import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { atariTurboBasicXLExamples } from
'../../../helpers/parsing/basic/atariTurboBasicXLExamples.js';
import { bbcBasicExamples } from
'../../../helpers/parsing/basic/bbcBasicExamples.js';
import { commodoreBasicExamples } from
'../../../helpers/parsing/basic/commodoreBasicExamples.js';
import { isLikelyAtariTurboBasicXL } from
'../../../../modules/parsing/basic/atari-turbo-basic-xl/isLikelyAtariTurboBasicXL.js';
import { microAExamples } from
'../../../helpers/parsing/basic/microAExamples.js';
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
import { texasInstruments99_4aExamples } from
'../../../helpers/parsing/basic/texasInstruments99_4aExamples.js';

const nonExamples = [];
ArrayUtils.pushAll(nonExamples, applesoftExamples);
ArrayUtils.pushAll(nonExamples, bbcBasicExamples);
ArrayUtils.pushAll(nonExamples, commodoreBasicExamples);
ArrayUtils.pushAll(nonExamples, microAExamples);
ArrayUtils.pushAll(nonExamples, playBasicExamples);
ArrayUtils.pushAll(nonExamples, qbasicExamples);
ArrayUtils.pushAll(nonExamples, sinclairBasicExamples);
ArrayUtils.pushAll(nonExamples, smallVisualBasicExamples);
ArrayUtils.pushAll(nonExamples, tektronix405XExamples);
ArrayUtils.pushAll(nonExamples, texasInstruments99_4aExamples);

export function testIsLikelyAtariTurboBasicXL(logger) {
	const cases = [];
	atariTurboBasicXLExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': true
		});
	});
	nonExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	testInOutPairs(cases, isLikelyAtariTurboBasicXL, logger);
};