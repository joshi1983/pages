import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

const tokenTypes = new Set([
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.THIS
]);

export function isPropertyReadToken(token) {
	if (!tokenTypes.has(token.type) || token.children.length !== 1)
		return false;
	const firstChild = token.children[0];
	if (firstChild.type !== ParseTreeTokenType.DOT)
		return false;
	const children = firstChild.children;
	if (children.length !== 1)
		return false;
	return children[0].type === ParseTreeTokenType.IDENTIFIER;
};

export function processPropertyRead(token, result, settings) {
	const propertyNameToken = token.children[0].children[0];
	result.trimRight();
	result.append(` ( getProperty "${token.val} "${propertyNameToken.val} ) `);
};