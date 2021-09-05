import { isThisMethodCall } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isThisMethodCall.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsThisMethodCall(logger) {
	const cases = [
		{'code': '', 'numResults': 0},
		{'code': `this.x`, 'numResults': 0},
		{'code': `this.x()`, 'numResults': 1},
		{'code': `this.x.y()`, 'numResults': 0},
		{'code': `this.x(2)`, 'numResults': 1},
		{'code': `this.x(this.y(123))`, 'numResults': 2},
		{'code': `context.turtle.setPenColor(this.convertToColour("black"))`, 'numResults': 1},
	];
	processTokenCheckTests(cases, isThisMethodCall, logger);
};