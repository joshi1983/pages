import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

const declareChildTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
]);

export function validateLocalOrDeclare(token, parseLogger) {
	const expectedVal = token.type === ParseTreeTokenType.DECLARE ? '#declare' : '#local';
	const children = token.children;
	if (token.val !== expectedVal)
		parseLogger.error(`Expected val to be ${expectedVal} but found ${token.val}`, token);
	if (token.children.length !== 1)
		parseLogger.error(`Expected 1 child but found ${token.children.length}`, token);
	else {
		const child = token.children[0];
		if (!declareChildTypes.has(child.type))
			parseLogger.error(`Expected child of ${expectedVal} to be ${Array.from(declareChildTypes).map(t => ParseTreeTokenType.getNameFor(t)).join(',')} but got ${ParseTreeTokenType.getNameFor(child.type)}`, token);
		else if (child.val !== '=')
			parseLogger.error(`Expected child.val of ${expectedVal} to be = but got ${child.val}`, token);
	}
};