import { Command } from
'../../../../parsing/Command.js';
import { ParseTreeTokenType } from
'../../../../parsing/ParseTreeTokenType.js';
import { validateIdentifier } from
'../../../../parsing/parse-tree-analysis/validateIdentifier.js';

function isOfInterest(token) {
	const nameToken = token.children[0];
	if (nameToken === undefined)
		return false;
	if (nameToken.type !== ParseTreeTokenType.LEAF &&
	nameToken.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	if (nameToken.lineIndex === token.lineIndex ||
	validateIdentifier(nameToken.val) !== undefined)
		return false;
	const info = Command.getCommandInfo(nameToken.val);
	if (info !== undefined)
		return false;

	const name = nameToken.val.toLowerCase();
	return name !== 'true' && name !== 'false';
}

export function procedureNameOnWrongLineFixer(cachedParseTree, fixLogger) {
	const startTokens = cachedParseTree.getTokensByType(ParseTreeTokenType.PROCEDURE_START_KEYWORD).
		filter(t => t.children.length !== 0 &&
			typeof t.children[0].val === 'string' &&
			validateIdentifier(t.val) === undefined);
	const procStartTokens = startTokens.filter(isOfInterest);
	if (procStartTokens.length !== 0) {
		const procedureNamesCorrectlyDefined = new Set();
		// avoid names that are defined more correctly in other places.
		for (const startToken of startTokens) {
			const nameToken = startToken.children[0];
			if (nameToken.lineIndex === startToken.lineIndex)
				procedureNamesCorrectlyDefined.add(nameToken.val.toLowerCase());
		}
		procStartTokens.forEach(function(startToken) {
			const nameToken = startToken.children[0];
			if (procedureNamesCorrectlyDefined.has(nameToken.val.toLowerCase()))
				return;

			nameToken.lineIndex = startToken.lineIndex;
			nameToken.colIndex = startToken.colIndex + 1;
			let lastToken = nameToken;
			const paramList = startToken.children[1];
			if (paramList !== undefined) {
				for (const child of paramList.children) {
					child.lineIndex = startToken.lineIndex;
					child.colIndex = lastToken.colIndex + child.val.length + 2;
					lastToken = child;
				}
			}
			fixLogger.log(`Moved procedure heading and all parameters to the same line since that is how procedures should generally be defined`, startToken);
		});
	}
};