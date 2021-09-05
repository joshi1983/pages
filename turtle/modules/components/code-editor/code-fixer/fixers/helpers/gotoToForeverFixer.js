import { ParseTreeToken } from
'../../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

function isOfInterest(labelsMap) {
	return function(token) {
		const val = token.val.toLowerCase();
		if (val !== 'goto')
			return false;

		const next = token.nextSibling;
		if (next === null || typeof next.val !== 'string')
			return false;

		const correspondingLabel = labelsMap.get(next.val.toLowerCase());
		const parent = token.parentNode;
		if (correspondingLabel === undefined ||
		correspondingLabel.parentNode !== parent)
			return false;

		const indexOfLabel = parent.children.indexOf(correspondingLabel);
		const indexOfToken = parent.children.indexOf(token);
		if (indexOfLabel > indexOfToken)
			return false;

		return true;
	}
}

export function gotoToForeverFixer(cachedParseTree, fixLogger) {
	const labelsMap = new Map();
	for (const label of cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF)) {
		const next = label.nextSibling;
		if (next !== null &&
		next.type === ParseTreeTokenType.VARIABLE_READ &&
		next.val === '') {
			labelsMap.set(label.val.toLowerCase(), label);
		}
	}
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isOfInterest(labelsMap));
	tokens.forEach(function(token) {
		const labelNameToken = token.nextSibling;
		const label = labelsMap.get(labelNameToken.val.toLowerCase());
		const colonToken = label.nextSibling;
		const foreverToken = new ParseTreeToken('forever', null, colonToken.lineIndex, colonToken.colIndex, ParseTreeTokenType.PARAMETERIZED_GROUP);
		const foreverListToken = new ParseTreeToken(null, null, colonToken.lineIndex, colonToken.colIndex, ParseTreeTokenType.LIST);
		const openBracket = new ParseTreeToken('[', null, colonToken.lineIndex, colonToken.colIndex, ParseTreeTokenType.LEAF);
		const closeBracket = new ParseTreeToken(']', null, token.lineIndex, token.colIndex, ParseTreeTokenType.LEAF);
		const newTokens = [foreverToken, foreverListToken, openBracket, closeBracket];
		foreverListToken.appendChild(openBracket);
		const parent = token.parentNode;
		const indexOfLabel = parent.children.indexOf(colonToken);
		while (true) {
			const child = parent.children[indexOfLabel + 1];
			if (child === undefined || child === token)
				break;

			child.remove();
			foreverListToken.appendChild(child);
		}
		// remove the goto and its label parameter token.
		token.remove();
		labelNameToken.remove();

		foreverListToken.appendChild(closeBracket);
		foreverToken.appendChild(foreverListToken);
		colonToken.appendSibling(foreverToken);
		cachedParseTree.tokensRemoved([token, labelNameToken]);
		cachedParseTree.tokensAdded(newTokens);
		fixLogger.log(`Replaced a goto statement with a forever loop because WebLogo doesn't support goto statements and labels.`, token);
	});

	return tokens.length !== 0;
};