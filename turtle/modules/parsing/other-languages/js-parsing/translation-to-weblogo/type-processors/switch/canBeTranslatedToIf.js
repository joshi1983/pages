import { getFirstCaseBlock } from './getFirstCaseBlock.js';
import { getFirstCaseValueToken } from './getFirstCaseValueToken.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

const interestingTypes = new Set([
ParseTreeTokenType.CASE,
ParseTreeTokenType.DEFAULT
]);

function isOfInterest(token) {
	return interestingTypes.has(token.type);
}

export function canBeTranslatedToIf(switchToken) {
	const blockToken = switchToken.children[1];
	if (blockToken === undefined)
		return false;
	const childrenOfInterest = blockToken.children.filter(isOfInterest);
	if (childrenOfInterest.length !== 1)
		return false;
	if (getFirstCaseBlock(switchToken) === undefined)
		return false;
	if (getFirstCaseValueToken(switchToken) === undefined)
		return false;
	return true;
};