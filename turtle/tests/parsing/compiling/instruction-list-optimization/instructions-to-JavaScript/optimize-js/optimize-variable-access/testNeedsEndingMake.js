import { flatten } from
'../../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { getWebLogoVariablesFromJS } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimize-variable-access/getWebLogoVariablesFromJS.js';
import { needsEndingMake } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimize-variable-access/needsEndingMake.js';
import { parse } from '../../../../../../../modules/parsing/js-parsing/parse.js';
import { prefixWrapper } from '../../../../../../helpers/prefixWrapper.js';

export function testNeedsEndingMake(logger) {
	const cases = [
	{'code': 'let x = localVariables.get("x");', 'checks': [
		{'name': 'x', 'numMakeTokens': 0, 'result': false}
	]},
	{'code': 'let x = localVariables.get("x"); x=4;', 'checks': [
		{'name': 'x', 'numMakeTokens': 0, 'result': true}
	]},
	{'code': 'let x = localVariables.get("x");\nif (Math.random() < 0.5) {\nx=4;\n}', 'checks': [
		{'name': 'x', 'numMakeTokens': 0, 'result': true}
	]},
	{'code': 'let x = localVariables.get("x");\nif (Math.random() < 0.5) {\nx=4;\n}\nif (Math.random() < 0.5) {context.make("x", 5);}', 'checks': [
		{'name': 'x', 'numMakeTokens': 1, 'result': true}
	]},
	{'code': 'let x = localVariables.get("x"); x=4;context.make("x", 5)', 'checks': [
		{'name': 'x', 'numMakeTokens': 1, 'result': false}
	]},
	{'code': `let animationratio = context.readVariable("animationratio");
if (animationRatio > 0.5) {
	context.make("animationratio", 1 - animationratio);
}
context.make("animationratio", animationRatio * 2);

context.turtle.print(animationratio);
`, 'checks': [
		{'name': 'animationratio', 'numMakeTokens': 2, 'result': false}
	]},
	{'code': `let animationratio = context.readVariable("animationratio");
if (animationRatio > 0.5) {
	context.make("animationratio", 1 - animationratio);
}
animationratio = animationRatio * 2;

context.turtle.print(animationratio);
`, 'checks': [
		{'name': 'animationratio', 'numMakeTokens': 1, 'result': true}
	]},
	{'code': `const localVariables = context.getCurrentExecutingProcedure().localVariables;
let column = localVariables.get("column");
let numintervals = localVariables.get("numintervals");


localVariables. set("radius",context.math.mix( localVariables.get("maxradius"), localVariables.get("minradius"),( column - 1) / 5));
numintervals= column - 1 ;
context.valueStack.push( numintervals <= 2);

if (!context.valueStack.pop()) {
numintervals=4 - numintervals ;
}



localVariables. set("totalintervals",( numintervals * 2) + 1);
localVariables. set("pos1",context.turtle.pos());
context.turtle.jumpForward( numintervals * localVariables.get("vseparation") );
context.valueStack.push(localVariables. get("totalintervals"));`, 'checks': [
		{'name': 'numintervals', 'numMakeTokens': 0, 'result': true},
		{'name': 'column', 'numMakeTokens': 0, 'result': false},
	]}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const allTokens = flatten(parseResult.root);
		const variablesInfo = getWebLogoVariablesFromJS(allTokens);
		caseInfo.checks.forEach(function(checkInfo, cIndex) {
			const clogger = prefixWrapper(`Check ${cIndex}, name=${checkInfo.name}`, plogger);
			const varInfo = variablesInfo.get(checkInfo.name);
			if (typeof varInfo !== 'object')
				clogger(`Expected to find variable information but found ${varInfo}`);
			else {
				if (checkInfo.numMakeTokens !== undefined && varInfo.makeTokens.length !== checkInfo.numMakeTokens)
					clogger(`Expected number of makeTokens to be ${checkInfo.numMakeTokens} but got ${varInfo.makeTokens.length}`);
				const checkResult = needsEndingMake(varInfo);
				if (checkResult !== checkInfo.result)
					clogger(`Expected needsEndingMake result to be ${checkInfo.result} but got ${checkResult}`);
			}
		});
	});
};