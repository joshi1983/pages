import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { codeHeartTurtleScriptExamples } from
'../../../helpers/parsing/codeHeartTurtleScriptExamples.js';
import { isLikelyKojo } from
'../../../../modules/parsing/other-languages/kojo/isLikelyKojo.js';
import { kojoExamples } from
'../../../helpers/parsing/kojoExamples.js';
import { kotlinExamples } from
'../../../helpers/parsing/kotlinExamples.js';
import { pythonTurtleExampleFilesContent } from
'../../../helpers/parsing/pythonTurtleExampleFilesContent.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { turtleGraphicsFunExamples } from
'../../../helpers/parsing/turtleGraphicsFunExamples.js';

export function testIsLikelyKojo(logger) {
	const cases = [];
	ArrayUtils.combine(codeHeartTurtleScriptExamples, kotlinExamples,
	pythonTurtleExampleFilesContent, turtleGraphicsFunExamples).
	forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	kojoExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': true
		});
	});
	testInOutPairs(cases, isLikelyKojo, logger);
};