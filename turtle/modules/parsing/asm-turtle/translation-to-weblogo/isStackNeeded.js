import { getDescendentsOfType } from '../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isPushOrPop(token) {
	const name = token.val.toLowerCase();
	return name === 'push' || name === 'pop';
}

export function isStackNeeded(root) {
	const instructions = getDescendentsOfType(root, ParseTreeTokenType.INSTRUCTION);
	return instructions.some(isPushOrPop);
};