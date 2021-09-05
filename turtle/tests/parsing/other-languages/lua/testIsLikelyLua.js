import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { chipmunkBasicExamples } from
'../../../helpers/parsing/basic/chipmunkBasicExamples.js';
import { codeHeartTurtleScriptExamples } from
'../../../helpers/parsing/codeHeartTurtleScriptExamples.js';
import { elmExamples } from
'../../../helpers/parsing/elmExamples.js';
import { haskellExamples } from
'../../../helpers/parsing/haskellExamples.js';
import { htBasicExamples } from
'../../../helpers/parsing/basic/htBasicExamples.js';
import { isLikelyLua } from
'../../../../modules/parsing/other-languages/lua/isLikelyLua.js';
import { jaiExamples } from
'../../../helpers/parsing/jaiExamples.js';
import { kojoExamples } from
'../../../helpers/parsing/kojoExamples.js';
import { kotlinExamples } from
'../../../helpers/parsing/kotlinExamples.js';
import { luaExamples } from
'../../../helpers/parsing/luaExamples.js';
import { pythonTurtleExampleFilesContent } from
'../../../helpers/parsing/pythonTurtleExampleFilesContent.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { turtleGraphicsFunExamples } from
'../../../helpers/parsing/turtleGraphicsFunExamples.js';

export function testIsLikelyLua(logger) {
	const cases = [];
	ArrayUtils.combine(chipmunkBasicExamples, codeHeartTurtleScriptExamples, elmExamples,
	haskellExamples, htBasicExamples, jaiExamples, kojoExamples, kotlinExamples,
	pythonTurtleExampleFilesContent, turtleGraphicsFunExamples).
	forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	luaExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': true
		});
	});
	testInOutPairs(cases, isLikelyLua, logger);
};