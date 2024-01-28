import { Command } from '../../../../parsing/Command.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
await Command.asyncInit();

function isToBeChanged(t) {
	const val = t.val.toLowerCase();
	if ((val !== 'true') && (val !== 'false'))
		return false;
	if (t.parentNode.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(t.parentNode.val);
	if (info === undefined)
		return false;
	const argIndex = t.parentNode.children.indexOf(t);
	if (info.args.length <= argIndex)
		return false;
	const types = info.args[argIndex].types;
	return types === 'bool';
}

export function quoteBooleanFixer(cachedParseTree, fixLogger) {
	const tokensToChange = cachedParseTree.getTokensByType(ParseTreeTokenType.STRING_LITERAL).
		filter(isToBeChanged);
	tokensToChange.forEach(function(stringToken) {
		const oldValue = stringToken.val;
		stringToken.val = (oldValue.toLowerCase() === 'true');
		stringToken.originalString = oldValue;
		stringToken.type = ParseTreeTokenType.BOOLEAN_LITERAL;
		cachedParseTree.tokenTypeChanged(stringToken, ParseTreeTokenType.STRING_LITERAL);
		cachedParseTree.tokenValueChanged(stringToken, oldValue);
		fixLogger.log(`Quote removed before boolean value ${stringToken.val} because boolean values are not to be prefixed with a quote.  A quote indicates a string.`, stringToken);
	});
};