import { isDynamicVariableNameMakeAssignment } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isDynamicVariableNameMakeAssignment.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsDynamicVariableNameMakeAssignment(logger) {
	const cases = [
	{'code': '', 'numResults': 0},
	{'code': 'let x = 4', 'numResults': 0},
	{'code': 'f()', 'numResults': 0},
	{'code': 'context.f()', 'numResults': 0},
	{'code': 'context.make', 'numResults': 0},
	{'code': 'context.make(', 'numResults': 0},
	{'code': 'context.make()', 'numResults': 0},
	{'code': 'context.make("x")', 'numResults': 0},
	{'code': 'context.make("x", 4)', 'numResults': 0},
	{'code': 'c.set("x", 4)', 'numResults': 0},
	{'code': 'context.localmake(this.validateString(context.valueStack[context.valueStack.length - 2]),context.valueStack[context.valueStack.length - 1])',
	'numResults': 1},
	{'code': 'localVariables.set(this.validateString(context.valueStack[context.valueStack.length - 2]),context.valueStack[context.valueStack.length - 1])',
	'numResults': 1},
	{'code': 'globalVariables.set(this.validateString(context.valueStack[context.valueStack.length - 2]),context.valueStack[context.valueStack.length - 1])',
	'numResults': 1},
	{'code': 'context.make(this.validateString(context.valueStack[context.valueStack.length - 2]),context.valueStack[context.valueStack.length - 1])',
	'numResults': 1},
	{'code': `context.make("animationratio",1);
	context.valueStack.push( context.readVariable("animationratio") <= 0.5);`, 'numResults': 0},
	{'code': `let animationratio = context.readVariable("animationratio");
	animationratio= animationratio * 2 ;
	context.turtle.print(animationratio );
	context.make("animationratio", animationratio);`, 'numResults': 0},
	{'code': `context.make("animationratio",1 - context.readVariable("animationratio") );`, 'numResults': 0},
	{'code': `let animationratio = context.readVariable("animationratio");
	animationratio= animationratio * 2 ;
	context.turtle.print(animationratio );
	context.make("animationratio", animationratio);`, 'numResults': 0}
	];
	processTokenCheckTests(cases, isDynamicVariableNameMakeAssignment, logger);
};