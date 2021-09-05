import { applesoftExamples } from
'../../../helpers/parsing/basic/applesoftExamples.js';
import { bbcBasicExamples } from
'../../../helpers/parsing/basic/bbcBasicExamples.js';
import { commodoreBasicExamples } from
'../../../helpers/parsing/basic/commodoreBasicExamples.js';
import { isLikelyTektronix405XBasic } from
'../../../../modules/parsing/basic/tektronix-405x-basic/isLikelyTektronix405XBasic.js';
import { microAExamples } from
'../../../helpers/parsing/basic/microAExamples.js';
import { qbasicExamples } from
'../../../helpers/parsing/basic/qbasicExamples.js';
import { sinclairBasicExamples } from
'../../../helpers/parsing/basic/sinclairBasicExamples.js';
import { tektronix405XExamples } from
'../../../helpers/parsing/basic/tektronix405XExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { trs80BasicExamples } from
'../../../helpers/parsing/basic/trs80BasicExamples.js';

const nonExamples = applesoftExamples.
	concat(applesoftExamples).
	concat(bbcBasicExamples).
	concat(commodoreBasicExamples).
	concat(microAExamples).
	concat(qbasicExamples).
	concat(sinclairBasicExamples).
	concat(trs80BasicExamples);

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
