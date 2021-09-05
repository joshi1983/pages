import { amosBasicExamples } from
'../../../helpers/parsing/basic/amosBasicExamples.js';
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
import { isLikelyAmosBasic } from
'../../../../modules/parsing/basic/amos-basic/isLikelyAmosBasic.js';
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

const nonAmosBasicExamples = [];
ArrayUtils.pushAll(nonAmosBasicExamples, ansiBasicExamples);
ArrayUtils.pushAll(nonAmosBasicExamples, applesoftExamples);
ArrayUtils.pushAll(nonAmosBasicExamples, bbcBasicExamples);
ArrayUtils.pushAll(nonAmosBasicExamples, commodoreBasicExamples);
ArrayUtils.pushAll(nonAmosBasicExamples, qbasicExamples);
ArrayUtils.pushAll(nonAmosBasicExamples, sinclairBasicExamples);
ArrayUtils.pushAll(nonAmosBasicExamples, smallVisualBasicExamples);
ArrayUtils.pushAll(nonAmosBasicExamples, tektronix405XExamples);

export function testIsLikelyAmosBasic(logger) {
	const cases = [
		{'in': 'fd 10', 'out': false},
		{'in': 'penUp', 'out': false},
		{'in': 'import turtle', 'out': false},
	];
	amosBasicExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': true
		});
	});
	nonAmosBasicExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	testInOutPairs(cases, isLikelyAmosBasic, logger);
};