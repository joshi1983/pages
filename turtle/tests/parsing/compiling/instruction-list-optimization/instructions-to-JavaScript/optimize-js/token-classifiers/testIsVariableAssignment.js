import { isVariableAssignment } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isVariableAssignment.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsVariableAssignment(logger) {
	const cases = [
	{'code': '', 'numResults': 0},
	{'code': 'context.make("x", true);', 'numResults': 1},
	{'code': 'context.localmake("x", true);', 'numResults': 1},
	{'code': 'context.localmake("x", "hello");', 'numResults': 1},
	{'code': 'context.make("x", "hello");', 'numResults': 1},
	{'code': 'localVariables.set("x", "hello");', 'numResults': 1},
	{'code': 'globalVariables.set("x", "hello");', 'numResults': 1},
	{'code': 'context.globalVariables.set("x", "hello");', 'numResults': 1},
	];
	processTokenCheckTests(cases, isVariableAssignment, logger);
};