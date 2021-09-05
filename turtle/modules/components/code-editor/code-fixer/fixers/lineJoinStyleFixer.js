import { Command } from
'../../../../parsing/Command.js';
import { LineJoinStyle } from
'../../../../drawing/vector/shapes/style/LineJoinStyle.js';
import { ParseTreeTokenType } from
'../../../../parsing/ParseTreeTokenType.js';
await Command.asyncInit();

function isOfInterest(token) {
	const children = token.children;
	if (children.length !== 1)
		return false;

	const info = Command.getCommandInfo(token.val);
	if (info === undefined || info.primaryName !== 'setLineJoinStyle')
		return false;

	const child = children[0];
	if (child.children.length !== 0)
		return false;

	if (child.type !== ParseTreeTokenType.LEAF &&
	child.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	
	return LineJoinStyle.parse(child.val.toLowerCase()) !== undefined;
}

export function lineJoinStyleFixer(cachedParseTree, fixLogger) {
	const setLineJoinStyleCalls = cachedParseTree.getTokensByType(
	ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterest);
	setLineJoinStyleCalls.forEach(function(call) {
		const firstChild = call.children[0];
		const oldType = firstChild.type;
		firstChild.type = ParseTreeTokenType.STRING_LITERAL;
		cachedParseTree.tokenTypeChanged(firstChild, oldType);
		fixLogger.log(`Quoted ${firstChild.val} because setLineJoinStyle requires a string.`, firstChild);
	});
};