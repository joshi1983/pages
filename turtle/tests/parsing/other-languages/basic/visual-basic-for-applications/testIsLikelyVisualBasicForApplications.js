import { ArrayUtils } from
'../../../../../modules/ArrayUtils.js';
import { applesoftExamples } from
'../../../../helpers/parsing/basic/applesoftExamples.js';
import { bbcBasicExamples } from
'../../../../helpers/parsing/basic/bbcBasicExamples.js';
import { isLikelyVisualBasicForApplications } from
'../../../../../modules/parsing/other-languages/basic/visual-basic-for-applications/isLikelyVisualBasicForApplications.js';
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
import { vbaExamples } from
'../../../../helpers/parsing/basic/vbaExamples.js';

const nonExamples = ArrayUtils.combine(applesoftExamples,
bbcBasicExamples, microAExamples, qbasicExamples,
sinclairBasicExamples, tektronix405XExamples, trs80BasicExamples, trueBasicExamples);

export function testIsLikelyVisualBasicForApplications(logger) {
	const cases = [];
	nonExamples.forEach(function(content) {
		cases.push({
			'in': content,
			'out': false
		});
	});
	vbaExamples.forEach(function(content) {
		cases.push({
			'in': content,
			'out': true
		});
	});
	testInOutPairs(cases, isLikelyVisualBasicForApplications, logger);
};