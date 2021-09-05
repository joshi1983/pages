import { adaExamples } from
'../../../helpers/parsing/adaExamples.js';
import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { qbasicExamples } from
'../../../helpers/parsing/basic/qbasicExamples.js';
import { bcplExamples } from
'../../../helpers/parsing/bcplExamples.js';
import { cssExamples } from
'../../../helpers/parsing/cssExamples.js';
import { dartExamples } from
'../../../helpers/parsing/dartExamples.js';
import { forthExamples } from
'../../../helpers/parsing/forthExamples.js';
import { haskellExamples } from
'../../../helpers/parsing/haskellExamples.js';
import { hpglExamples } from
'../../../helpers/parsing/hpglExamples.js';
import { isLikelyJoss } from
'../../../../modules/parsing/other-languages/joss/isLikelyJoss.js';
import { javaExamples } from
'../../../helpers/parsing/javaExamples.js';
import { jossExamples } from
'../../../helpers/parsing/jossExamples.js';
import { luaExamples } from
'../../../helpers/parsing/luaExamples.js';
import { povRayExamples } from
'../../../helpers/parsing/povRayExamples.js';
import { processingExamples } from
'../../../helpers/parsing/processingExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

const nonExamples = ArrayUtils.combine(adaExamples,
bcplExamples, cssExamples, dartExamples,
forthExamples, haskellExamples, hpglExamples, javaExamples, luaExamples,
povRayExamples, qbasicExamples, processingExamples);

export function testIsLikelyJoss(logger) {
	const cases = jossExamples.map(code => {
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

	testInOutPairs(cases, isLikelyJoss, logger);
};