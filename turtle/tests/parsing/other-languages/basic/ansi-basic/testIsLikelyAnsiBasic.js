import { ansiBasicExamples } from
'../../../../helpers/parsing/basic/ansiBasicExamples.js';
import { applesoftExamples } from
'../../../../helpers/parsing/basic/applesoftExamples.js';
import { ArrayUtils } from
'../../../../../modules/ArrayUtils.js';
import { bbcBasicExamples } from
'../../../../helpers/parsing/basic/bbcBasicExamples.js';
import { commodoreBasicExamples } from
'../../../../helpers/parsing/basic/commodoreBasicExamples.js';
import { isLikelyAnsiBasic } from
'../../../../../modules/parsing/other-languages/basic/ansi-basic/isLikelyAnsiBasic.js';
import { qbasicExamples } from
'../../../../helpers/parsing/basic/qbasicExamples.js';
import { sinclairBasicExamples } from
'../../../../helpers/parsing/basic/sinclairBasicExamples.js';
import { smallVisualBasicExamples } from
'../../../../helpers/parsing/basic/smallVisualBasicExamples.js';
import { tektronix405XExamples } from
'../../../../helpers/parsing/basic/tektronix405XExamples.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { turingExamples } from
'../../../../helpers/parsing/pascal/turingExamples.js';

const nonAnsiBasicExamples = ArrayUtils.combine(applesoftExamples,
bbcBasicExamples, commodoreBasicExamples, qbasicExamples, sinclairBasicExamples,
smallVisualBasicExamples, tektronix405XExamples, turingExamples);

export function testIsLikelyAnsiBasic(logger) {
	const cases = [
		{'in': 'fd 10', 'out': false},
		{'in': 'penUp', 'out': false},
		{'in': 'import turtle', 'out': false},
		{'in': '! here is a comment', 'out': true},
	];
	ansiBasicExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': true
		});
	});
	nonAnsiBasicExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	testInOutPairs(cases, isLikelyAnsiBasic, logger);
};