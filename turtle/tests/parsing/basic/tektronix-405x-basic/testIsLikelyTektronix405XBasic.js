import { applesoftExamples } from
'../../../helpers/parsing/basic/applesoftExamples.js';
import { bbcBasicExamples } from
'../../../helpers/parsing/basic/bbcBasicExamples.js';
import { isLikelyTektronix405XBasic } from
'../../../../modules/parsing/basic/tektronix-405x-basic/isLikelyTektronix405XBasic.js';
import { qbasicExamples } from
'../../../helpers/parsing/basic/qbasicExamples.js';
import { tektronix405XExamples } from
'../../../helpers/parsing/basic/tektronix405XExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

const nonExamples = qbasicExamples.
	concat(bbcBasicExamples).
	concat(applesoftExamples);

export function testIsLikelyTektronix405XBasic(logger) {
	const cases = [];
	nonExamples.forEach(function(content) {
		cases.push({
			'in': content,
			'out': false
		});
	});
	tektronix405XExamples.forEach(function(content) {
		cases.push({
			'in': content,
			'out': true
		});
	});
	testInOutPairs(cases, isLikelyTektronix405XBasic, logger);
};
