import { getNextArgToken } from
'../helpers/getNextArgToken.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';
import { wrapInList } from '../helpers/wrapInList.js';

function isIfToken(token) {
	return token !== null &&
	token.type === ParseTreeTokenType.PARAMETERIZED_GROUP &&
	token.val.toLowerCase() === 'if';
}

function thenTokenToIf(thenToken) {
	const prev = thenToken.previousSibling;
	if (isIfToken(prev))
		return prev;
	const parent = thenToken.parentNode;
	if (isIfToken(parent))
		return parent;
}

function isOfInterest(token) {
	if (token.val.toLowerCase() !== 'then')
		return false;
	const ifToken = thenTokenToIf(token);
	if (ifToken === undefined)
		return false;
	const instructionListToken = getNextArgToken(token);
	if (instructionListToken === null)
		return false;
	if (instructionListToken.type === ParseTreeTokenType.LIST)
		return true;
	return true;
}

export function thenFixer(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isOfInterest);
	if (tokens.length === 0)
		return;
	for (let i = 0; i < tokens.length; i++) {
		const thenToken = tokens[i];
		const instructionList = getNextArgToken(thenToken);
		if (instructionList === null) {
			// rare case but previous processing of "then" can lead to a null.
			// isOfInterest checks this is not null but 
			// the tree can be changed between that and here.
			// Give up on processing this one.
			tokens.splice(i, 1);
			i--; // nullify the i++ so i stays at the same index in next iteration.
			continue;
		}
		instructionList.remove();
		thenToken.parentNode.replaceChild(thenToken, instructionList);
		thenToken.remove();
		if (instructionList.type !== ParseTreeTokenType.LIST) {
			wrapInList(instructionList, cachedParseTree);
		}
	}
	cachedParseTree.tokensRemoved(tokens);
	fixLogger.log(`Removed ${tokens.length} then word${tokens.length !== 1 ? 's' : ''} because they are meaningless on their own in WebLogo.`, tokens[0]);
};