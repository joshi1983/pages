import { getFirstPossibleSelectorChild } from './getFirstPossibleSelectorChild.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function shouldAddSelectorTokenForPrevious(prev) {
	if (prev.parentNode === null)
		return true;
	if (prev.type === ParseTreeTokenType.DECLARATION_BLOCK && prev.children.length > 1) {
		let tok = prev;
		while (tok.children.length !== 0) {
			tok = tok.children[tok.children.length - 1];
		}
		if (tok.type === ParseTreeTokenType.IDENTIFIER)
			return true;
	}
	return getFirstPossibleSelectorChild(prev) !== undefined;
};