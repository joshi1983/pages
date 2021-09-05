import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { applesoftExamples } from
'../../../helpers/parsing/basic/applesoftExamples.js';
import { bbcBasicExamples } from
'../../../helpers/parsing/basic/bbcBasicExamples.js';
import { isLikelyTexasInstruments99_4a } from
'../../../../modules/parsing/basic/texas-instruments-99-4a/isLikelyTexasInstruments99_4a.js';
import { qbasicExamples } from
'../../../helpers/parsing/basic/qbasicExamples.js';
import { sinclairBasicExamples } from
'../../../helpers/parsing/basic/sinclairBasicExamples.js';
import { tektronix405XExamples } from
'../../../helpers/parsing/basic/tektronix405XExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { texasInstruments99_4aExamples } from
'../../../helpers/parsing/basic/texasInstruments99_4aExamples.js';
import { trs80BasicExamples } from
'../../../helpers/parsing/basic/trs80BasicExamples.js';

const nonExamples = [];
ArrayUtils.pushAll(nonExamples, applesoftExamples);
ArrayUtils.pushAll(nonExamples, bbcBasicExamples);
ArrayUtils.pushAll(nonExamples, qbasicExamples);
ArrayUtils.pushAll(nonExamples, sinclairBasicExamples);
ArrayUtils.pushAll(nonExamples, tektronix405XExamples);
ArrayUtils.pushAll(nonExamples, trs80BasicExamples);

export function testIsLikelyTexasInstruments99_4a(logger) {
	const cases = [];
	nonExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	texasInstruments99_4aExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': true
		});
	});
	testInOutPairs(cases, isLikelyTexasInstruments99_4a, logger);
};