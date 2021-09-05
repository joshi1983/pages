import { valueTokenTypes } from '../../../parsing/isCompleteValueToken.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { PovRayCommand } from '../../../PovRayCommand.js';
import { processToken } from '../processToken.js';

function getParameterNamesFromFunctionToken(functionToken) {
	if (functionToken.children.length <= 1)
		return ['x', 'y', 'z'];
	const args = functionToken.children[0];
	const children = args.children;
	return children.filter(c => c.type === ParseTreeTokenType.IDENTIFIER).map(c => c.val);
}

function shouldIncludeOutput(token) {
	if (!valueTokenTypes.has(token.type))
		return false;
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = PovRayCommand.getCommandInfo(token.val);
		if (info !== undefined) {
			const returnTypes = PovRayCommand.getReturnTypes(info);
			if (returnTypes === null)
				return false;
		}
	}
	return true;
}

function processFunctionInstructionList(instructionList, result) {
	const children = instructionList.children;
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (i === children.length - 1 && shouldIncludeOutput(child))
			result.append('\noutput ');
		processToken(child, result);
	}
}

/*
https://wiki.povray.org/content/Reference:Function#Sum_and_Product_functions
*/
export function processFunctionDefinition(name, functionToken, result) {
	result.append(`\nto ${name}`);
	const parameterNames = getParameterNamesFromFunctionToken(functionToken);
	for (const paramName of parameterNames) {
		result.append(` :${paramName}`);
	}
	result.append('\n');
	const codeBlock = functionToken.children[functionToken.children.length - 1];
	if (codeBlock.type === ParseTreeTokenType.CODE_BLOCK) {
		for (const child of codeBlock.children) {
			if (child.type === ParseTreeTokenType.INSTRUCTION_LIST) {
				processFunctionInstructionList(child, result);
			}
		}
	}
	result.append('\nend\n');
};