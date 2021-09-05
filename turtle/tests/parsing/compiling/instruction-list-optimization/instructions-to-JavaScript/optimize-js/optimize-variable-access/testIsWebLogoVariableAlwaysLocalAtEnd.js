import { flatten } from
'../../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { getWebLogoVariablesFromJS } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimize-variable-access/getWebLogoVariablesFromJS.js';
import { isWebLogoVariableAlwaysLocalAtEnd } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimize-variable-access/isWebLogoVariableAlwaysLocalAtEnd.js';
import { MaybeDecided } from
'../../../../../../../modules/MaybeDecided.js';
import { parse } from
'../../../../../../../modules/parsing/js-parsing/parse.js';
import { prefixWrapper } from
'../../../../../../helpers/prefixWrapper.js';

export function testIsWebLogoVariableAlwaysLocalAtEnd(logger) {
	const cases = [
	{'code': 'let x = context.readVariable("x");', 'checks': [
		{'name': 'x', 'out': MaybeDecided.Maybe}
	]},
	{'code': 'let x = context.readVariable("x");', 'checks': [
		{'name': 'x', 'out': MaybeDecided.Maybe}
	]},
	{'code': 'let x = localVariables.get("x");', 'checks': [
		{'name': 'x', 'out': MaybeDecided.Yes}
	]},
	{'code': `let x = context.readVariable("x");
x = localVariables.get("x");`, 'checks': [
		{'name': 'x', 'out': MaybeDecided.Yes}
	]},
	{'code': `let x = context.readVariable("x");
if (Math.random() < 0.5) {
x = localVariables.get("x");
}`, 'checks': [
		{'name': 'x', 'out': MaybeDecided.Maybe}
	]},
	{'code': `let x = context.readVariable("x");
context.localmake("x", 4);`, 'checks': [
		{'name': 'x', 'out': MaybeDecided.Yes}
	]},
	{'code': `let x = context.readVariable("x");
context.getCurrentExecutingProcedure().localVariables.set("x", 3);`, 'checks': [
		{'name': 'x', 'out': MaybeDecided.Yes}
	]},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const allTokens = flatten(parseResult.root);
		const info = getWebLogoVariablesFromJS(allTokens);
		caseInfo.checks.forEach(function(checkInfo, cIndex) {
			const clogger = prefixWrapper(`Check ${cIndex}, name=${checkInfo.name}`, plogger);
			const varInfo = info.get(checkInfo.name);
			if (varInfo === undefined)
				clogger(`Expected to get variable information by the name ${checkInfo.name} but did not find any`);
			else {
				const result = isWebLogoVariableAlwaysLocalAtEnd(varInfo);
				if (result !== checkInfo.out)
					clogger(`Expected to get a result of ${MaybeDecided.stringify(checkInfo.out)} but got ${MaybeDecided.stringify(result)} which is the number ${result}`);
			}
		});
	});
};