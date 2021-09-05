import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

function shouldExpectColon(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.BODY)
		return false;

	return true;
}

function shouldExpectEndFunction(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.DEFERRED ||
	parent.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION)
		return false;

	return true;
}

function shouldExpectFormalArgList(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.BODY)
		return false;

	return true;
}

export function validateFunction(token, parseLogger) {
	const children = token.children;
	if (children.length > 2) {
		const first = children[0];
		const second = children[1];
		const lastChild = children[children.length - 1];
		const parent = token.parentNode;
		if (first.type !== ParseTreeTokenType.IDENTIFIER &&
		parent.type !== ParseTreeTokenType.DATA_TYPE_EXPRESSION)
			parseLogger.error(`Expected first child to be an identifier but got type ${ParseTreeTokenType.getNameFor(first.type)}`, token);

		if (shouldExpectFormalArgList(token)) {
			let argListToken = second;
			if (parent.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION)
				argListToken = first;
			if (argListToken.type !== ParseTreeTokenType.FORMAL_ARG_LIST)
				parseLogger.error(`Expected a child of this FUNCTION to be a FORMAL_ARG_LIST but found type ${ParseTreeTokenType.getNameFor(argListToken.type)}`, token);
		}
		if (shouldExpectColon(token)) {
			if (!token.children.some(c => c.type === ParseTreeTokenType.COLON))
				parseLogger.error(`Expected a COLON(:) for indicating return type to this FUNCTION but could not find it.`, token);
		}
		if (shouldExpectEndFunction(token)) {
			if (lastChild.type !== ParseTreeTokenType.END_FUNCTION)
				parseLogger.error(`Expected last child to be END_FUNCTION but got type ${ParseTreeTokenType.getNameFor(lastChild.type)}`, token);
		}
	}
	else
		parseLogger.error(`Expected at least 3 children but got ${children.length}`, token);
};