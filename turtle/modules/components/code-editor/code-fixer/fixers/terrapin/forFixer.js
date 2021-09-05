import { getNextArgToken } from '../helpers/getNextArgToken.js';
import { ParseTreeToken } from
'../../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

function isOfInterest(token) {
	if (token.val.toLowerCase() !== 'for')
		return false;

	const children = token.children;
	if (children.length === 0)
		return false;
	const firstChild = children[0];
	if (firstChild.type !== ParseTreeTokenType.STRING_LITERAL)
		return false;

	return getLastSettingToken(token) !== undefined;
}

function getLastSettingToken(forToken) {
	let result = forToken.nextSibling;
	for (let i = 0; i < 2; i++) {
		const next = getNextArgToken(result);
		if (next.type === ParseTreeTokenType.LIST)
			return result;
		result = next;
	}
}

function processFor(forToken, cachedParseTree) {
	const lastSettingArgToken = getLastSettingToken(forToken);
	const instructionListToken = getNextArgToken(lastSettingArgToken);
	const children = forToken.children;
	const firstChild = children[0];
	const leftBracket = new ParseTreeToken('[', null, firstChild.lineIndex, firstChild.colIndex - 1, 
		ParseTreeTokenType.LEAF);
	const rightBracket = new ParseTreeToken(']', null, lastSettingArgToken.lineIndex, lastSettingArgToken.colIndex + 1,
		ParseTreeTokenType.LEAF);
	const listToken = new ParseTreeToken(null, null, firstChild.lineIndex, firstChild.colIndex, ParseTreeTokenType.LIST);
	listToken.appendChild(leftBracket);
	let tok = firstChild;
	while (true) {
		const next = getNextArgToken(tok);
		tok.remove();
		listToken.appendChild(tok);
		if (tok === lastSettingArgToken)
			break;
		tok = next;
	}
	instructionListToken.remove();
	listToken.appendChild(rightBracket);
	forToken.appendChild(listToken);
	forToken.appendChild(instructionListToken);
	cachedParseTree.tokensAdded([leftBracket, listToken, rightBracket]);
}

export function forFixer(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterest);
	tokens.forEach(function(forToken) {
		processFor(forToken, cachedParseTree);
		fixLogger.log(`Added square brackets around for-loop settings because WebLogo requires them.`, forToken);
	});
};