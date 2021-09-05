import { adaExamples } from
'../../../helpers/parsing/adaExamples.js';
import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { bcplExamples } from
'../../../helpers/parsing/bcplExamples.js';
import { cssExamples } from
'../../../helpers/parsing/cssExamples.js';
import { forthExamples } from
'../../../helpers/parsing/forthExamples.js';
import { haskellExamples } from
'../../../helpers/parsing/haskellExamples.js';
import { hpglExamples } from
'../../../helpers/parsing/hpglExamples.js';
import { isLikelyPerl } from
'../../../../modules/parsing/other-languages/perl/isLikelyPerl.js';
import { luaExamples } from
'../../../helpers/parsing/luaExamples.js';
import { perlExamples } from
'../../../helpers/parsing/perlExamples.js';
import { povRayExamples } from
'../../../helpers/parsing/povRayExamples.js';
import { processingExamples } from
'../../../helpers/parsing/processingExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

const nonExamples = ArrayUtils.combine(adaExamples,
bcplExamples, cssExamples,
forthExamples, haskellExamples, hpglExamples, luaExamples,
povRayExamples, processingExamples);

export function testIsLikelyPerl(logger) {
	const cases = perlExamples.map(code => {
		return {
			'in': code,
			'out': true
		};
	});
	nonExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	
	testInOutPairs(cases, isLikelyPerl, logger);
};