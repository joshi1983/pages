import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { shiftTokensToStartAt } from './helpers/shiftTokensToStartAt.js';

function isOfInterest(token) {
	if (token.val.toLowerCase() !== 'name' || token.nextSibling === null)
		return false;
	const varNameToken = token.nextSibling.nextSibling;
	if (varNameToken === null || !varNameToken.isStringLiteral())
		return false;
	return true;
}

export function nameCallFixer(cachedParseTree, fixLogger) {
	const nameCalls = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isOfInterest);
	nameCalls.forEach(function(nameCall) {
		const valueToken = nameCall.nextSibling;
		const varNameToken = valueToken.nextSibling;
		valueToken.remove();
		varNameToken.remove();

		nameCall.val = 'make';
		nameCall.appendChild(varNameToken);
		nameCall.appendChild(valueToken);
		nameCall.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
		cachedParseTree.tokenTypeChanged(nameCall, ParseTreeTokenType.LEAF);
		const newLocation = {
			'lineIndex': nameCall.lineIndex,
			'colIndex': nameCall.colIndex + varNameToken.toString().length
		};
		const newLocation2 = {
			'lineIndex': newLocation.lineIndex,
			'colIndex': newLocation.colIndex + 2
		};

		/* Adjust varNameToken's lineIndex and colIndex so it will be converted to code before any of valueToken's subtree */
		shiftTokensToStartAt(newLocation2, valueToken);

		varNameToken.lineIndex = newLocation.lineIndex;
		varNameToken.colIndex = newLocation.colIndex;

		fixLogger.log(`Converted a call to name to make because make does the same thing and is supported by WebLogo.  The name command is not supported by WebLogo because it is very rarely used in most Logo programs.  Having multiple ways to do exactly the same thing adds to the vocabulary people may feel pressure to learn and teach without adding enough benefit.`, nameCall);
	});
};