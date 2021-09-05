import { addSelectorToken } from './addSelectorToken.js';
import { getFirstPossibleSelectorChild } from './getFirstPossibleSelectorChild.js';
import { getGoodPreviousForSelector } from './getGoodPreviousForSelector.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { removeDeclarationIfNeeded } from './removeDeclarationIfNeeded.js';
import { shouldAddSelectorTokenForPrevious } from './shouldAddSelectorTokenForPrevious.js';

export function processSelectorChildToken(prev, next, settings) {
	prev = removeDeclarationIfNeeded(prev);
	prev = getGoodPreviousForSelector(prev);
	if (shouldAddSelectorTokenForPrevious(prev))
		prev = addSelectorToken(prev);
	if (prev.parentNode === null && settings !== undefined)
		prev = addSelectorToken(prev);
	else {
		const firstSelectorChild = getFirstPossibleSelectorChild(prev);
		if (firstSelectorChild !== undefined) {
			if (firstSelectorChild === prev)
				prev = addSelectorToken(prev);
			else
				addSelectorToken(firstSelectorChild);
		}
	}
	prev.appendChild(next);
	if (next.type === ParseTreeTokenType.PSEUDO_CLASS)
		return next;
	return prev;
};