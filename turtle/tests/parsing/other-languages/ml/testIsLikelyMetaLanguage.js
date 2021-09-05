import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { batchExamples } from
'../../../helpers/parsing/batchExamples.js';
import { codeHeartTurtleScriptExamples } from
'../../../helpers/parsing/codeHeartTurtleScriptExamples.js';
import { glslExamples } from
'../../../helpers/parsing/shaders/glslExamples.js';
import { haskellExamples } from
'../../../helpers/parsing/haskellExamples.js';
import { holyCExamples } from
'../../../helpers/parsing/holyCExamples.js';
import { isLikelyMetaLanguage } from
'../../../../modules/parsing/other-languages/ml/isLikelyMetaLanguage.js';
import { kojoExamples } from
'../../../helpers/parsing/kojoExamples.js';
import { kotlinExamples } from
'../../../helpers/parsing/kotlinExamples.js';
import { kturtleExamples } from
'../../../helpers/parsing/kturtleExamples.js';
import { luaExamples } from
'../../../helpers/parsing/luaExamples.js';
import { mlExamples } from
'../../../helpers/parsing/ml/mlExamples.js';
import { modula2Examples } from
'../../../helpers/parsing/modula2Examples.js';
import { pythonTurtleExampleFilesContent } from
'../../../helpers/parsing/pythonTurtleExampleFilesContent.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { turtleGraphicsFunExamples } from
'../../../helpers/parsing/turtleGraphicsFunExamples.js';

export function testIsLikelyMetaLanguage(logger) {
	const cases = [];
	ArrayUtils.combine(batchExamples, codeHeartTurtleScriptExamples,
	glslExamples, haskellExamples, holyCExamples, kojoExamples, kotlinExamples,
	kturtleExamples, luaExamples, modula2Examples,
	pythonTurtleExampleFilesContent, turtleGraphicsFunExamples).
	forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	mlExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': true
		});
	});
	testInOutPairs(cases, isLikelyMetaLanguage, logger);
};