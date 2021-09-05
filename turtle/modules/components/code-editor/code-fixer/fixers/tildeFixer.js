import { moveArgsForParameterizedGroup } from './helpers/moveArgsForParameterizedGroup.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';

function isOfInterest(token) {
	return token.val === '~';
}

export function tildeFixer(cachedParseTree, fixLogger) {
	const tildeTokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isOfInterest);
	tildeTokens.forEach(function(tildeToken) {
		const parent = tildeToken.parentNode;
		tildeToken.remove();
		if (parent.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			moveArgsForParameterizedGroup(parent, parent.children.length + 1);
		}
		fixLogger.log(`Removed ~ because WebLogo does not support the tilde character unless it is part of a larger token such as a string literal.`, tildeToken);
	});
	cachedParseTree.tokensRemoved(tildeTokens);
};