import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { groovyExamples } from
'../../../helpers/parsing/groovyExamples.js';
import { isLikelyGroovy } from
'../../../../modules/parsing/other-languages/groovy/isLikelyGroovy.js';
import { kojoExamples } from
'../../../helpers/parsing/kojoExamples.js';
import { kturtleExamples } from
'../../../helpers/parsing/kturtleExamples.js';
import { pythonTurtleExampleFilesContent } from
'../../../helpers/parsing/pythonTurtleExampleFilesContent.js';
import { rubyExamples } from
'../../../helpers/parsing/rubyExamples.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { turtleGraphicsFunExamples } from
'../../../helpers/parsing/turtleGraphicsFunExamples.js';

const nonExamples = ArrayUtils.combine(kojoExamples, kturtleExamples,
pythonTurtleExampleFilesContent, rubyExamples, turtleGraphicsFunExamples);

export function testIsLikelyGroovy(logger) {
	const cases = [];
	groovyExamples.forEach(function(code) {
		cases.push({'in': code, 'out': true});
	});
	nonExamples.forEach(function(code) {
		cases.push({'in': code, 'out': false});
	});
	testInOutPairs(cases, isLikelyGroovy, logger);
};