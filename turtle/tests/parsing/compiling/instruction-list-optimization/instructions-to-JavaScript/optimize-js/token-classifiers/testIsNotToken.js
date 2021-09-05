import { isNotToken } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isNotToken.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsNotToken(logger) {
	const cases = [
		{'code': '', 'numResults': 0},
		{'code': `x`, 'numResults': 0},
		{'code': `1`, 'numResults': 0},
		{'code': `true`, 'numResults': 0},
		{'code': `!x`, 'numResults': 1},
		{'code': `context(x)`, 'numResults': 0},
		{'code': `context.math(x)`, 'numResults': 0},
		{'code': `!context.math.randomRatio()`, 'numResults': 1},
		{'code': `!!x`, 'numResults': 2},
		{'code': `context.math.not(x)`, 'numResults': 1},
		{'code': `context.math.not(!x)`, 'numResults': 2},
		{'code': `!context.math.not(x)`, 'numResults': 2},
	];
	processTokenCheckTests(cases, isNotToken, logger);
};