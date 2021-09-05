import { badValueTokenTypes } from './badValueTokenTypes.js';
import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const parentTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.TREE_ROOT
]);

export function validateReturn(token, parseLogger) {
	const children = token.children;
	if (children.length > 1) {
		parseLogger.error(`Expected a RETURN to have 0 or 1 children but found ${children.length}`, token);
	}
	else if (children.length === 1) {
		const first = children[0];
		if (badValueTokenTypes.has(first.type))
			parseLogger.error(`Expected RETURN to have a child that evaluates to a data value but found ${ParseTreeTokenType.getNameFor(first.type)}`, token);
	}
	const parent = token.parentNode;
	if (!parentTypes.has(parent.type))
		parseLogger.error(`Expected RETURN to have a parent of a type in ${Array.from(parentTypes).map(ParseTreeTokenType.getNameFor).join(',')} but found ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
};