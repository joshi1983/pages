import { codeHeartTurtleScriptExamples } from
'../../helpers/parsing/codeHeartTurtleScriptExamples.js';
import { isLikelyKojo } from
'../../../modules/parsing/kojo/isLikelyKojo.js';
import { kojoExamples } from
'../../helpers/parsing/kojoExamples.js';
import { pythonTurtleExampleFilesContent } from
'../../helpers/parsing/pythonTurtleExampleFilesContent.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';

export function testIsLikelyKojo(logger) {
	const cases = [];
	pythonTurtleExampleFilesContent.concat(codeHeartTurtleScriptExamples).forEach(function(code) {
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