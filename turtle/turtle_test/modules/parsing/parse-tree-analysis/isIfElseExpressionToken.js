import { Command } from '../Command.js';
import { isInstructionList } from './isInstructionList.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function isIfElseExpressionToken(token) {
	if (token.children.length !== 3 ||
	token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(token.val);
	if (info === undefined || info.primaryName !== 'ifelse')
		return false;
	return !isInstructionList(token.parentNode);
};