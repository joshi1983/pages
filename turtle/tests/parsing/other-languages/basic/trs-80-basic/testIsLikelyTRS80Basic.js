import { ArrayUtils } from
'../../../../../modules/ArrayUtils.js';
import { applesoftExamples } from
'../../../../helpers/parsing/basic/applesoftExamples.js';
import { bbcBasicExamples } from
'../../../../helpers/parsing/basic/bbcBasicExamples.js';
import { isLikelyTRS80Basic } from
'../../../../../modules/parsing/other-languages/basic/trs-80-basic/isLikelyTRS80Basic.js';
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

const nonExamples = ArrayUtils.combine(applesoftExamples,
bbcBasicExamples, microAExamples, qbasicExamples,
sinclairBasicExamples, tektronix405XExamples, trueBasicExamples);

export function testIsLikelyTRS80Basic(logger) {
	const cases = [];
	nonExamples.forEach(function(content) {
		cases.push({
			'in': content,
			'out': false
		});
	});
	trs80BasicExamples.forEach(function(content) {
		cases.push({
			'in': content,
			'out': true
		});
	});
	testInOutPairs(cases, isLikelyTRS80Basic, logger);
};