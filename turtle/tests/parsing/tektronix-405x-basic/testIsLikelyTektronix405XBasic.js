import { bbcBasicExamples } from
'../../helpers/parsing/bbcBasicExamples.js';
import { isLikelyTektronix405XBasic } from
'../../../modules/parsing/tektronix-405x-basic/isLikelyTektronix405XBasic.js';
import { qbasicExamples } from
'../../helpers/parsing/qbasicExamples.js';
import { tektronix405XExamples } from
'../../helpers/parsing/tektronix405XExamples.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

const nonExamples = qbasicExamples.concat(bbcBasicExamples);

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
