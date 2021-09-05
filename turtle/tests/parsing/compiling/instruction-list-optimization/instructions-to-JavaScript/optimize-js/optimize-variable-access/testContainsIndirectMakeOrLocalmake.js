import { containsIndirectMakeOrLocalmake } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimize-variable-access/containsIndirectMakeOrLocalmake.js';
import { testInOutPairs } from
'../../../../../../helpers/testInOutPairs.js';

export function testContainsIndirectMakeOrLocalmake(logger) {
	const cases = [
	{'in': '', 'out': false},
	{'in': 'f(4, 3)', 'out': false},
	{'in': 'localmake("x", 4)', 'out': false},
	{'in': 'context.localmake("x", 4)', 'out': false},
	{'in': 'context.localmake(f(), 4)', 'out': true}
	];
	testInOutPairs(cases, containsIndirectMakeOrLocalmake, logger);
};