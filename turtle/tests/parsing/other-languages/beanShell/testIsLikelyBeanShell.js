import { adaExamples } from
'../../../helpers/parsing/adaExamples.js';
import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { bcplExamples } from
'../../../helpers/parsing/bcplExamples.js';
import { beanShellExamples } from
'../../../helpers/parsing/beanShellExamples.js';
import { cExamples } from
'../../../helpers/parsing/cExamples.js';
import { cppExamples } from
'../../../helpers/parsing/cppExamples.js';
import { cSharpExamples } from
'../../../helpers/parsing/cSharpExamples.js';
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
import { isLikelyBeanShell } from
'../../../../modules/parsing/other-languages/beanShell/isLikelyBeanShell.js';
import { luaExamples } from
'../../../helpers/parsing/luaExamples.js';
import { povRayExamples } from
'../../../helpers/parsing/povRayExamples.js';
import { processingExamples } from
'../../../helpers/parsing/processingExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

const nonExamples = ArrayUtils.combine(adaExamples,
bcplExamples, cExamples, cppExamples, cSharpExamples,
cssExamples, dartExamples,
forthExamples, haskellExamples, hpglExamples, luaExamples,
povRayExamples, processingExamples);

export function testIsLikelyBeanShell(logger) {
	const cases = beanShellExamples.map(code => {
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
	
	testInOutPairs(cases, isLikelyBeanShell, logger);
};