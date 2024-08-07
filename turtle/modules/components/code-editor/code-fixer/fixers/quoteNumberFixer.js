import { Command } from '../../../../parsing/Command.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
await Command.asyncInit();

/*
Very similar to quoteIntegerFixer but quoteNumberFixer doesn't handle colour data types.
*/
const typesUsingNumber = new Set(['int', 'num']);
const commandsUsingNumber = new Set(Command.getAllCommandsInfo().filter(function(info) {
	return info.args.some(arg => typesUsingNumber.has(arg.types));
}).map(info => info.primaryName));

function isToBeChanged(t) {
	if (isNaN(t.val) || t.val === '' || t.parentNode === null)
		return false;
	if (t.parentNode.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(t.parentNode.val);
	if (info === undefined)
		return false;
	if (!commandsUsingNumber.has(info.primaryName))
		return false;
	const argIndex = t.parentNode.children.indexOf(t);
	if (info.args.length <= argIndex)
		return false;
	const types = info.args[argIndex].types;
	return typesUsingNumber.has(types);
}

export function quoteNumberFixer(cachedParseTree, fixLogger) {
	const tokensToChange = cachedParseTree.getTokensByType(ParseTreeTokenType.STRING_LITERAL).
		filter(isToBeChanged);
	tokensToChange.forEach(function(stringToken) {
		const oldValue = stringToken.val;
		stringToken.val = parseFloat(oldValue);
		stringToken.originalString = oldValue;
		stringToken.type = ParseTreeTokenType.NUMBER_LITERAL;
		cachedParseTree.tokenTypeChanged(stringToken, ParseTreeTokenType.STRING_LITERAL);
		cachedParseTree.tokenValueChanged(stringToken, oldValue);
		fixLogger.log(`Quote removed before number value ${stringToken.val} because number values are not to be prefixed with a quote.  A quote indicates a string.`, stringToken);
	});
};