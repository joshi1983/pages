import { Command } from '../../../../parsing/Command.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';

function isOfInterest(token) {
	const children = token.children;
	if (children.length === 0)
		return false;

	const firstChild = children[0];
	if (firstChild.type !== ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)
		return false;

	const fChildren = firstChild.children;
	if (fChildren.length < 4)
		return false;

	const info = Command.getCommandInfo(token.val);
	if (info === undefined)
		return false;

	const firstParameterInfo = info.args[0];
	if (firstParameterInfo === undefined || !firstParameterInfo.types.startsWith('list'))
		return false;

	return true;
}

export function curvedBracketExpressionToListFixer(cachedParseTree, fixLogger) {
	const calls = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterest);
	calls.forEach(function(call) {
		const firstChild = call.children[0];
		const oldType = firstChild.type;
		firstChild.type = ParseTreeTokenType.LIST;
		const fChildren = firstChild.children;
		const fGrandchild = fChildren[0];
		const lGrandchild = fChildren[fChildren.length - 1];
		if (fGrandchild.type === ParseTreeTokenType.LEAF && fGrandchild.val === '(')
			fGrandchild.val = '[';
		if (lGrandchild.type === ParseTreeTokenType.LEAF && lGrandchild.val === ')')
			lGrandchild.val = ']';
		cachedParseTree.tokenTypeChanged(firstChild, oldType);
		fixLogger.log(`Replaced curved brackets with square brackets because that is how lists are expressed in WebLogo`, firstChild);
	});
	return calls.length !== 0;
};