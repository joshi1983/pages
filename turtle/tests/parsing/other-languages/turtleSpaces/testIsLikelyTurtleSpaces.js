import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { isLikelyTurtleSpaces } from
'../../../../modules/parsing/other-languages/turtleSpaces/isLikelyTurtleSpaces.js';
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
import { turtleSpacesExamples } from
'../../../helpers/parsing/turtleSpacesExamples.js';
import { turtleToyNetExamples } from
'../../../helpers/parsing/turtleToyNetExamples.js';

const nonExamples = ArrayUtils.combine(kojoExamples, kturtleExamples,
pythonTurtleExampleFilesContent, rubyExamples, turtleGraphicsFunExamples,
turtleToyNetExamples);

export function testIsLikelyTurtleSpaces(logger) {
	const cases = [];
	turtleSpacesExamples.forEach(function(code) {
		cases.push({'in': code, 'out': true});
	});
	nonExamples.forEach(function(code) {
		cases.push({'in': code, 'out': false});
	});
	testInOutPairs(cases, isLikelyTurtleSpaces, logger);
};