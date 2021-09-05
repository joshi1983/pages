import { JavaScriptInstruction } from '../../../../../modules/parsing/execution/instructions/JavaScriptInstruction.js';
import { mergeJavaScriptInstructions } from '../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/mergeJavaScriptInstructions.js';
import { ParseTreeToken } from '../../../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { PushInstruction } from '../../../../../modules/parsing/execution/instructions/PushInstruction.js';

const token = new ParseTreeToken(null, null, 0, 0, ParseTreeTokenType.TREE_ROOT);

function codeToJSInstruction(code) {
	return new JavaScriptInstruction(code, token);
}

export function testMergeJavaScriptInstructions(logger) {
	const cases = [
		{'in': [], 'outLength': 0},
		{'in': [
			codeToJSInstruction('x')
		], 'outLength': 1},
		{
			'in': [
				codeToJSInstruction('x'),
				codeToJSInstruction('y')
			], 'outLength': 1,
			'checks': [
				{'index': 0, 'code': 'x;\ny;'}
			]
		},
		{'in': [
			codeToJSInstruction('x'),
			new PushInstruction(5, token, false),
			codeToJSInstruction('y')
		], 'outLength': 3},
		{'in': [
			`context.make("animationratio",1);
context.valueStack.push(context.readVariable("animationratio") <= 0.5);`,
			`if (!context.valueStack.pop()) {
context.make("animationratio",1 - context.globalVariables.get("animationratio") );
}`,
			`let animationratio = context.readVariable("animationratio");
animationratio= animationratio * 2 ;
context.turtle.print(animationratio );
context.make("animationratio", animationratio);`
		].map(codeToJSInstruction),
			'outLength': 1,
			'checks': [
			]
		}
	];
	cases.forEach(function(caseInfo, index) {
		mergeJavaScriptInstructions(caseInfo.in);
		const plogger = prefixWrapper(`Case ${index}`, logger);
		if (caseInfo.in.length !== caseInfo.outLength)
			plogger(`Length expected to become ${caseInfo.outLength} but got length ${caseInfo.in.length}`);
		else if (caseInfo.checks instanceof Array) {
			caseInfo.checks.forEach(function(checkInfo) {
				const actualCode = caseInfo.in[checkInfo.index].code;
				if (actualCode !== checkInfo.code)
					plogger(`Instruction index ${checkInfo.index}.  Expected code of ${checkInfo.code} but got ${actualCode}`);
			});
		}
	});
};