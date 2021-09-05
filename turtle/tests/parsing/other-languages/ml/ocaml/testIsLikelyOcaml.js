import { ArrayUtils } from
'../../../../../modules/ArrayUtils.js';
import { batchExamples } from
'../../../../helpers/parsing/batchExamples.js';
import { codeHeartTurtleScriptExamples } from
'../../../../helpers/parsing/codeHeartTurtleScriptExamples.js';
import { glslExamples } from
'../../../../helpers/parsing/shaders/glslExamples.js';
import { holyCExamples } from
'../../../../helpers/parsing/holyCExamples.js';
import { isLikelyOcaml } from
'../../../../../modules/parsing/other-languages/ml/ocaml/isLikelyOcaml.js';
import { kojoExamples } from
'../../../../helpers/parsing/kojoExamples.js';
import { kotlinExamples } from
'../../../../helpers/parsing/kotlinExamples.js';
import { kturtleExamples } from
'../../../../helpers/parsing/kturtleExamples.js';
import { luaExamples } from
'../../../../helpers/parsing/luaExamples.js';
import { modula2Examples } from
'../../../../helpers/parsing/modula2Examples.js';
import { ocamlExamples } from
'../../../../helpers/parsing/ml/ocamlExamples.js';
import { pythonTurtleExampleFilesContent } from
'../../../../helpers/parsing/pythonTurtleExampleFilesContent.js';
import { swiftExamples } from
'../../../../helpers/parsing/swiftExamples.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { turtleGraphicsFunExamples } from
'../../../../helpers/parsing/turtleGraphicsFunExamples.js';

export function testIsLikelyOcaml(logger) {
	const cases = [];
	ArrayUtils.combine(batchExamples, codeHeartTurtleScriptExamples,
	glslExamples, holyCExamples, kojoExamples, kotlinExamples,
	kturtleExamples, luaExamples, modula2Examples,
	pythonTurtleExampleFilesContent, swiftExamples, turtleGraphicsFunExamples).
	forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	ocamlExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': true
		});
	});
	testInOutPairs(cases, isLikelyOcaml, logger);
};