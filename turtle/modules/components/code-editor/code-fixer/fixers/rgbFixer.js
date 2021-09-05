import { Colour } from
'../../../../Colour.js';
import { Command } from
'../../../../parsing/Command.js';
import { getAllDescendentsAsArray } from
'../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { isAlphaColor } from
'../../../../parsing/parse-tree-analysis/command-data-types/isAlphaColor.js';
import { ParseTreeTokenType } from
'../../../../parsing/ParseTreeTokenType.js';
await Colour.asyncInit();
await Command.asyncInit();

export const parentPrimaryNamesOfInterest = new Set([
	'localmake', 'make'
]);

function areTypesOfInterest(types) {
	if (typeof types !== 'string')
		return false;

	if (types.endsWith('|transparent'))
		types = types.substring(0, types.length - '|transparent'.length);

	if (isAlphaColor(types))
		return true;

	return false;
}

for (const info of Command.getAllCommandsInfo()) {
	if (info.args.length === 1 &&
	info.returnTypes === null) {
		const argInfo = info.args[0];
		if (areTypesOfInterest(argInfo.types)) {
			parentPrimaryNamesOfInterest.add(info.primaryName);
		}
	}
}

function getCurvedBracketExpressionFor(rgbToken) {
	const parent = rgbToken.parentNode;
	const curvedExpression = parent.nextSibling;
	if (curvedExpression.type !== ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)
		return;

	return curvedExpression;
}

function getRGBValuesFor(rgbToken) {
	const curvedExpression = getCurvedBracketExpressionFor(rgbToken);
	const result = [];
	if (curvedExpression === undefined)
		return result;

	for (const child of curvedExpression.children) {
		if (!child.isBracket() && child.children.length === 0 &&
		(child.type === ParseTreeTokenType.NUMBER_LITERAL ||
		(child.type === ParseTreeTokenType.LEAF && child.val !== ','))) {
			if (child.type === ParseTreeTokenType.NUMBER_LITERAL)
				result.push(child.val);
			else {
				const parts = child.val.split(',');
				for (const part of parts) {
					const val = parseInt(part);
					if (Number.isInteger(val))
						result.push(val);
				}
			}
		}
	}
	return result;
}

function isOfInterest(token) {
	if (token.val !== 'rgb')
		return false;

	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;

	const parentInfo = Command.getCommandInfo(parent.val);
	if (!parentPrimaryNamesOfInterest.has(parentInfo.primaryName))
		return false;

	const rgbValues = getRGBValuesFor(token);
	if (rgbValues.length !== 3)
		return false;

	return true;
}

export function rgbFixer(cachedParseTree, fixLogger) {
	const rgbCalls = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isOfInterest);
	rgbCalls.forEach(function(rgbToken) {
		const curvedBracketExpression = getCurvedBracketExpressionFor(rgbToken);
		const rgbValues = getRGBValuesFor(rgbToken);
		const colour = new Colour(rgbValues);
		const oldType = rgbToken.type;
		rgbToken.val = colour.toString();
		rgbToken.type = ParseTreeTokenType.STRING_LITERAL;
		cachedParseTree.tokenTypeChanged(rgbToken, oldType);
		const tokensRemoved = getAllDescendentsAsArray(curvedBracketExpression, true);
		curvedBracketExpression.remove();
		cachedParseTree.tokensRemoved(tokensRemoved);
		fixLogger.log(`Replaced rgb expression with "${rgbToken.val} because WebLogo does not support an rgb function.`, rgbToken);
	});
};