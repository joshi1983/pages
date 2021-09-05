import { isInstructionList } from './isInstructionList.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

// very similar to isFirstLevelInstruction from another module.
export function isInstructionListChild(token) {
	return isInstructionList(token.parentNode);
};

export function getInstructionListChildToken(token) {
	if (token === null || token.type === ParseTreeTokenType.TREE_ROOT || token.parentNode === null)
		return undefined; // indicate not found

	if (isInstructionListChild(token))
		return token;
	return getInstructionListChildToken(token.parentNode);
};