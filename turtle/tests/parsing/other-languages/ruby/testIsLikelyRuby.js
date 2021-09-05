import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { isLikelyRuby } from
'../../../../modules/parsing/other-languages/ruby/isLikelyRuby.js';
import { kojoExamples } from
'../../../helpers/parsing/kojoExamples.js';
//import { kturtleExamples } from
//'../../../helpers/parsing/kturtleExamples.js';
import { pythonTurtleExampleFilesContent } from
'../../../helpers/parsing/pythonTurtleExampleFilesContent.js';
import { rubyExamples } from
'../../../helpers/parsing/rubyExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { turtleGraphicsFunExamples } from
'../../../helpers/parsing/turtleGraphicsFunExamples.js';

const nonExamples = ArrayUtils.combine(kojoExamples, //kturtleExamples,
pythonTurtleExampleFilesContent, turtleGraphicsFunExamples);

export function testIsLikelyRuby(logger) {
	const cases = [];
	rubyExamples.forEach(function(code) {
		cases.push({'in': code, 'out': true});
	});
	nonExamples.forEach(function(code) {
		cases.push({'in': code, 'out': false});
	});
	testInOutPairs(cases, isLikelyRuby, logger);
};