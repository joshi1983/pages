import { getMakeCommandNameForToken } from
'./helpers/getMakeCommandNameForToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function getPotentialVariableNames(token, options, names) {
	if (token.type === ParseTreeTokenType.IDENTIFIER) {
		const variableName = options.identifierRenameMap.get(token.val.toLowerCase());
		names.add(variableName);
	}
	if (token.type === ParseTreeTokenType.ARG_LIST ||
	token.type === ParseTreeTokenType.AS)
		return;
	for (const child of token.children) {
		getPotentialVariableNames(child, options, names);
	}
}

export function processDim(token, result, options) {
	result.processCommentsUpToToken(token);
	const makeCommand = getMakeCommandNameForToken(token);
	const names = new Set();
	getPotentialVariableNames(token, options, names);
	const sortedNames = Array.from(names);
	sortedNames.sort();
	for (const variableName of sortedNames) {
		result.append(`\n${makeCommand} "${variableName} []\n`);
	}
};