import { isIdentifierReadToken } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isIdentifierReadToken.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsIdentifierReadToken(logger) {
	const cases = [
	{
		'code': '', 'numResults': 0
	}, {
		'code': 'context.localmake("x", 0)', 'numResults': 0
	}, {
		'code': 'x = 1', 'numResults': 0
	}, {
		'code': 'x = y', 'numResults': 1
	}, {
		'code': 'context.turtle.forward(x)', 'numResults': 1
	}, {
		'code': 'let x = context.readVariable("x")', 'numResults': 0
	}];
	processTokenCheckTests(cases, isIdentifierReadToken, logger);
};