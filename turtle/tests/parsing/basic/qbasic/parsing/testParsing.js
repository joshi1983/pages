import { testCountRepresentedParameterValues } from
'./testCountRepresentedParameterValues.js';
import { testLikelyUsesForEachLoop } from
'./testLikelyUsesForEachLoop.js';
import { testParseTreeAnalysis } from
'./parse-tree-analysis/testParseTreeAnalysis.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testParsing(logger) {
	wrapAndCall([
		testCountRepresentedParameterValues,
		testLikelyUsesForEachLoop,
		testParseTreeAnalysis
	], logger);
};