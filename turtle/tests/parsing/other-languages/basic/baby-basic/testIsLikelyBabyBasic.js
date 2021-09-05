import { ansiBasicExamples } from
'../../../../helpers/parsing/basic/ansiBasicExamples.js';
import { applesoftExamples } from
'../../../../helpers/parsing/basic/applesoftExamples.js';
import { ArrayUtils } from
'../../../../../modules/ArrayUtils.js';
import { babyBasicExamples } from
'../../../../helpers/parsing/basic/babyBasicExamples.js';
import { bbcBasicExamples } from
'../../../../helpers/parsing/basic/bbcBasicExamples.js';
import { commodoreBasicExamples } from
'../../../../helpers/parsing/basic/commodoreBasicExamples.js';
import { isLikelyBabyBasic } from
'../../../../../modules/parsing/other-languages/basic/baby-basic/isLikelyBabyBasic.js';
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

const nonExamples = ArrayUtils.combine(ansiBasicExamples, applesoftExamples,
bbcBasicExamples, commodoreBasicExamples, qbasicExamples, sinclairBasicExamples,
smallVisualBasicExamples, tektronix405XExamples, turingExamples);

export function testIsLikelyBabyBasic(logger) {
	const cases = [
	];
	babyBasicExamples.forEach(function(code) {
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
	testInOutPairs(cases, isLikelyBabyBasic, logger);
};