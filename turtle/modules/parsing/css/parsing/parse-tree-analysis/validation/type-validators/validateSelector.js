import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const parentTypes = new Set([
	ParseTreeTokenType.RULE_SET
]);

export function validateSelector(token, parseLogger) {
	const parent = token.parentNode;
	if (parent === null)
		parseLogger.error(`Parent of a SELECTOR not expected to be null`, token);
	else if (!parentTypes.has(parent.type)) {
		parseLogger.error(`Parent of a SELECTOR must be one of ${Array.from(parentTypes).map(t => ParseTreeTokenType.getNameFor(t)).join(',')} but found ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	}
	if (token.children.length === 0)
		parseLogger(`Expected at least 1 child for SELECTOR`, token);
};