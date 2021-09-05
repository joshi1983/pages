import { Command } from
'../../../../../parsing/Command.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

function isBracketToRemove(token) {
	return token.val === '(' ||
		token.val === ')';
}

function isUnneeded(expr) {
	if (expr.children.length === 3) {
		const middle = expr.children[1];
		if (middle.children.length === 0)
			return true;
		if (middle.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			const info = Command.getCommandInfo(middle.val);
			if (info !== undefined) {
				const argCount = Command.getArgCount(info);
				if (argCount !== undefined &&
				middle.children.length !== argCount.defaultCount) {
					return false;
				}
			}
		}
		else if (middle.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)
			return true;
		const parent = expr.parentNode;
		if (parent.type === ParseTreeTokenType.PARAMETERIZED_GROUP &&
		parent.children.length === 1) {
			return true;
		}
	}
	return false;
}

export function removeUnneededCurvedBrackets(cachedParseTree, fixLogger) {
	const curvedBracketExpressions = cachedParseTree.getTokensByType(ParseTreeTokenType.CURVED_BRACKET_EXPRESSION).
		filter(isUnneeded);
	const toRemove = [];
	for (const expr of curvedBracketExpressions) {
		const childrenToKeep = expr.children.filter(t => !isBracketToRemove(t));
		if (childrenToKeep.length === 1) {
			for (const child of expr.children) {
				if (isBracketToRemove(child)) {
					child.remove();
					toRemove.push(child);
				}
			}
			const middle = expr.children[0];
			const parent = expr.parentNode;
			middle.remove();
			parent.replaceChild(expr, middle);
			toRemove.push(expr);
			fixLogger.log(`Removed unneeded curved brackets`, middle);
		}
	}
	cachedParseTree.tokensRemoved(toRemove);
};