import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateTry(token, parseLogger) {
	const children = token.children;
	if (children.length === 0) {
		parseLogger.error(`Expected try to have at least 1 child but got 0`, token);
		return;
	}
	if (children[0])
	for (let i = 1; i < children.length; i++) {
		const child = children[i];
		if (child.type !== ParseTreeTokenType.CATCH &&
		child.type !== ParseTreeTokenType.FINALLY) {
			parseLogger.error(`Expected child to either be a CATCH or FINALLY but found ${ParseTreeTokenType.getNameFor(child.type)} or ${child.type}`, child);
		}
	}
};