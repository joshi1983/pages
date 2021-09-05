import { isLikelyTurtleToyNet } from
'../../../modules/parsing/turtletoy-net/isLikelyTurtleToyNet.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';
import { turtleGraphicsFunExamples } from
'../../helpers/parsing/turtleGraphicsFunExamples.js';
import { turtleToyNetExamples } from
'../../helpers/parsing/turtleToyNetExamples.js';

export function testIsLikelyTurtleToyNet(logger) {
	const cases = [
	];
	turtleGraphicsFunExamples.forEach(function(code) {
		cases.push({'in': code, 'out': false});
	});
	turtleToyNetExamples.forEach(function(code) {
		cases.push({'in': code, 'out': true});
	});
	
	testInOutPairs(cases, isLikelyTurtleToyNet, logger);
};