import { ansiBasicExamples } from
'../../../../helpers/parsing/basic/ansiBasicExamples.js';
import { applesoftExamples } from
'../../../../helpers/parsing/basic/applesoftExamples.js';
import { ArrayUtils } from
'../../../../../modules/ArrayUtils.js';
import { basic256Examples } from
'../../../../helpers/parsing/basic/basic256Examples.js';
import { basilBasicExamples } from
'../../../../helpers/parsing/basic/basilBasicExamples.js';
import { bazzBasicExamples } from
'../../../../helpers/parsing/basic/bazzBasicExamples.js';
import { bbcBasicExamples } from
'../../../../helpers/parsing/basic/bbcBasicExamples.js';
import { commodoreBasicExamples } from
'../../../../helpers/parsing/basic/commodoreBasicExamples.js';
import { htBasicExamples } from
'../../../../helpers/parsing/basic/htBasicExamples.js';
import { isLikelyLibertyBasic } from
'../../../../../modules/parsing/other-languages/basic/liberty-basic/isLikelyLibertyBasic.js';
import { libertyBasicExamples } from
'../../../../helpers/parsing/basic/libertyBasicExamples.js';
import { microAExamples } from
'../../../../helpers/parsing/basic/microAExamples.js';
import { pBasicExamples } from
'../../../../helpers/parsing/basic/pBasicExamples.js';
import { qbasicExamples } from
'../../../../helpers/parsing/basic/qbasicExamples.js';
import { sinclairBasicExamples } from
'../../../../helpers/parsing/basic/sinclairBasicExamples.js';
import { smallVisualBasicExamples } from
'../../../../helpers/parsing/basic/smallVisualBasicExamples.js';
import { tektronix405XExamples } from
'../../../../helpers/parsing/basic/tektronix405XExamples.js';
import { texasInstruments99_4aExamples } from
'../../../../helpers/parsing/basic/texasInstruments99_4aExamples.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { trs80BasicExamples } from
'../../../../helpers/parsing/basic/trs80BasicExamples.js';
import { trueBasicExamples } from
'../../../../helpers/parsing/basic/trueBasicExamples.js';

const nonExamples = ArrayUtils.combine(ansiBasicExamples,applesoftExamples,
basic256Examples, basilBasicExamples, bazzBasicExamples,
bbcBasicExamples, commodoreBasicExamples, htBasicExamples,
microAExamples, pBasicExamples, qbasicExamples,
sinclairBasicExamples, smallVisualBasicExamples, tektronix405XExamples,
texasInstruments99_4aExamples, trs80BasicExamples, trueBasicExamples);

export function testIsLikelyLibertyBasic(logger) {
	const cases = [
	];
	nonExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	libertyBasicExamples.forEach(function(content) {
		cases.push({
			'in': content,
			'out': true
		});
	});
	testInOutPairs(cases, isLikelyLibertyBasic, logger);
};