import { Command } from '../../../../../../parsing/Command.js';
import { ParseTreeTokenType } from '../../../../../../parsing/ParseTreeTokenType.js';
await Command.asyncInit();
const primaryNamesOfInterest = new Map();
Command.getAllCommandsInfo().forEach(function(commandInfo) {
	const args = commandInfo.args;
	const indexes = [];
	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg.types === 'num')
			indexes.push(i);
	}
	if (indexes.length > 0) {
		primaryNamesOfInterest.set(commandInfo.primaryName, indexes);
	}
});

function getChildTokensOfInterest(token) {
	const info = Command.getCommandInfo(token.val);
	const indexes = primaryNamesOfInterest.get(info.primaryName);
	if (indexes === undefined)
		return [];
	const result = [];
	for (let i = 0; i < indexes.length; i++) {
		const index = indexes[i];
		const childToken = token.children[index];
		if (childToken !== undefined && childToken.type === ParseTreeTokenType.LIST && childToken.children.length === 3) {
			const openBracket = childToken.children[0];
			const closeBracket = childToken.children[2];
			if (openBracket.val === '[' && closeBracket.val === ']') {
				result.push(childToken);
			}
		}
	}
	return result;
}

function isOfInterest(token) {
	const info = Command.getCommandInfo(token.val);
	if (info === undefined || !primaryNamesOfInterest.has(info.primaryName))
		return false;
	return getChildTokensOfInterest(token).length !== 0;
}

export function removeSquareBracketsForNumberArguments(cachedParseTree, fixLogger) {
	const ofInterest = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterest);
	const removed = [];
	ofInterest.forEach(function(commandCallToken) {
		const children = getChildTokensOfInterest(commandCallToken);
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			const openBracket = child.children[0];
			const onlyChild = child.children[1];
			const closeBracket = child.children[2];
			openBracket.remove();
			closeBracket.remove();
			onlyChild.remove();
			commandCallToken.replaceChild(child, onlyChild);
			removed.push(openBracket, closeBracket, child);
		}
		fixLogger.log(`Removed square brackets around expression because WebLogo does not use them here.`, commandCallToken);
	});
	cachedParseTree.tokensRemoved(removed);
};