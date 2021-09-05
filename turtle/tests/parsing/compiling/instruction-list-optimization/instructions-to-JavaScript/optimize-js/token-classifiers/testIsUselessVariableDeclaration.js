import { isUselessVariableDeclaration } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isUselessVariableDeclaration.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsUselessVariableDeclaration(logger) {
	const cases = [
	{'code': '', 'numResults': 0},
	{'code': 'let colorindex =colorindex', 'numResults': 1},
	{'code': 'let colorindex =colorindex ;', 'numResults': 1}
	];
	processTokenCheckTests(cases, isUselessVariableDeclaration, logger);
};