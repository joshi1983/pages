import { mayBeFinalVariableAssignment } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/mayBeFinalVariableAssignment.js';
import { processTokenCheckTests } from
'./processTokenCheckTests.js';

export function testMayBeFinalVariableAssignment(logger) {
	const cases = [
	{'code': '', 'numResults': 0},
	{'code': `context.localmake("zx",1)`,
	'numResults': 0},
	{'code': `context.localmake("zx","x")`,
	'numResults': 0},
	{'code': `context.localmake("zx",x)`,
	'numResults': 1},
	{'code': `context.localmake("zx",zx)`,
	'numResults': 1},
	];
	processTokenCheckTests(cases, mayBeFinalVariableAssignment, logger);
};