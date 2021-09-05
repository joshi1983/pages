import { flatten } from
'../../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { getWebLogoVariablesFromJS } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimize-variable-access/getWebLogoVariablesFromJS.js';
import { isUnsafeToReplaceReferencesWithJSVariable } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimize-variable-access/isUnsafeToReplaceReferencesWithJSVariable.js';
import { parse } from
'../../../../../../../modules/parsing/js-parsing/parse.js';
import { prefixWrapper } from
'../../../../../../helpers/prefixWrapper.js';

export function testIsUnsafeToReplaceReferencesWithJSVariable(logger) {
	const cases = [
	{'code': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
let x = localVariables.get("x");
context.localmake("x",1);`,
'checks': [
	{'name': 'x', 'out': false}
]},
	{'code': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
let x = localVariables.get("x");
localVariables.set("x",1);`,
'checks': [
	{'name': 'x', 'out': false}
]},
	{'code': `let x = context.readVariable("x");
context.localmake("x",1);
context.make("x",1);`,
'checks': [
	{'name': 'x', 'out': false}
]},
	{'code': `let x = context.readVariable("x");
context.make("x",1);
context.localmake("x",1);`,
'checks': [
	{'name': 'x', 'out': true}
]},
	{'code': `let x = context.readVariable("x");
if (Math.random() < 0.4) {context.make("x",1);}
context.localmake("x",1);`,
'checks': [
	{'name': 'x', 'out': true}
]},
	{'code': `let x = context.readVariable("x");
if (Math.random() < 0.4) {context.localmake("x",1);}
context.make("x",1);
context.localmake("x",1);`,
'checks': [
	{'name': 'x', 'out': true}
]}
	];
	cases.forEach(function(caseInfo, index) {
		const parseResult = parse(caseInfo.code);
		const allTokens = flatten(parseResult.root);
		const variables = getWebLogoVariablesFromJS(allTokens);
		const plogger = prefixWrapper(`Case ${index}`, logger);
		caseInfo.checks.forEach(function(checkInfo, cIndex) {
			const clogger = prefixWrapper(`Check ${cIndex}, name=${checkInfo.name}`, plogger);
			const info = variables.get(checkInfo.name);
			if (info === undefined)
				clogger(`Expected there to be information for a variable named ${checkInfo.name} but found none.`);
			else {
				const result = isUnsafeToReplaceReferencesWithJSVariable(info);
				if (result !== checkInfo.out) {
					clogger(`Expected ${checkInfo.out} but got ${result}`);
				}
			}
		});
	});
};