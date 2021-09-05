import { Command } from '../../../../Command.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { PythonFunctions } from '../../../PythonFunctions.js';
await Command.asyncInit();

const bracketsNextTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR
]);
const bracketsParentTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR
]);
const goToParentTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.DOT,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.UNARY_OPERATOR,
]);

function shouldGoUp(token) {
	const next = token.getNextSibling();
	if (next !== null)
		return false;
	const parent = token.parentNode;
	return parent !== null &&
	goToParentTypes.has(parent.type);
}

export function mightBracketsBeImportantForParameters(funcCallToken, parameterValueTokens) {
	const functionName = funcCallToken.val;
	const funcInfo = PythonFunctions.getFunctionInfo(functionName);
	if (funcInfo !== undefined &&
	typeof funcInfo.translateToCommand === 'string' &&
	funcInfo.isTranslatedToProcedure !== true) {
		const commandInfo = Command.getCommandInfo(funcInfo.translateToCommand);
		if (commandInfo !== undefined) {
			const argCount = Command.getArgCount(commandInfo);
			if (argCount.isFlexible && argCount.defaultCount !== parameterValueTokens.length)
				return true;
		}
	}
	while (shouldGoUp(funcCallToken))
		funcCallToken = funcCallToken.parentNode;

	if (parameterValueTokens.length === 0)
		return false;

	const next = funcCallToken.getNextSibling();
	if (next === null) {
		return false;
	}
	else {
		if (bracketsNextTypes.has(next.type))
			return true;
		if (bracketsParentTypes.has(funcCallToken.parentNode.type)||
		bracketsParentTypes.has(funcCallToken.type))
			return true;
	}
	return false;
};