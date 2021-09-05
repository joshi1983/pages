import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

function canHaveMoreThanOneChild(token) {
	const firstChild = token.children[0];
	if (firstChild.type === ParseTreeTokenType.WILDCARD)
		return true;
	if (firstChild.type === ParseTreeTokenType.BINARY_OPERATOR &&
	firstChild.val === 'as')
		return true;
	return false;
}

export function validateExport(token, parseLogger) {
	if (token.children.length > 1) {
		if (!canHaveMoreThanOneChild(token))
			parseLogger.error(`If an export token has more than 1 child, the first should be a *.  The number of children found is ${token.children.length} and the first child has value ${firstChild.val}.`, token);
	}
};