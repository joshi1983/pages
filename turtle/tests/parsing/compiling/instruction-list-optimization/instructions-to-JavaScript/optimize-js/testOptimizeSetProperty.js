import { optimizeSetProperty } from
'../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimizeSetProperty.js';
import { testInOutPairs } from '../../../../../helpers/testInOutPairs.js';

export function testOptimizeSetProperty(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': `context.plist.setProperty(result, "x", 3)`,
		'out': 'result.set ( "x", 3)'}
	];
	testInOutPairs(cases, optimizeSetProperty, logger);
};