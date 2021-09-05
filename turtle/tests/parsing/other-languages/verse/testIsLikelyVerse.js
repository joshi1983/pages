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
import { glslExamples } from
'../../../helpers/parsing/shaders/glslExamples.js';
import { haskellExamples } from
'../../../helpers/parsing/haskellExamples.js';
import { hpglExamples } from
'../../../helpers/parsing/hpglExamples.js';
import { isLikelyVerse } from
'../../../../modules/parsing/other-languages/verse/isLikelyVerse.js';
import { luaExamples } from
'../../../helpers/parsing/luaExamples.js';
import { povRayExamples } from
'../../../helpers/parsing/povRayExamples.js';
import { processingExamples } from
'../../../helpers/parsing/processingExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { verseExamples } from
'../../../helpers/parsing/verseExamples.js';
import { wgslExamples } from
'../../../helpers/parsing/shaders/wgslExamples.js';

const nonExamples = ArrayUtils.combine(adaExamples,
bcplExamples, cssExamples, forthExamples, glslExamples,
haskellExamples, hpglExamples, luaExamples,
povRayExamples, processingExamples, wgslExamples);

export function testIsLikelyVerse(logger) {
	const cases = verseExamples.map(code => {
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
	
	testInOutPairs(cases, isLikelyVerse, logger);
};