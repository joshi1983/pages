import { checkFirstAndLastVal } from './checkFirstAndLastVal.js';
import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const badChildTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK
]);

export function validateSubscript(token, parseLogger) {
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.SUBSCRIPT_EXPRESSION)
		parseLogger.error(`A SUBSCRIPT should not have a parent of type ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	checkFirstAndLastVal(token, '[', ']', parseLogger);
	const children = token.children;
	for (const child of children) {
		if (badChildTypes.has(child.type))
			parseLogger.error(`A SUBSCRIPT should not have a child of type ${ParseTreeTokenType.getNameFor(child.type)}`, token);
	}
};