import { flatten } from '../../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { getWebLogoVariablesFromJS } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimize-variable-access/getWebLogoVariablesFromJS.js';
import { isNeedingToMoveDeclarations } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimize-variable-access/isNeedingToMoveDeclarations.js';
import { parse } from
'../../../../../../../modules/parsing/js-parsing/parse.js';
import { testInOutPairs } from
'../../../../../../helpers/testInOutPairs.js';

export function testIsNeedingToMoveDeclarations(logger) {
	const cases = [
	{'code': '',
	'out': false},
	{'code': `context.localmake("a",1);
context.valueStack.push(context.readVariable("a"));`,
	'out': false},
	{'code': `const a = context.readVariable("a");
context.turtle.print(a)`,
	'out': false},
	{'code': `context.turtle.print(a);
const a = context.readVariable("a");
context.turtle.print(a)`,
	'out': true},
	{'code': `context.turtle.print(a);
let a = context.readVariable("a");
context.turtle.print(a)`,
	'out': true},
	{'code': `if (Math.random() < 0.5) {
	let a = context.readVariable("a");
}
context.turtle.print(a)`,
	'out': true},
	];
	cases.forEach(function(caseInfo) {
		const parseResult = parse(caseInfo.code);
		const allTokens = flatten(parseResult.root);
		const variables = getWebLogoVariablesFromJS(allTokens);
		caseInfo.in = variables;
	});
	testInOutPairs(cases, isNeedingToMoveDeclarations, logger);
};